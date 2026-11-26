import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

function ProductCard({ producto, esDestacado = false }) {
  const navigate = useNavigate();
  const { carrito, agregarAlCarrito } = useCart();

  const productoId = producto._id || producto.id;
  const stockDisponible = Number(producto.stock) || 0;
  const itemEnCarrito = carrito.find((item) => (item._id || item.id) === productoId);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

  const sinStock = stockDisponible <= 0;
  const llegoAlLimite = !sinStock && cantidadEnCarrito >= stockDisponible;
  const botonDeshabilitado = sinStock || llegoAlLimite;

  return (
    <div
      className="tarjeta-producto"
      onClick={() => navigate(`/productos/${producto._id}`)}
    >
      <img src={producto.imagenUrl} alt={producto.nombre} />
      <h2>{producto.nombre}</h2>
      <p className="producto-precio">
        ${producto.precio.toLocaleString("es-AR")}
      </p>
      {!esDestacado && (
        <p className="producto-descripcion">{producto.descripcion}</p>
      )}
    <button
      type="button"
      className="btn btn-primary"
      onClick={(e) => {
      e.stopPropagation();
      agregarAlCarrito(producto);
    }}
      disabled={botonDeshabilitado}
    >
      {sinStock
      ? "Sin stock"
      : llegoAlLimite
      ? "Sin Stock"
      : "Añadir al carrito"}
      </button>
    </div>
  );
}

export default ProductCard;