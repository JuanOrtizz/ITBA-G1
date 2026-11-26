const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @route   GET /api/users/me
 * @desc    Obtener datos del usuario autenticado
 * @access  Privado (JWT)
 */
router.get("/me", authMiddleware, async (req, res, next) => {
    try {
        const usuario = await User.findById(req.user.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.status(200).json({
            user: usuario,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/users/me
 * @desc    Actualizar nombre y email del usuario autenticado
 * @access  Privado (JWT)
 */
router.put("/me", authMiddleware, async (req, res, next) => {
    try {
        const { nombre, email } = req.body;

        if (typeof nombre !== "string" || typeof email !== "string") {
            return res.status(400).json({
                error: "Nombre y email son obligatorios",
            });
        }

        const normalizedNombre = nombre.trim();
        const normalizedEmail = email.trim().toLowerCase();

        // Validar nombre de usuario (mismas reglas que en /register)
        if (!normalizedNombre) {
            return res.status(400).json({
                error: "El nombre de usuario no puede estar vacío",
            });
        }
        if (normalizedNombre.length < 3 || normalizedNombre.length > 20) {
            return res.status(400).json({
                error: "El nombre de usuario debe tener entre 3 y 20 caracteres",
            });
        }
        if (/\s/.test(normalizedNombre)) {
            return res.status(400).json({
                error: "El nombre de usuario no puede tener espacios",
            });
        }

        // Validar email
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({
                error: "Por favor ingrese un email válido",
            });
        }

        // Verificar que el email no esté en uso por otro usuario
        const emailEnUso = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: req.user.id },
        });
        if (emailEnUso) {
            return res.status(400).json({
                error: "Ese email ya está registrado en otra cuenta",
            });
        }

        // Actualizar únicamente nombre y email (nunca rol ni password)
        const usuarioActualizado = await User.findByIdAndUpdate(
            req.user.id,
            {
                nombre: normalizedNombre,
                email: normalizedEmail,
            },
            { new: true, runValidators: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Firmar un token actualizado (mantiene el rol y actualiza el email en el JWT)
        const token = jwt.sign(
            {
                id: usuarioActualizado._id,
                email: usuarioActualizado.email,
                rol: usuarioActualizado.rol,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            mensaje: "Perfil actualizado con éxito",
            token,
            user: {
                id: usuarioActualizado._id,
                _id: usuarioActualizado._id,
                nombre: usuarioActualizado.nombre,
                email: usuarioActualizado.email,
                rol: usuarioActualizado.rol,
                createdAt: usuarioActualizado.createdAt,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: "Ese email ya está registrado en otra cuenta",
            });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
});

module.exports = router;