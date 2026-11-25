import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

function RegisterPage() {
    const { registrar } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
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
        <section id="contenedor-registro">
            <h2>Crear cuenta</h2>
            <p>Registrate para gestionar tu perfil y comprar en Mueblería Jota</p>

            <form onSubmit={handleSubmit} className="formulario">
                <label>
                    Nombre de usuario
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>

                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>

                <label>
                    Contraseña
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>

                {error && <p className="mensaje-estado">{error}</p>}

                <button type="submit" disabled={enviando}>
                    {enviando ? "Registrando..." : "Registrarme"}
                </button>
            </form>

            <p>
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
        </section>
    );
}

export default RegisterPage;
