import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext} from "../contexts/AuthContext.jsx";

function LoginPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setEnviando(true);
        try {
            await login(email, password);
            const destino = location.state?.desde || "/";
            navigate(destino, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section id="contenedor-login">
            <h2>Iniciar sesión</h2>
            <p>Ingresá con tu cuenta de Mueblería Jota</p>

            <form onSubmit={handleSubmit} className="formulario">
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
                    {enviando ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            <p>
                ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
            </p>
        </section>
    );
}

export default LoginPage;
