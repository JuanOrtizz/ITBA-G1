import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import "./styles/styles.css";

function App() {
    const [vistaActual, setVistaActual] = useState("inicio");
    const [cartCount, setCartCount] = useState(0);
    const [carrito, setCarrito] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [error, setError] = useState(null);

   useEffect(() => {
        const url = "http://localhost:3000/api/productos";
        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al conectar con el servidor");
                }
                return res.json();
            })
            .then((data) => {
                setProductos(data);
                setCargando(false);
            })
            .catch((err) => {
                console.error("Error al cargar el detalle:", err);
                setError(err.message);
                setCargando(false);
            });
    }, []);
    
    function agregarAlCarrito(producto) {
        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.id == producto.id);
            if (productoExistente) {
                return prevCarrito.map((item) => (item.id == producto.id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item));
            }
            // Si es nuevo, lo agregamos con cantidad inicial en 1
            return [...prevCarrito, { ...producto, cantidad: 1 }];
        });
    }
  
  
  
  return (
    <>
      <Navbar cartCount={cartCount} onNavigate={setVistaActual} />

      <main>
        {vistaActual === "inicio" && <Hero onExplore={() => setVistaActual("catalogo")} />}

        {vistaActual === "productos" && <ProductList setVista={setVistaActual} productos={productos} setProductoSeleccionado={setProductoSeleccionado} agregarAlCarrito={agregarAlCarrito} />}

        {vistaActual === "detalle" && <h1>Detalle del producto</h1>}

        {vistaActual === "contacto" && <h1>Contacto</h1>}
      </main>

      <Footer />
    </>
  );

}

export default App;
