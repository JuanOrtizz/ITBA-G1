import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

// Mensajes para cada motivo por el que no se puede mostrar el producto
const MENSAJES_ERROR = {
    "id-invalido": "El enlace del producto no es válido. Volvé al catálogo y elegí un producto de la lista.",
    "no-encontrado": "No encontramos el producto que buscás. Puede que haya sido eliminado.",
    servidor: "No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.",
};

// Toma el id de la ruta /productos/:id y lo pide a GET /api/productos/:id
function ProductDetail({ onAddToCart, onBack }) {
    const { id: productoId } = useParams();
    const navigate = useNavigate();
    const [confirmando, setConfirmando] = useState(false);
    const [respuesta, setRespuesta] = useState({
        id: null,
        producto: null,
        error: null,
    });
    const [agregado, setAgregado] = useState(false);

    useEffect(() => {
        const controlador = new AbortController();

        fetch(`${API_URL}/api/productos/${productoId}`, {
            signal: controlador.signal,
        })
            .then((res) => {
                if (res.status === 400) throw new Error("id-invalido");
                if (res.status === 404) throw new Error("no-encontrado");
                if (!res.ok) throw new Error("servidor");
                return res.json();
            })
            .then((datos) => setRespuesta({ id: productoId, producto: datos, error: null }))
            .catch((err) => {
                if (err.name === "AbortError") return;
                const motivo = MENSAJES_ERROR[err.message] ? err.message : "servidor";
                setRespuesta({ id: productoId, producto: null, error: motivo });
            });

        return () => controlador.abort();
    }, [productoId]);

    const cargando = respuesta.id !== productoId;
    const productoMostrado = respuesta.id === productoId ? respuesta.producto : null;

    if (cargando) {
        return (
            <section className="detalle-producto">
                <p className="detalle-estado" role="status">
                    Cargando producto…
                </p>
            </section>
        );
    }

    if (!productoMostrado) {
        return (
            <section className="detalle-producto">
                <div className="detalle-estado">
                    <p className="detalle-error" role="alert">
                        {MENSAJES_ERROR[respuesta.error]}
                    </p>
                    <button type="button" className="btn btn-ghost" onClick={onBack}>
                        Volver al catálogo
                    </button>
                </div>
            </section>
        );
    }

    const { nombre, categoria, precio, descripcion, detalles = {}, imagenUrl } = productoMostrado;
    const especificaciones = Object.entries(detalles || {});

    const handleAgregar = () => {
        onAddToCart(productoMostrado);
        setAgregado(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/api/productos/${productoId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("No se pudo eliminar el producto");
            }
            navigate("/productos");
        } catch (err) {
            console.error("Error al eliminar:", err);
            alert(err.message);
        }
    };

    return (
        <section className="detalle-producto">
            <div id="cabecera-detalle">
                <button type="button" className="detalle-volver" onClick={onBack}>
                    &larr; Volver al catálogo
                </button>
                <div className="controles-admin">
                    {confirmando ? (
                        <div className="alerta-eliminar">
                            <span className="texto-alerta">¿Eliminar definitivamente?</span>
                            <button className="btn btn-primary" onClick={handleDelete}>
                                Si
                            </button>
                            <button className="btn btn-primary" onClick={() => setConfirmando(false)}>
                                No
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className="btn btn-primary" onClick={() => navigate(`/admin/editar-producto/${productoId}`)}>
                                Editar Producto
                            </button>
                            <button className="btn btn-primary" onClick={() => setConfirmando(true)}>
                                Eliminar Producto
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="detalle-contenido">
                <figure className="detalle-media">
                    {imagenUrl ? <img src={imagenUrl} alt={nombre} /> : <div className="detalle-sin-imagen">Imagen no disponible</div>}
                </figure>

                <div className="detalle-info">
                    {categoria && <p className="detalle-categoria">{categoria}</p>}
                    <h1>{nombre}</h1>

                    <div className="detalle-compra">
                        <p className="detalle-precio">{formatearPrecio(precio)}</p>
                        <button type="button" className="btn btn-primary" onClick={handleAgregar}>
                            Añadir al carrito
                        </button>
                    </div>
                    <p className="detalle-feedback" role="status">
                        {agregado && `${nombre} se agregó al carrito.`}
                    </p>

                    <p className="detalle-descripcion">{descripcion || "Este producto todavía no tiene descripción."}</p>

                    {especificaciones.length > 0 && (
                        <>
                            <h2>Detalles de taller</h2>
                            <dl className="detalle-specs">
                                {especificaciones.map(([clave, valor]) => (
                                    <div key={clave} className="detalle-spec">
                                        <dt>{etiquetaDetalle(clave)}</dt>
                                        <dd>{valor}</dd>
                                    </div>
                                ))}
                            </dl>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductDetail;
