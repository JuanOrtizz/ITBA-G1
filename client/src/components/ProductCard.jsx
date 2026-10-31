import { useNavigate } from "react-router-dom";

function ProductCard({ producto, agregarAlCarrito }) {
    const navigate = useNavigate();
    
    return (
        <div className="tarjeta-producto" onClick={() => navigate(`/productos/${producto.id}`)}>
            <img src={producto.imagenURL} alt={producto.nombre} />
            <h2>{producto.nombre}</h2>
            <p className="producto-precio">${producto.precio.toLocaleString("es-AR")}</p>
            <p className="producto-descripcion">{producto.descripcion}</p>
            <button
                className="boton-primario"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    agregarAlCarrito(producto);
                }}>
                Añadir al carrito
            </button>
        </div>
    );
}

export default ProductCard;
