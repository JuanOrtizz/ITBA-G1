const express = require("express");
const Order = require("../models/Order");
require("../models/Product"); // Asegura que el esquema Product esté registrado en Mongoose para el populate
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Crear un nuevo pedido asociado al usuario autenticado
 * @access  Privado (JWT)
 */
router.post("/", authMiddleware, async (req, res, next) => {
    try {
        const { items, total } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "El carrito está vacío o el formato de ítems no es válido",
            });
        }

        // Validación y sanitización de ítems
        const itemsSanitizados = items.map((item) => {
            const prodId = item.producto || item._id || item.id;
            return {
                producto: prodId,
                nombre: item.nombre || "Producto sin nombre",
                precio: Number(item.precio) || 0,
                cantidad: Number(item.cantidad) || 1,
                imagenUrl: item.imagenUrl || "",
            };
        });

        // Calcular total si no viene dado o verificarlo
        const totalCalculado =
            typeof total === "number" && total >= 0
                ? total
                : itemsSanitizados.reduce(
                      (acc, item) => acc + item.precio * item.cantidad,
                      0
                  );

        // Fuente de verdad: el ID proviene del token validado por authMiddleware
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
