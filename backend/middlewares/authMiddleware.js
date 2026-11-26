const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const msg = "Acceso no autorizado. Token ausente o formato inválido (debe ser Bearer <token>)";
            return res.status(401).json({ error: msg, message: msg });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            const msg = "Acceso no autorizado. Token no proporcionado";
            return res.status(401).json({ error: msg, message: msg });
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
            const msg = "El token ha expirado";
            return res.status(401).json({ error: msg, message: msg });
        }
        const msg = "Token inválido o firma alterada";
        return res.status(401).json({ error: msg, message: msg });
    }
};

const esAdmin = (req, res, next) => {
    if (!req.user || req.user.rol !== "admin") {
        const msg = "Acceso denegado. Se requieren permisos de administrador";
        return res.status(403).json({ error: msg, message: msg });
    }
    next();
};

authMiddleware.esAdmin = esAdmin;

module.exports = authMiddleware;