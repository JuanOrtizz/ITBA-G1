import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useParams,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import FeaturedProducts from "./components/FeaturedProducts";

import "./styles/styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function NotFound() {
  return (
    <section className="catalogo-estado">
      <h1>Página no encontrada</h1>
      <p>La página que buscás no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}

function DetalleRuta({ onAddToCart, onBack }) {
  const { id } = useParams();

  return (
    <ProductDetail productoId={id} onAddToCart={onAddToCart} onBack={onBack} />
  );
}

function App() {
  const navegarA = useNavigate();
  const location = useLocation();
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  function navegarVista(vista, productoId = null) {
    if (vista === "inicio") navegarA("/");
    if (vista === "catalogo") navegarA("/productos");
    if (vista === "contacto") navegarA("/contacto");
    if (vista === "detalle" && productoId != null) {
      navegarA(`/productos/${productoId}`);
    }
  }

  useEffect(() => {
    fetch(`${API_URL}/api/productos`)
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

  useEffect(() => {
    if (!carritoAbierto) return;

    const cerrarConEscape = (e) => {
      if (e.key === "Escape") setCarritoAbierto(false);
    };

    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [carritoAbierto]);

  // Cada cambio de vista arranca desde arriba de la página. "instant" evita
  // la animación del scroll-behavior: smooth que tiene el html en styles.css
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

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

  function cambiarCantidad(productoId, cambio) {
    setCarrito((carritoActual) =>
      carritoActual
        .map((producto) =>
          producto.id === productoId
            ? {
                ...producto,
                cantidad: producto.cantidad + cambio,
              }
            : producto,
        )
        .filter((producto) => producto.cantidad > 0),
    );
  }

  function eliminarDelCarrito(productoId) {
    setCarrito((carritoActual) =>
      carritoActual.filter((producto) => producto.id !== productoId),
    );
  }

  const cartCount = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0,
  );

  const totalCarrito = carrito.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0,
  );

  return (
    <>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCarritoAbierto(true)}
      />

      {carritoAbierto && (
        <div
          id="panel-carrito"
          className="is-open"
          onClick={(e) => {
            // Solo cierra si el click fue en el fondo, no dentro del panel
            if (e.target === e.currentTarget) setCarritoAbierto(false);
          }}
        >
          <div className="carrito-panel__contenido">
            <div className="carrito-panel__encabezado">
              <h2>Tu carrito</h2>

              <button
                type="button"
                className="carrito-panel__cerrar"
                aria-label="Cerrar carrito"
                onClick={() => setCarritoAbierto(false)}
              >
                &times;
              </button>
            </div>

            <div className="carrito-panel__productos">
              {carrito.length === 0 ? (
                <p>Tu carrito está vacío.</p>
              ) : (
                carrito.map((producto) => (
                  <div className="carrito-item" key={producto._id}>
                    <img src={producto.imagenUrl} alt={producto.nombre} />

                    <div>
                      <h3>{producto.nombre}</h3>
                      <div className="controles-cantidad">
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(producto.id, -1)}
                        >
                          -
                        </button>

                        <span>{producto.cantidad}</span>

                        <button
                          type="button"
                          onClick={() => cambiarCantidad(producto.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <p>
                        $
                        {(producto.precio * producto.cantidad).toLocaleString(
                          "es-AR",
                        )}
                      </p>
                      <button
                        type="button"
                        className="boton-eliminar-item"
                        onClick={() => eliminarDelCarrito(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="carrito-panel__pie">
              <div className="carrito-panel__total">
                <span>Total:</span>
                <strong>${totalCarrito.toLocaleString("es-AR")}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero onExplore={() => navegarA("/productos")} />

                <FeaturedProducts
                  productos={productos}
                  setVista={navegarVista}
                  cargando={cargando}
                  error={error}
                  setProductoSeleccionado={setProductoSeleccionado}
                />
              </>
            }
          />

          <Route
            path="/productos"
            element={
              <ProductList
                setVista={navegarVista}
                productos={productos}
                cargando={cargando}
                error={error}
                setProductoSeleccionado={setProductoSeleccionado}
                agregarAlCarrito={agregarAlCarrito}
              />
            }
          />

          <Route
            path="/productos/:id"
            element={
              <DetalleRuta
                onAddToCart={agregarAlCarrito}
                onBack={() => navegarA("/productos")}
              />
            }
          />

          <Route path="/contacto" element={<ContactForm />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
