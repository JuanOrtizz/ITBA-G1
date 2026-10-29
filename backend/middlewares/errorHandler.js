const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let codigoEstado = err.status || 500;
    let mensaje = err.message || "Ha ocurrido un error inesperado en el servidor";

    // Manejo de errores específicos de Mongoose
    if (err.name === "CastError") {
        codigoEstado = 400;
        mensaje = "Identificador o parámetro con formato inválido";
    } else if (err.name === "ValidationError") {
        codigoEstado = 400;
        mensaje = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ") || "Error de validación en los datos enviados";
    }

    // Registro seguro en consola del servidor (sin exponer secretos)
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${codigoEstado}: ${mensaje}`);
    
    if (process.env.NODE_ENV !== "production" && err.stack) {
        console.error(err.stack);
    }

    // Respuesta limpia y consistente al cliente según el contrato acordado
    res.status(codigoEstado).json({
        message: mensaje,
    });
};

module.exports = { notFound, errorHandler };
