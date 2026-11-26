const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        nombre: {
            type: String,
            required: true,
        },
        precio: {
            type: Number,
            required: true,
            min: 0,
        },
        cantidad: {
            type: Number,
            required: true,
            min: [1, "La cantidad mínima es 1"],
        },
        imagenUrl: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "El usuario es obligatorio"],
        },
        items: {
            type: [orderItemSchema],
            validate: {
                validator: function (val) {
                    return Array.isArray(val) && val.length > 0;
                },
                message: "El pedido debe contener al menos un producto",
            },
        },
        total: {
            type: Number,
            required: [true, "El total del pedido es obligatorio"],
            min: 0,
        },
        estado: {
            type: String,
            enum: ["pendiente", "confirmado", "enviado", "entregado", "cancelado"],
            default: "confirmado",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
