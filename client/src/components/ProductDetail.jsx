import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Etiquetas legibles para las claves de "detalles" que manda el backend
const ETIQUETAS_DETALLES = {
    medidas: "Medidas",
    materiales: "Materiales",
    acabado: "Acabado",
    peso: "Peso",
    capacidad: "Capacidad",
    modulares: "Módulos",
    estructura: "Estructura",
    tapizado: "Tapizado",
    regulacion: "Regulación",
    certificacion: "Certificación",
    caracteristicas: "Características",
    extension: "Extensión",
    garantia: "Garantía",
    rotacion: "Rotación",
};

function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(precio);
}

function etiquetaDetalle(clave) {
    return ETIQUETAS_DETALLES[clave] || clave.charAt(0).toUpperCase() + clave.slice(1);
}

// Recibe el producto completo, o solo su id y lo pide a GET /api/productos/:id
function ProductDetail({ producto, productoId, onAddToCart, onBack }) {
    const [respuesta, setRespuesta] = useState({ id: null, producto: null, error: null });
    const [agregado, setAgregado] = useState(false);

    const debeBuscar = !producto && productoId != null;

    useEffect(() => {
        if (!debeBuscar) return;

        const controlador = new AbortController();

        fetch(`${API_URL}/api/productos/${productoId}`, { signal: controlador.signal })
            .then((res) => {
                if (res.status === 404) throw new Error("no-encontrado");
                if (!res.ok) throw new Error(`Error ${res.status} al pedir el producto`);
                return res.json();
            })
            .then((datos) => setRespuesta({ id: productoId, producto: datos, error: null }))
            .catch((err) => {
                if (err.name === "AbortError") return;
                setRespuesta({ id: productoId, producto: null, error: err.message });
            });

        return () => controlador.abort();
    }, [debeBuscar, productoId]);

    const cargando = debeBuscar && respuesta.id !== productoId;
    const productoMostrado = producto || (respuesta.id === productoId ? respuesta.producto : null);

    if (cargando) {
        return (
            <section className="detalle-producto">
                <p className="detalle-estado" role="status">Cargando producto…</p>
            </section>
        );
    }

    if (!productoMostrado) {
        const mensaje =
            !debeBuscar || respuesta.error === "no-encontrado"
                ? "No encontramos el producto que buscás. Volvé al catálogo e intentá de nuevo."
                : "No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.";

        return (
            <section className="detalle-producto">
                <div className="detalle-estado">
                    <p className="detalle-error" role="alert">{mensaje}</p>
                    <button type="button" className="boton-secundario" onClick={onBack}>
                        Volver al catálogo
                    </button>
                </div>
            </section>
        );
    }

    const { nombre, categoria, precio, descripcion, detalles = {}, imagenURL } = productoMostrado;

    const handleAgregar = () => {
        onAddToCart(productoMostrado);
        setAgregado(true);
    };

    return (
        <section className="detalle-producto">
            <button type="button" className="detalle-volver" onClick={onBack}>
                &larr; Volver al catálogo
            </button>

            <div className="detalle-contenido">
                <figure className="detalle-media">
                    <img src={imagenURL} alt={nombre} />
                </figure>

                <div className="detalle-info">
                    <p className="detalle-categoria">{categoria}</p>
                    <h1>{nombre}</h1>

                    <div className="detalle-compra">
                        <p className="detalle-precio">{formatearPrecio(precio)}</p>
                        <button type="button" className="boton-primario" onClick={handleAgregar}>
                            Añadir al carrito
                        </button>
                    </div>
                    <p className="detalle-feedback" role="status">
                        {agregado && `${nombre} se agregó al carrito.`}
                    </p>

                    <p className="detalle-descripcion">{descripcion}</p>

                    <h2>Detalles de taller</h2>
                    <dl className="detalle-specs">
                        {Object.entries(detalles).map(([clave, valor]) => (
                            <div key={clave} className="detalle-spec">
                                <dt>{etiquetaDetalle(clave)}</dt>
                                <dd>{valor}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}

export default ProductDetail;
