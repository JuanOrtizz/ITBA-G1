import ProductCard from "./ProductCard";

function ProductList({ productos, agregarAlCarrito }) {
    
    if (productos.length === 0) {
        return <h2 className="mensaje-estado">No se encontraron muebles que coincidan con la búsqueda</h2>;
    }

    return (
        <div id="contenedor-catalogo">
            {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} agregarAlCarrito={agregarAlCarrito} />
            ))}
        </div>
    );
}

export default ProductList;
