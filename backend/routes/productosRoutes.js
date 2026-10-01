const express = require("express");
const router = express.Router();

const productos = require("../data/productos");

router.get("/", (req, res) => {
    res.json(productos);
});

router.get("/:id", (req, res, next) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
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
