const express = require("express");
const router = express.Router();

const productos = require("../data/productos");

router.get("/", (req, res) => {
    res.json(productos);
});

router.get("/:id", (req, res, next) => {
    // Solo dígitos: parseInt("1abc") devolvería 1 y respondería un producto
    if (!/^\d+$/.test(req.params.id)) {
        const error = new Error("El id debe ser un número entero positivo");
        error.status = 400;
        return next(error);
    }

    const producto = productos.find(p => p.id === Number(req.params.id));
    if(!producto) {
        const error = new Error("Producto no encontrado");
        error.status = 404;
        return next(error);
    }
    res.json(producto);
});

router.post("/", (req, res) => {
    const nuevoProducto = req.body;
    console.log("Producto recibido: ", nuevoProducto);
    res.status(201).json({ 
        estado: "exito",
        producto_recibido: nuevoProducto});
});

module.exports = router;
