const ERROR_POR_ESTADO = {
    400: "Bad Request",
    404: "Not Found",
    500: "Internal Server Error",
};

const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const codigoEstado = err.status || 500;
    const mensaje = err.message || "Ha ocurrido un error en el servidor";

    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${codigoEstado} ${mensaje}`);
    if (process.env.NODE_ENV !== "production" && err.stack) {
        console.error(err.stack);
    }

    res.status(codigoEstado).json({
        error: ERROR_POR_ESTADO[codigoEstado] || "Error",
        mensaje,
    });
};

module.exports = { notFound, errorHandler };