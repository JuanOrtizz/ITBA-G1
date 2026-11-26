const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Crear un nuevo pedido y descontar stock en MongoDB
 * @access  Privado (JWT)
 */
router.post("/", authMiddleware, async (req, res, next) => {
    const descontados = [];

    const revertirStock = async () => {
        for (const item of descontados) {
            try {
                await Product.findByIdAndUpdate(item.id, {
                    $inc: { stock: item.cantidad },
                });
            } catch (revertError) {
                console.error("Error al revertir stock:", revertError);
            }
        }
    };

    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "El carrito está vacío o el formato de ítems no es válido",
            });
        }

        // 1. Validar IDs/cantidades y agrupar si algún producto viene repetido
        const cantidadesPorProducto = new Map();

        for (const item of items) {
            const prodId = String(item.producto || item._id || item.id || "").trim();
            const cantidad = Number(item.cantidad);

            if (!mongoose.Types.ObjectId.isValid(prodId)) {
                return res.status(400).json({
                    error: "Uno de los productos del carrito tiene un ID inválido",
                });
            }

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                return res.status(400).json({
                    error: "La cantidad de cada producto debe ser un número entero mayor a 0",
                });
            }

            cantidadesPorProducto.set(
                prodId,
                (cantidadesPorProducto.get(prodId) || 0) + cantidad
            );
        }

        // 2. Consultar los productos reales en MongoDB y validar stock disponible
        const ids = Array.from(cantidadesPorProducto.keys());
        const productosBD = await Product.find({ _id: { $in: ids } });
        const mapaProductos = new Map(
            productosBD.map((prod) => [String(prod._id), prod])
        );

        for (const [prodId, cantidad] of cantidadesPorProducto.entries()) {
            const productoBD = mapaProductos.get(prodId);

            if (!productoBD) {
                return res.status(404).json({
                    error: "Uno de los productos del carrito ya no existe en el catálogo",
                });
            }

            if (productoBD.stock < cantidad) {
                return res.status(400).json({
                    error: `Stock insuficiente para "${productoBD.nombre}". Disponible: ${productoBD.stock}`,
                });
            }
        }

        // 3. Descontar stock en MongoDB de forma atómica (evita stock negativo)
        for (const [prodId, cantidad] of cantidadesPorProducto.entries()) {
            const productoBD = mapaProductos.get(prodId);

            const actualizado = await Product.findOneAndUpdate(
                { _id: prodId, stock: { $gte: cantidad } },
                { $inc: { stock: -cantidad } },
                { new: true }
            );

            if (!actualizado) {
                await revertirStock();
                return res.status(400).json({
                    error: `Stock insuficiente para "${productoBD.nombre}". Actualizá la página e intentá de nuevo.`,
                });
            }

            descontados.push({ id: prodId, cantidad });
        }

        // 4. Armar ítems y total usando los datos reales de la base
        const itemsSanitizados = Array.from(cantidadesPorProducto.entries()).map(
            ([prodId, cantidad]) => {
                const productoBD = mapaProductos.get(prodId);
                return {
                    producto: productoBD._id,
                    nombre: productoBD.nombre,
                    precio: Number(productoBD.precio) || 0,
                    cantidad,
                    imagenUrl: productoBD.imagenUrl || "",
                };
            }
        );

        const totalCalculado = itemsSanitizados.reduce(
            (acc, item) => acc + item.precio * item.cantidad,
            0
        );

        // 5. Crear el pedido asociado al usuario autenticado
        const nuevoPedido = await Order.create({
            usuario: req.user.id,
            items: itemsSanitizados,
            total: totalCalculado,
            estado: "confirmado",
        });

        return res.status(201).json({
            mensaje: "Pedido creado con éxito",
            order: nuevoPedido,
        });
    } catch (error) {
        if (descontados.length > 0) {
            await revertirStock();
        }
        next(error);
    }
});

/**
 * @route   GET /api/orders/my
 * @desc    Consultar el historial de pedidos del usuario autenticado
 * @access  Privado (JWT)
 */
router.get("/my", authMiddleware, async (req, res, next) => {
    try {
        // Filtrar exclusivamente por el usuario autenticado
        const pedidos = await Order.find({ usuario: req.user.id })
            .populate("items.producto", "nombre precio imagenUrl categoria")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            pedidos,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;