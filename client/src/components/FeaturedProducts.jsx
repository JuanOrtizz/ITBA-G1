function FeaturedProducts({ productos, setVista, setProductoSeleccionado }) {
  const productosDestacados = productos.filter(
    (producto) => producto.destacado,
  );

  return (
    <section className="featured">
      <div className="section-head">
        <h2>Productos destacados</h2>
      </div>

      <button className="btn btn-primary" onClick={() => setVista("catalogo")}>
        Ver todos nuestros productos
      </button>

      <div className="products-grid">
        {productosDestacados.map((producto) => (
          <article className="product-card" key={producto.id}>
            <div className="product-card__media">
              <img src={producto.imagenURL} alt={producto.nombre} />
            </div>

            <div className="product-card__body">
              <h3>{producto.nombre}</h3>

              <p className="product-card__price">
                ${producto.precio.toLocaleString("es-AR")}
              </p>

              <button
                className="btn btn-ghost"
                onClick={() => {
                  setProductoSeleccionado(producto.id);
                  setVista("detalle");
                }}
              >
                Ver detalle
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
