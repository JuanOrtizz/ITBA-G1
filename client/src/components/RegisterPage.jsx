import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORM_INICIAL = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

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

    const username = formData.username.trim();
    if (username === "") {
      nuevosErrores.username = "El campo Nombre de usuario no puede estar vacío.";
    } else if (username.length < 3 || username.length > 20) {
      nuevosErrores.username =
        "El nombre de usuario debe tener entre 3 y 20 caracteres.";
    } else if (/\s/.test(username)) {
      nuevosErrores.username = "El nombre de usuario no puede tener espacios.";
    }

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
      nuevosErrores.password =
        `La contraseña debe tener al menos 8 caracteres (actualmente tiene ${password.length}).`;
    } else if (/\s/.test(password)) {
      nuevosErrores.password = "La contraseña no puede contener espacios.";
    } else if (!/[A-Z]/.test(password)) {
      nuevosErrores.password =
        "La contraseña debe incluir al menos una letra mayúscula.";
    } else if (!/[^A-Za-z0-9\s]/.test(password)) {
      nuevosErrores.password =
        "La contraseña debe incluir al menos un símbolo (ej: . _ - ! @ # $).";
    }

    if (formData.confirmPassword === "") {
      nuevosErrores.confirmPassword = "Debés repetir la contraseña.";
    } else if (password !== formData.confirmPassword) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";
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
      await register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setErrorEnvio(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="contenedor-usuario">
      <h2>Crear cuenta</h2>
      <p>Registrate para gestionar tu perfil y comprar en Mueblería Jota</p>

      <form className="formulario-base" onSubmit={handleSubmit} noValidate>
        <label htmlFor="registro-username">Nombre de usuario</label>
        <input
          id="registro-username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          disabled={enviando}
          required
        />
        {errores.username && (
          <span className="error-span" role="alert">
            {errores.username}
          </span>
        )}

        <label htmlFor="registro-email">Email</label>
        <input
          id="registro-email"
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

        <label htmlFor="registro-password">Contraseña</label>
        <input
          id="registro-password"
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

        <label htmlFor="registro-confirm-password">Repetir contraseña</label>
        <input
          id="registro-confirm-password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={enviando}
          required
        />
        {errores.confirmPassword && (
          <span className="error-span" role="alert">
            {errores.confirmPassword}
          </span>
        )}

        {errorEnvio && (
          <p className="error-span" role="alert">
            {errorEnvio}
          </p>
        )}

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
    </section>
  );
}

export default RegisterPage;