import { useState } from "react";

const FORMSPREE_URL = "https://formspree.io/f/xdeolaka";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FORM_INICIAL = { nombre: "", email: "", mensaje: "" };

function ContactForm() {
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState("");
  const [errorEnvio, setErrorEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const nuevosErrores = {};

    if (formData.nombre.trim() === "") {
      nuevosErrores.nombre = "El campo Nombre no puede estar vacío.";
    }

    const email = formData.email.trim();
    if (email === "") {
      nuevosErrores.email = "El campo Email no puede estar vacío.";
    } else if (!EMAIL_REGEX.test(email)) {
      nuevosErrores.email =
        "Ingresa un correo electrónico real (ej: juan@gmail.com).";
    }

    const mensaje = formData.mensaje.trim();
    if (mensaje === "") {
      nuevosErrores.mensaje = "El mensaje no puede estar vacío.";
    } else if (mensaje.length < 15) {
      nuevosErrores.mensaje = `El mensaje es muy corto. Debe tener al menos 15 caracteres (actualmente tiene ${mensaje.length}).`;
    } else if (mensaje.length > 400) {
      nuevosErrores.mensaje = `El mensaje no puede superar los 400 caracteres (actualmente tiene ${mensaje.length}).`;
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setExito("");
    setErrorEnvio("");

    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);

    try {
      const respuesta = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (respuesta.ok) {
        setExito("¡Tu consulta fue enviada correctamente y ya la recibimos!");
        setFormData(FORM_INICIAL);
      } else {
        setErrorEnvio(
          "Hubo un problema de conexión con el servidor de correos."
        );
      }
    } catch (error) {
      console.error(error);
      setErrorEnvio("Error al intentar enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="seccion-contacto">
      <h2>Centro de Ayuda y Contacto</h2>
      <p>Completá los datos y te responderemos a la brevedad.</p>

      {/* noValidate: evita que el navegador bloquee el submit y
          permite que se muestren nuestros mensajes de error */}
      <form id="formulario-contacto" onSubmit={handleSubmit} noValidate>
        <label htmlFor="nombre">Nombre Completo:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        {errores.nombre && (
          <span className="error-span">
            {errores.nombre}
          </span>
        )}

        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errores.email && (
          <span className="error-span">
            {errores.email}
          </span>
        )}

        <label htmlFor="mensaje">Tu Mensaje / Feedback:</label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="4"
          value={formData.mensaje}
          onChange={handleChange}
          required
        />
        {errores.mensaje && (
          <span className="error-span">
            {errores.mensaje}
          </span>
        )}

        <button type="submit" id="btn-enviar" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>

      <div id="mensaje-feedback">
        {exito && <p className="mensaje-exito">{exito}</p>}
        {errorEnvio && (
          <p className="error-span">
            {errorEnvio}
          </p>
        )}
      </div>
    </section>
  );
}

export default ContactForm;