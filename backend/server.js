const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const productosRoutes = require("./routes/productosRoutes");

const PORT = 3000;

app.use(logger);
app.use(cors());
app.use(express.json());
app.use("/assets", express.static("assets"));
app.use("/api/productos", productosRoutes);

app.get("/", (req, res) => {
    res.send("¡Bienvenido al servidor de Muebleria Jota!");
});

app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
});

