import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

function RegisterPage() {
    const { registrar } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        setEnviando(true);
        try {
            await registrar({ username, email, password });
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section id="contenedor-usuario">
            <h2>Crear cuenta</h2>
            <p>Registrate para gestionar tu perfil y comprar en Mueblería Jota</p>

            <form className="formulario-base" onSubmit={handleSubmit}>
                <label htmlFor="registro-username">Nombre de usuario</label>
                <input id="registro-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

                <label htmlFor="registro-email">Email</label>
                <input id="registro-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label htmlFor="registro-password">Contraseña</label>
                <input id="registro-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <label htmlFor="registro-confirm-password">Repetir contraseña</label>
                <input id="registro-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                <button type="submit" disabled={enviando} className="boton-primario">
                    {enviando ? "Registrando..." : "Registrarme"}
                </button>

                <p className="texto-alternativo-usuario">
                    ¿Ya tenés cuenta?{" "}
                    <Link to="/login">
                        <span className="link-usuario">Iniciá sesión</span>
                    </Link>
                </p>
            </form>

            {error && <h3 className="mensaje-estado">{error}</h3>}
        </section>
    );
}

export default RegisterPage;
