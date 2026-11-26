const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */
router.post("/register", async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;

        // 1. Validaciones básicas de entrada
        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: "Por favor complete todos los campos obligatorios: nombre, email y password",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "La contraseña debe tener al menos 6 caracteres",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Comprobar si el usuario ya existe
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({
                error: "El email ya se encuentra registrado",
            });
        }

        // 3. Hashear password con salt rounds
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Crear usuario en MongoDB
        const nuevoUsuario = await User.create({
            nombre: nombre.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        // 5. Responder limpio (el método toJSON de User omite password)
        return res.status(201).json({
            mensaje: "Usuario registrado con éxito",
            user: nuevoUsuario,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión y obtener JWT
 * @access  Público
 */
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Debe ingresar email y contraseña",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 1. Buscar usuario
        const usuario = await User.findOne({ email: normalizedEmail });
        if (!usuario) {
            return res.status(401).json({
                error: "Credenciales inválidas",
            });
        }

        // 2. Comparar contraseñas
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Credenciales inválidas",
            });
        }

        // 3. Firmar JWT
        const payload = {
            id: usuario._id,
            email: usuario.email,
            rol: usuario.rol,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // 4. Devolver token y datos mínimos de usuario
        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
