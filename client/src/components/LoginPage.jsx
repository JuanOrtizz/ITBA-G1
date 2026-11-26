import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

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
      await login({ email, password });
      const destino =
        location.state?.from?.pathname || location.state?.desde || "/";
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="contenedor-usuario">
      <h2>Iniciar sesión</h2>
      <p>Ingresá con tu cuenta de Mueblería Jota</p>

      <form className="formulario-base" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="mensaje-estado">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className=" btn btn-primary boton-primario"
        >
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="texto-alternativo-usuario">
          ¿No tenés cuenta?{" "}
          <Link to="/registro">
            <span className="link-usuario">Registrate acá</span>
          </Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
