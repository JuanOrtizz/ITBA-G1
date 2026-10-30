import { useState } from "react";
import ProductList from "../components/ProductList";

function ProductsPage({ productos, cargando, error, agregarAlCarrito }) {
    
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

    if (cargando) {
        return <h2 className="mensaje-estado">Cargando catálogo...</h2>;
    }
    
    if (error) {
        return <h2 className="mensaje-estado">Error al cargar el catálogo:<br />
                "{error}"</h2>;
    }
    
    return (
        <section>
            <h2 id="titulo-catalogo">Nuestro Catalogo</h2>

            <input type="text" id="buscador" placeholder="Busque su mueble aquí" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

            <ProductList productos={productosFiltrados} agregarAlCarrito={agregarAlCarrito} />
        </section>
    );
}

export default ProductsPage;
