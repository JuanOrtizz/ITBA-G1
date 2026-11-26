import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPrivado, formatearFecha } from "../utils/apiPrivada";

// /perfil: los datos salen de GET /api/users/me con el token de la sesión,
// nunca de un id escrito en la URL. La ruta la protege ProtectedRoute en App.jsx
function Perfil() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [respuesta, setRespuesta] = useState(null); // { usuario } o { error }
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        if (!token) return;
        const controlador = new AbortController();

        getPrivado("/api/users/me", token, controlador.signal)
            .then((datos) => setRespuesta({ usuario: datos.user }))
            .catch((err) => {
                if (err.name === "AbortError") return;
                // Token vencido o inválido: se cierra la sesión y se vuelve al login
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

    function cerrarSesion() {
        logout();
        navigate("/", { replace: true });
    }

    if (!respuesta) {
        return (
            <section className="catalogo-estado" aria-live="polite">
                <p>Cargando tu perfil...</p>
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

    const { usuario } = respuesta;

    return (
        <section className="cuenta">
            <header className="cuenta-encabezado">
                <h1>Mi perfil</h1>
                <p>Hola, {usuario.nombre}.</p>
            </header>

            <div className="cuenta-tarjeta">
                <dl className="perfil-datos">
                    <dt>Nombre</dt>
                    <dd>{usuario.nombre}</dd>

                    <dt>Email</dt>
                    <dd>{usuario.email}</dd>

                    <dt>Tipo de cuenta</dt>
                    <dd>{usuario.rol === "admin" ? "Administrador" : "Cliente"}</dd>

                    {usuario.createdAt && (
                        <>
                            <dt>Cliente desde</dt>
                            <dd>{formatearFecha(usuario.createdAt)}</dd>
                        </>
                    )}
                </dl>

                <div className="cuenta-acciones">
                    <Link to="/mis-pedidos" className="btn btn-primary">
                        Ver mis pedidos
                    </Link>
                    <button type="button" className="btn btn-ghost" onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Perfil;
