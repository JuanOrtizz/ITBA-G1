const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/productos - Listar todos los productos
router.get("/", async (req, res, next) => {
    try {
        const productos = await Product.find().sort({ createdAt: -1 });
        res.json(productos);
    } catch (error) {
        next(error);
    }
});

// GET /api/productos/:id - Obtener detalle de un producto por ID
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "El ID proporcionado no tiene un formato válido" });
    }

    try {
        const producto = await Product.findById(id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        next(error);
    }
});

// POST /api/productos - Crear un nuevo producto
router.post("/", async (req, res, next) => {
    try {
        const { nombre, categoria, precio, imagenUrl, descripcion, detalles, stock } = req.body;

        // Validación preventiva antes de persistir
        if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
            return res.status(400).json({ message: "El campo 'nombre' es obligatorio y no puede estar vacío" });
        }

        if (precio === undefined || precio === null || isNaN(Number(precio)) || Number(precio) < 0) {
            return res.status(400).json({ message: "El campo 'precio' es obligatorio y debe ser un número mayor o igual a 0" });
        }

        if (stock !== undefined && stock !== null && (isNaN(Number(stock)) || Number(stock) < 0)) {
            return res.status(400).json({ message: "El campo 'stock' debe ser un número mayor o igual a 0" });
        }

        const nuevoProducto = await Product.create({
            nombre: nombre.trim(),
            categoria: categoria !== undefined ? categoria.trim() : "A definir",
            precio: Number(precio),
            imagenUrl: typeof imagenUrl === "string" ? imagenUrl.trim() : "",
            descripcion: typeof descripcion === "string" ? descripcion.trim() : "",
            detalles: detalles || {},
            stock: stock !== undefined && stock !== null ? Number(stock) : 0,
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
});

// PUT /api/productos/:id - Actualizar un producto existente
router.put("/:id", async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "El ID proporcionado no tiene un formato válido" });
    }

    try {
        const productoActualizado = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado para actualizar" });
        }

        res.json(productoActualizado);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
});

// DELETE /api/productos/:id - Eliminar un producto por ID
router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "El ID proporcionado no tiene un formato válido" });
    }

    try {
        const productoEliminado = await Product.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no encontrado para eliminar" });
        }

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
