const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre del producto es obligatorio"],
            trim: true,
        },
        categoria: {
            type: String,
            trim: true,
            default: "A definir"
        },
        precio: {
            type: Number,
            required: [true, "El precio es obligatorio"],
            min: [0, "El precio no puede ser negativo"],
        },
        imagenUrl: {
            type: String,
            trim: true,
            default: "",
        },
        descripcion: {
            type: String,
            trim: true,
            default: "",
        },
        detalles: {
            type: Map,
            of: String,
            default: {},
        },
        stock: {
            type: Number,
            default: 0,
            min: [0, "El stock no puede ser negativo"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
