function ProductCard({ setVista, producto, setProductoSeleccionado, agregarAlCarrito }) {
    return (
        <article className="tarjeta-producto">
            <img src={producto.imagenURL} alt={producto.nombre} />
            <h2>
                {/* El link cubre toda la tarjeta (ver .tarjeta-producto__link en styles.css) */}
                <a
                    href="#"
                    className="tarjeta-producto__link"
                    onClick={(e) => {
                        e.preventDefault();
                        setProductoSeleccionado(producto.id);
                        setVista("detalle");
                    }}>
                    {producto.nombre}
                </a>
            </h2>
            <p className="producto-precio">${producto.precio.toLocaleString("es-AR")}</p>
            <p className="producto-descripcion">{producto.descripcion}</p>
            <button className="btn btn-primary" onClick={() => agregarAlCarrito(producto)}>
                Añadir al carrito
            </button>
        </article>
    );
}

export default ProductCard;
