const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error("Error crítico: La variable MONGODB_URI no está definida en el entorno.");
        process.exit(1);
    }

    try {
        const options = {};
        // En entornos de desarrollo local en Windows/redes con inspección SSL, permitir certificados del sistema
        if (process.env.NODE_ENV !== "production") {
            options.tlsAllowInvalidCertificates = true;
        }

        const conn = await mongoose.connect(mongoUri, options);
        console.log(`MongoDB Atlas conectado exitosamente: ${conn.connection.host}`);
    } catch (error) {
        // Regla de integración: No exponer credenciales ni aceptar tráfico si falla
        console.error(`Fallo crítico al conectar a MongoDB Atlas: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
