const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const productosRoutes = require("./routes/productosRoutes");

const PORT = process.env.PORT || 5000;

app.use(logger);
app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/api/productos", productosRoutes);

app.get("/", (req, res) => {
    res.send("¡Bienvenido al servidor de Muebleria Jota!");
});

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
});

