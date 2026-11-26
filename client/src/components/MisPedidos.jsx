import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPrivado, formatearPrecio, formatearFecha } from "../utils/apiPrivada";

const ETIQUETAS_ESTADO = {
    pendiente: "Pendiente",
    confirmado: "Confirmado",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
};

// /mis-pedidos: GET /api/orders/my. El backend filtra por el usuario del token,
// así que acá no se manda ningún id: cada usuario ve solo sus pedidos
function MisPedidos() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [respuesta, setRespuesta] = useState(null); // { pedidos } o { error }
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        if (!token) return;
        const controlador = new AbortController();

        getPrivado("/api/orders/my", token, controlador.signal)
            .then((datos) => setRespuesta({ pedidos: datos.pedidos || [] }))
            .catch((err) => {
                if (err.name === "AbortError") return;
                if (err.status === 401) {
                    logout();
                    navigate("/login", { replace: true });
                    return;
                }
                setRespuesta({ error: err.message });
            });

        return () => controlador.abort();
    }, [token, intento, logout, navigate]);

    function reintentar() {
        setRespuesta(null);
        setIntento((n) => n + 1);
    }

    if (!respuesta) {
        return (
            <section className="catalogo-estado" aria-live="polite">
                <p>Cargando tus pedidos...</p>
            </section>
        );
    }

    if (respuesta.error) {
        return (
            <section className="catalogo-estado cuenta-estado" role="alert">
                <p>{respuesta.error}</p>
                <button type="button" className="btn btn-ghost" onClick={reintentar}>
                    Reintentar
                </button>
            </section>
        );
    }

    const { pedidos } = respuesta;

    return (
        <section className="cuenta">
            <header className="cuenta-encabezado">
                <h1>Mis pedidos</h1>
                {pedidos.length > 0 && (
                    <p>
                        {pedidos.length === 1 ? "Tenés 1 pedido." : `Tenés ${pedidos.length} pedidos.`}
                    </p>
                )}
            </header>

            {pedidos.length === 0 ? (
                <div className="cuenta-tarjeta cuenta-vacio">
                    <p>Todavía no hiciste ningún pedido.</p>
                    <Link to="/productos" className="btn btn-primary">
                        Ver el catálogo
                    </Link>
                </div>
            ) : (
                <ul className="pedidos-lista">
                    {pedidos.map((pedido) => (
                        <li key={pedido._id} className="cuenta-tarjeta pedido">
                            <div className="pedido-cabecera">
                                <div>
                                    <h2>Pedido #{pedido._id.slice(-6).toUpperCase()}</h2>
                                    <p className="pedido-fecha">{formatearFecha(pedido.createdAt, true)}</p>
                                </div>
                                <span className={`pedido-estado pedido-estado--${pedido.estado}`}>
                                    {ETIQUETAS_ESTADO[pedido.estado] || pedido.estado}
                                </span>
                            </div>

                            <ul className="pedido-items">
                                {pedido.items.map((item, i) => (
                                    <li key={`${pedido._id}-${i}`} className="pedido-item">
                                        {item.imagenUrl ? (
                                            <img src={item.imagenUrl} alt="" />
                                        ) : (
                                            <span className="pedido-item-sin-imagen" aria-hidden="true" />
                                        )}
                                        <span className="pedido-item-nombre">
                                            {item.nombre}
                                            <span className="pedido-item-cantidad">
                                                {item.cantidad} × {formatearPrecio(item.precio)}
                                            </span>
                                        </span>
                                        <span className="pedido-item-subtotal">
                                            {formatearPrecio(item.precio * item.cantidad)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pedido-total">
                                <span>Total</span>
                                <strong>{formatearPrecio(pedido.total)}</strong>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default MisPedidos;
