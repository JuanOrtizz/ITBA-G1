import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProductSelect() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  // Esta función recibe el ID del mueble directamente desde el botón clickeado
  const manejarEdicion = (id) => {
    navigate(`/admin/editar-producto/${id}`);
  };

  return (
    <section className="seccion-admin-select" style={{ maxWidth: "800px", margin: "4rem auto", textAlign: "center" }}>
      <h2>¿QUÉ MUEBLE QUERÉS EDITAR?</h2>
      <p style={{ marginBottom: "2rem", color: "#666" }}>Hacé clic en el producto que deseás modificar.</p>
      
      <div className="grilla-botones-productos">
        {productos.map(prod => (
          <button 
            key={prod._id} 
            onClick={() => manejarEdicion(prod._id)}
            className="btn-estilo-carrito"
          >
            {prod.nombre}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ProductSelect;