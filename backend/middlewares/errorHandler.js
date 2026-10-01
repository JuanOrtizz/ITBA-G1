const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const codigoEstado = err.status || 500;
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${codigoEstado} ${err.message}`);
    res.status(codigoEstado).json({
        mensaje: err.message || "Ha ocurrido un error en el servidor",
        stack: process.env.NODE_ENV === "production" ? "eh?" : err.stack,
    });
};

module.exports = { notFound, errorHandler };