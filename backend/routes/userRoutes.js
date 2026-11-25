const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

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

module.exports = router;
