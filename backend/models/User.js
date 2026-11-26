const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "El email es obligatorio"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Por favor ingrese un email válido",
            ],
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
        },
        rol: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Ocultar password en cualquier serialización JSON
userSchema.methods.toJSON = function () {
    const userObj = this.toObject();
    delete userObj.password;
    return userObj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
