import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ContactForm from "./components/ContactForm";

import ProductList from "./components/ProductList";
import ContactForm from "./components/ContactForm";

import "./styles/styles.css";

function App() {
    const [vistaActual, setVistaActual] = useState("inicio");

    const [carrito, setCarrito] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
  const [vistaActual, setVistaActual] = useState("inicio");

  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        const url = "http://localhost:5000/api/productos";

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
                console.error("Error al cargar los productos:", err);
                setError(err.message);
                setCargando(false);
            });
    }, []);

    function agregarAlCarrito(producto) {
        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find((item) => item.id === producto.id);

            if (productoExistente) {
                return prevCarrito.map((item) =>
                    item.id === producto.id
                        ? {
                              ...item,
                              cantidad: (item.cantidad || 1) + 1,
                          }
                        : item,
                );
            }

            return [
                ...prevCarrito,
                {
                    ...producto,
                    cantidad: 1,
                },
            ];
        });
    }

    const cartCount = carrito.reduce((total, producto) => total + producto.cantidad, 0);

    return (
        <>
            <Navbar cartCount={cartCount} onNavigate={setVistaActual} />
  useEffect(() => {
    const url = "http://localhost:5000/api/productos";

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
        console.error("Error al cargar los productos:", err);
        setError(err.message);
        setCargando(false);
      });
  }, []);

  function agregarAlCarrito(producto) {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id === producto.id,
      );

      if (productoExistente) {
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: (item.cantidad || 1) + 1,
              }
            : item,
        );
      }

      return [
        ...prevCarrito,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    });
  }

  const cartCount = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0,
  );

  return (
    <>
      <Navbar cartCount={cartCount} onNavigate={setVistaActual} />

            <main>
                {vistaActual === "inicio" && <Hero onExplore={() => setVistaActual("catalogo")} />}

                {vistaActual === "catalogo" && <ProductList setVista={setVistaActual} productos={productos} setProductoSeleccionado={setProductoSeleccionado} agregarAlCarrito={agregarAlCarrito} />}

                {vistaActual === "detalle" && <h1>Detalle del producto</h1>}

                {vistaActual === "contacto" && <ContactForm />}
            </main>

            <Footer />
        </>
    );
}

export default App;
