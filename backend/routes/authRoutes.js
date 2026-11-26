const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarPassword(password) {
    if (typeof password !== "string" || password === "") {
        return "La contraseña es obligatoria";
    }
    if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres";
    }
    if (/\s/.test(password)) {
        return "La contraseña no puede contener espacios";
    }
    if (!/[A-Z]/.test(password)) {
        return "La contraseña debe incluir al menos una letra mayúscula";
    }
    if (!/[^A-Za-z0-9\s]/.test(password)) {
        return "La contraseña debe incluir al menos un símbolo (ej: . _ - ! @ # $)";
    }
    return null;
}

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */
router.post("/register", async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;

        // 1. Validar tipos y presencia
        if (
            typeof nombre !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                error: "Por favor complete todos los campos obligatorios: nombre, email y password",
            });
        }

        const normalizedNombre = nombre.trim();
        const normalizedEmail = email.trim().toLowerCase();

        // 2. Validar nombre de usuario
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

        // 3. Validar email
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({
                error: "Por favor ingrese un email válido",
            });
        }

        // 4. Validar contraseña fuerte antes de hashear
        const errorPassword = validarPassword(password);
        if (errorPassword) {
            return res.status(400).json({ error: errorPassword });
        }

        // 5. Comprobar si el usuario ya existe
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({
                error: "El email ya se encuentra registrado",
            });
        }

        // 6. Hashear password con salt rounds
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 7. Crear usuario en MongoDB
        const nuevoUsuario = await User.create({
            nombre: normalizedNombre,
            email: normalizedEmail,
            password: hashedPassword,
        });

        // 8. Responder limpio (el método toJSON de User omite password)
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

        if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
            return res.status(400).json({
                error: "Debe ingresar email y contraseña",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({
                error: "Por favor ingrese un email válido",
            });
        }

        const errorPassword = validarPassword(password);
        if (errorPassword) {
            return res.status(400).json({ error: errorPassword });
        }

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