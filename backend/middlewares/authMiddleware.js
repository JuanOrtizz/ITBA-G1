const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Acceso no autorizado. Token ausente o formato inválido (debe ser Bearer <token>)",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "Acceso no autorizado. Token no proporcionado",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Adjuntamos la identidad validada del JWT
        req.user = {
            id: decoded.id,
            email: decoded.email,
            rol: decoded.rol,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "El token ha expirado" });
        }
        return res.status(401).json({ error: "Token inválido o firma alterada" });
    }
};

module.exports = authMiddleware;
