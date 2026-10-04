function ProductCard({ setVista, producto, setProductoSeleccionado, agregarAlCarrito }) {
    return (
        <div
            className="tarjeta-producto"
            onClick={() => {
                setProductoSeleccionado(producto.id);
                setVista("detalle");
            }}>
            <img src={producto.imagenURL} alt={producto.nombre} />
            <h2>{producto.nombre}</h2>
            <p className="producto-precio">${producto.precio.toLocaleString("es-AR")}</p>
            <p className="producto-descripcion">{producto.descripcion}</p>
            <button
                className="btn btn-primary"
                onClick={(e) => {
                    e.stopPropagation();
                    agregarAlCarrito(producto);
                }}>
                Añadir al carrito
            </button>
        </div>
    );
}

export default ProductCard;
