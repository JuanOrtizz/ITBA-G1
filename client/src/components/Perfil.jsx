import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPrivado, formatearFecha } from "../utils/apiPrivada";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// /perfil: los datos salen de GET /api/users/me con el token de la sesión,
// nunca de un id escrito en la URL. La ruta la protege ProtectedRoute en App.jsx
function Perfil() {
    const { token, logout, actualizarSesion } = useAuth();
    const navigate = useNavigate();
    const [respuesta, setRespuesta] = useState(null); // { usuario } o { error }
    const [intento, setIntento] = useState(0);

    // Estados de edición
    const [editando, setEditando] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [errorEdicion, setErrorEdicion] = useState(null);
    const [mensajeExito, setMensajeExito] = useState(null);

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

    function abrirEdicion() {
        setNombre(respuesta.usuario.nombre || "");
        setEmail(respuesta.usuario.email || "");
        setErrorEdicion(null);
        setMensajeExito(null);
        setEditando(true);
    }

    function cancelarEdicion() {
        setErrorEdicion(null);
        setEditando(false);
    }

    async function handleGuardarPerfil(e) {
        e.preventDefault();
        setErrorEdicion(null);
        setMensajeExito(null);

        const nombreLimpio = nombre.trim();
        const emailLimpio = email.trim().toLowerCase();

        if (!nombreLimpio) {
            setErrorEdicion("El nombre de usuario no puede estar vacío.");
            return;
        }
        if (nombreLimpio.length < 3 || nombreLimpio.length > 20) {
            setErrorEdicion("El nombre de usuario debe tener entre 3 y 20 caracteres.");
            return;
        }
        if (/\s/.test(nombreLimpio)) {
            setErrorEdicion("El nombre de usuario no puede contener espacios.");
            return;
        }
        if (!EMAIL_REGEX.test(emailLimpio)) {
            setErrorEdicion("Ingresá un email válido.");
            return;
        }

        if (
            nombreLimpio === respuesta.usuario.nombre &&
            emailLimpio === respuesta.usuario.email
        ) {
            setEditando(false);
            return;
        }

        setGuardando(true);

        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: nombreLimpio,
                    email: emailLimpio,
                }),
            });

            if (res.status === 401) {
                logout();
                navigate("/login", { replace: true });
                return;
            }

            const datos = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    datos.error || datos.message || "No se pudo actualizar el perfil."
                );
            }

            actualizarSesion(datos.user, datos.token);
            setRespuesta({ usuario: datos.user });
            setEditando(false);
            setMensajeExito(datos.mensaje || "Perfil actualizado con éxito.");
        } catch (err) {
            const mensaje =
                err instanceof TypeError
                    ? "No pudimos conectarnos con el servidor. Intentá nuevamente."
                    : err.message;
            setErrorEdicion(mensaje);
        } finally {
            setGuardando(false);
        }
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
                {mensajeExito && (
                    <p
                        role="status"
                        style={{
                            color: "var(--color-secondary)",
                            fontWeight: 600,
                            marginBottom: "1rem",
                        }}
                    >
                        {mensajeExito}
                    </p>
                )}

                {editando ? (
                    <form className="formulario-base" onSubmit={handleGuardarPerfil} noValidate>
                        <label htmlFor="perfil-nombre">Nombre de usuario</label>
                        <input
                            id="perfil-nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            minLength={3}
                            maxLength={20}
                            required
                            disabled={guardando}
                        />

                        <label htmlFor="perfil-email">Email</label>
                        <input
                            id="perfil-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={guardando}
                        />

                        {errorEdicion && (
                            <p
                                role="alert"
                                style={{ color: "#d93025", margin: "0.5rem 0" }}
                            >
                                {errorEdicion}
                            </p>
                        )}

                        <div className="cuenta-acciones">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={guardando}
                            >
                                {guardando ? "Guardando..." : "Guardar cambios"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={cancelarEdicion}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
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
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={abrirEdicion}
                            >
                                Editar perfil
                            </button>
                            <Link to="/mis-pedidos" className="btn btn-ghost">
                                Ver mis pedidos
                            </Link>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={cerrarSesion}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default Perfil;