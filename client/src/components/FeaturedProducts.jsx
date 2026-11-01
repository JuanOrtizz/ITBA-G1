import ProductCard from "./ProductCard";

function FeaturedProducts({ productos, cargando, error, setVista, agregarAlCarrito }) {
    const productosDestacados = productos.filter((producto) => producto.destacado);

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

                    <button className="btn btn-primary" onClick={() => setVista("catalogo")}>
                        Ver todos nuestros productos
                    </button>

                    <div className="products-grid">
                        {productosDestacados.map((producto) => (
                            <ProductCard key={producto._id} producto={producto} agregarAlCarrito={agregarAlCarrito} esDestacado={true} />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default FeaturedProducts;
