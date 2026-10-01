const errorHandler = (err, req, res, next) => {
    const codigoEstado = err.status || 500;
    console.error(err.message, err.stack);
    res.status(codigoEstado).json({
        mensaje: err.message || "Ha ocurrido un error en el servidor",
        stack: process.env.NODE_ENV === "production" ? "eh?" : err.stack,
    });
};

module.exports = errorHandler;