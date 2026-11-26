import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getImageUrl } from "../utils/imageUrl";

function ProductCard({ producto, esDestacado = false }) {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const imgSrc = getImageUrl(producto.imagenUrl || producto.imagen);

  return (
    <div
      className="tarjeta-producto"
      onClick={() => navigate(`/productos/${producto._id}`)}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={producto.nombre} />
      ) : (
        <div className="tarjeta-sin-imagen" aria-hidden="true" />
      )}
      <h2>{producto.nombre}</h2>
      <p className="producto-precio">
        ${producto.precio.toLocaleString("es-AR")}
      </p>
      {!esDestacado && (
        <p className="producto-descripcion">{producto.descripcion}</p>
      )}
      <button
        className="btn btn-primary"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          agregarAlCarrito(producto);
        }}
      >
        Añadir al carrito
      </button>
    </div>
  );
}

export default ProductCard;