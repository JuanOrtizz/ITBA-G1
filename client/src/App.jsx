import { useState, useEffect } from "react";
import "./App.css";
import ProductList from "./components/ProductList";

function App() {
    const [vista, setVista] = useState("home");
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
            
            
            <main>
                
                
                {vista === "productos" && <ProductList setVista={setVista} productos={productos} setProductoSeleccionado={setProductoSeleccionado} agregarAlCarrito={agregarAlCarrito} />}
                
                
                
            </main>
        
        
        </>
        
    );
}

export default App;
