import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children, soloAdmin = false }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <section className="catalogo-estado">
        <p>Cargando... </p>
      </section>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (soloAdmin && usuario.rol !== "admin") {
    return (
      <section className="catalogo-estado">
        <p>Necesitás ser administrador para ver esta página.</p>
      </section>
    );
  }

  return children;
}

export default ProtectedRoute;
