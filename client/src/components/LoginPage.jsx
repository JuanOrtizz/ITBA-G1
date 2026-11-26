import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORM_INICIAL = { email: "", password: "" };

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [errorEnvio, setErrorEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
    if (errorEnvio) setErrorEnvio("");
  };

  const validar = () => {
    const nuevosErrores = {};

    const email = formData.email.trim();
    if (email === "") {
      nuevosErrores.email = "El campo Email no puede estar vacío.";
    } else if (!EMAIL_REGEX.test(email)) {
      nuevosErrores.email =
        "Ingresa un correo electrónico real (ej: juan@gmail.com).";
    }

    const password = formData.password;
    if (password === "") {
      nuevosErrores.password = "El campo Contraseña no puede estar vacío.";
    } else if (password.length < 8) {
      nuevosErrores.password = `La contraseña debe tener al menos 8 caracteres (actualmente tiene ${password.length}).`;
    } else if (/\s/.test(password)) {
      nuevosErrores.password = "La contraseña no puede contener espacios.";
    } else if (!/[A-Z]/.test(password)) {
      nuevosErrores.password =
        "La contraseña debe incluir al menos una letra mayúscula.";
    } else if (!/[^A-Za-z0-9\s]/.test(password)) {
      nuevosErrores.password =
        "La contraseña debe incluir al menos un símbolo (ej: . _ - ! @ # $).";
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorEnvio("");

    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      const destino =
        location.state?.from?.pathname || location.state?.desde || "/";
      navigate(destino, { replace: true });
    } catch (err) {
      setErrorEnvio(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="contenedor-usuario">
      <h2>Iniciar sesión</h2>
      <p>Ingresá con tu cuenta de Mueblería Jota</p>

      <form className="formulario-base" onSubmit={handleSubmit} noValidate>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={enviando}
          required
        />
        {errores.email && (
          <span className="error-span" role="alert">
            {errores.email}
          </span>
        )}

        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mín. 8 caracteres, 1 mayúscula y 1 símbolo (. _)"
          disabled={enviando}
          required
        />
        {errores.password && (
          <span className="error-span" role="alert">
            {errores.password}
          </span>
        )}

        {errorEnvio && (
          <p className="error-span" role="alert">
            {errorEnvio}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="btn btn-primary boton-primario"
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