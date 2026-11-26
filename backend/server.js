// 1. Cargar dotenv al inicio absoluto antes de acceder a process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const productosRoutes = require("./routes/productosRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Configuración de CORS segura según el entorno
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "https://itba-g1.vercel.app",
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir solicitudes sin origin (como herramientas de prueba cURL/Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
            callback(null, true);
        } else {
            callback(new Error("Acceso bloqueado por política de CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Rutas de la API
app.use("/api/productos", productosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "API REST de Mueblería Hermanos Jota operativa",
        endpoints: {
            productos: "/api/productos",
            auth: {
                registro: "POST /api/auth/register",
                login: "POST /api/auth/login"
            },
            usuarios: {
                perfil: "GET /api/users/me (JWT requerido)"
            },
            pedidos: {
                crear: "POST /api/orders (JWT requerido)",
                misPedidos: "GET /api/orders/my (JWT requerido)"
            }
        },
    });
});

// Middlewares de cierre
app.use(notFound);
app.use(errorHandler);

// 3. Inicio del servidor: SOLO aceptar tráfico si la conexión a Atlas es exitosa
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT} [Entorno: ${process.env.NODE_ENV || "development"}]`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor debido a un fallo en la base de datos.");
        process.exit(1);
    }
};

startServer();
