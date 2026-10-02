import { useState } from "react";
import ProductCard from "./ProductCard";

function ProductList({ setVista, productos, setProductoSeleccionado, agregarAlCarrito }) {
    const [busqueda, setBusqueda] = useState("");

    const quitarAcentos = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    const textoBuscado = quitarAcentos(busqueda.trim());
    const productosFiltrados = productos.filter((mueble) => {
        const nombreMueble = quitarAcentos(mueble.nombre || "");
        const categoriaMueble = quitarAcentos(mueble.categoria || "");
        return nombreMueble.startsWith(textoBuscado) || categoriaMueble.startsWith(textoBuscado);
    });

    return (
        <section>
            <h2 id="titulo-catalogo">Nuestro Catalogo</h2>

            <input type="text" id="buscador" placeholder="Busque su mueble aquí" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

            <div id="contenedor-catalogo">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => <ProductCard key={producto.id} setVista={setVista} producto={producto} setProductoSeleccionado={setProductoSeleccionado} agregarAlCarrito={agregarAlCarrito} />)
                ) : (
                    <h3>No se encontraron muebles que coincidan con la búsqueda</h3>
                )}
            </div>
        </section>
    );
}

export default ProductList;
