function FeaturedProducts({
  productos,
  cargando,
  error,
  setVista,
  setProductoSeleccionado,
}) {
  const productosDestacados = productos.filter(
    (producto) => producto.destacado,
  );

  return (
    <section className="featured">
      {cargando ? (
        <p>Cargando productos destacados...</p>
      ) : error ? (
        <p>No se pudieron cargar los productos destacados. {error}</p>
      ) : (
        <>
          <div className="section-head">
            <h2>Productos destacados</h2>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setVista("catalogo")}
          >
            Ver todos nuestros productos
          </button>

          <div className="products-grid">
            {productosDestacados.map((producto) => (
              <article className="product-card" key={producto._id}>
                <div className="product-card__media">
                  <img src={producto.imagenUrl} alt={producto.nombre} />
                </div>

                <div className="product-card__body">
                  <h3>{producto.nombre}</h3>

                  <p className="product-card__price">
                    ${producto.precio.toLocaleString("es-AR")}
                  </p>

                  <button
                    className="btn btn-ghost"
                    onClick={() => setVista("detalle", producto._id)}
                  >
                    Ver detalle
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default FeaturedProducts;
