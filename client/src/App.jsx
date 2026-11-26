import { useState, useEffect, useRef, useCallback } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import CartPanel from "./components/CartPanel";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import FeaturedProducts from "./components/FeaturedProducts";
import CreateProduct from "./components/CreateProduct";
import EditProduct from "./components/EditProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

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

function PerfilProvisorio() {
  return (
    <section className="catalogo-estado">
      <h1>Perfil de usuario</h1>
    </section>
  );
}

function MisPedidosProvisorio() {
  return (
    <section className="catalogo-estado">
      <h1>Mis pedidos</h1>
    </section>
  );
}

function App() {
  const navegarA = useNavigate();
  const location = useLocation();
  const [productos, setProductos] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const ultimaCarga = useRef(0);

  function navegarVista(vista, productoId = null) {
    if (vista === "inicio") navegarA("/");
    if (vista === "catalogo") navegarA("/productos");
    if (vista === "contacto") navegarA("/contacto");
    if (vista === "detalle" && productoId != null) {
      navegarA(`/productos/${productoId}`);
    }
  }

  const cargarProductos = useCallback(async () => {
    const cargaActual = ++ultimaCarga.current;

    try {
      const res = await fetch(`${API_URL}/api/productos`);

      if (!res.ok) {
        throw new Error("Error al conectar con el servidor");
      }

      const data = await res.json();

      if (cargaActual !== ultimaCarga.current) return;

      setProductos(data);
      setError(null);
    } catch (err) {
      if (cargaActual !== ultimaCarga.current) return;

      console.error("Error al cargar los productos:", err);
      setError(err.message);
    } finally {
      if (cargaActual === ultimaCarga.current) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    //eslint-disable-next-line react-hooks/set-state-in-effect
    cargarProductos();
  }, [cargarProductos]);

  function quitarProductoEliminado(productoId) {
    ultimaCarga.current++;

    setProductos((actuales) =>
      actuales.filter((producto) => producto._id !== productoId),
    );

    cargarProductos();
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <CartPanel />

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
                />
              </>
            }
          />

          <Route
            path="/productos"
            element={
              <ProductList
                productos={productos}
                cargando={cargando}
                error={error}
              />
            }
          />

          <Route
            path="/productos/:id"
            element={
              <ProductDetail
                onBack={() => navegarA("/productos")}
                onDelete={quitarProductoEliminado}
              />
            }
          />

          <Route path="/contacto" element={<ContactForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route
            path="/admin/crear-producto"
            element={
              <ProtectedRoute soloAdmin>
                <CreateProduct recargarProductos={cargarProductos} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/editar-producto/:id"
            element={
              <ProtectedRoute soloAdmin>
                <EditProduct recargarProductos={cargarProductos} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilProvisorio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mis-pedidos"
            element={
              <ProtectedRoute>
                <MisPedidosProvisorio />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;