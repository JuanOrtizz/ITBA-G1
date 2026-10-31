//p1:Imports, URL del Backend y Estado Inicial
import { useState, useEffect } from "react";   
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PRODUCTO_INICIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagenUrl: "",
};  

//p2: Estados del Componente y Precarga para Edición (GET por ID)
function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = Boolean(id); //true si hay ID en la URL , false si estamos creando un nuevo producto

    const [formData, setFormData] = useState(PRODUCTO_INICIAL);
    const [errores, setErrores] = useState({});
    const [exito, setExito] = useState("");
    const [errorEnvio, setErrorEnvio] = useState("");
    const [enviando, setEnviando] = useState(false);

    useEffect (() => {
        if (!esEdicion) return;

        const cargarProducto = async () => {
            try {
                setEnviando(true);
                const respuesta = await fetch(`${API_URL}/api/productos/${id}`);
                const data = await respuesta.json();

            if(!respuesta.ok) {
                throw new Error(data.message || data.error || "No se pudo encontrar el producto.");
            }

                setFormData({
                    nombre: data.nombre || "",
                    descripcion: data.descripcion || "",
                    precio: data.precio != undefined ? String(data.precio) : "",
                    stock: data.stock != undefined ? String(data.stock) : "",
                    imagenUrl: data.imagenUrl || "",
                });
            } catch (error) {
                console.error(error);
                setErrorEnvio(error.message || "Error al cargar los datos del producto.");
            } finally {
                setEnviando(false);
            }
        };

    cargarProducto();
}, [id, esEdicion]);


//P3: Lectura de Inputs (handleChange) y Validaciones (validar)

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errores[name]) {
        setErrores ((prev) => ({ ...prev, [name]: "" }));
    }
};

const validar = () => {
    const nuevosErrores = {};

    if(formData.nombre.trim() === "") {
        nuevosErrores.nombre = "El nombre del producto no puede estar vacío.";
    }

    const precioTexto = String(formData.precio).trim();
    if (precioTexto === "") {
        nuevosErrores.precio = "El precio del producto es obligatorio.";
    }
    else if (isNaN(Number(precioTexto)) || Number(precioTexto) < 0) {
        nuevosErrores.precio = "El precio debe ser un numero mayor a 0.";
    }

    const stockTexto = String(formData.stock).trim();
    if (stockTexto !== "" && (isNaN(Number(stockTexto)) || Number(stockTexto) < 0)) {
        nuevosErrores.stock = "El stock debe ser un numero mayor a 0.";
    }

    return nuevosErrores;
};

//P4: Envio al Backend (POST/PUT) con handleSubmit
const handleSubmit = async (e) => {
    e.preventDefault();

    setExito("");
    setErrorEnvio("");

    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;
    
    setEnviando(true);

    const payLoadLimpio = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        ...String(formData.stock).trim() !== "" && { stock: Number(formData.stock) },
        imagenUrl: formData.imagenUrl.trim(),
    };

    try {
        const url = esEdicion
            ? `${API_URL}/api/productos/${id}`
            : `${API_URL}/api/productos`;
        const metodo = esEdicion ? "PUT" : "POST";

        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payLoadLimpio),
        });
        
        const data = await respuesta.json();

        if (respuesta.ok) {
            setExito(
                esEdicion
                    ? "Producto actualizado correctamente en la base de datos"
                    : "El producto fue creado correctamente en MongoDB Atlas"
            );
            if (!esEdicion) {
                setFormData(PRODUCTO_INICIAL);
            }

            setTimeout(() => {
                navigate("/productos");
            }, 1200);
        } else {
                setErrorEnvio(data.error || "Hubo un problema al guardar el producto en el servidor.");
            }
        } catch (error) {
            console.error(error);
            setErrorEnvio("Error de conexion con el servidor backend.");
        } finally {
            setEnviando(false);
        }
    };

//P5: Exportamos las mismas clases de CSS de ContactForm
return (
    <section className="seccion-contacto">
      <h2>{esEdicion ? "Editar un Producto" : "Crear un Nuevo Producto"}</h2>
      <p>
        {esEdicion
          ? "Modificá los datos del mueble y guardá los cambios."
          : "Completá los datos del mueble para sumarlo al catálogo."}
      </p>

      <form id="formulario-contacto" onSubmit={handleSubmit} noValidate>
        <label htmlFor="nombre">Nombre del Producto*: </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={enviando}
          required
        />
        {errores.nombre && (
          <span className="error-span" role="alert">
            {errores.nombre}
          </span>
        )}

        <label htmlFor="precio">Precio* ($): </label>
        <input
          type="number"
          id="precio"
          name="precio"
          min="0"
          step="any"
          value={formData.precio}
          onChange={handleChange}
          disabled={enviando}
          required
        />
        {errores.precio && (
          <span className="error-span" role="alert">
            {errores.precio}
          </span>
        )}

        <label htmlFor="stock">Stock Disponible (Opcional):</label>
        <input
          type="number"
          id="stock"
          name="stock"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          disabled={enviando}
        />
        {errores.stock && (
          <span className="error-span" role="alert">
            {errores.stock}
          </span>
        )}

        <label htmlFor="imagenUrl">URL de la Imagen (Opcional):</label>
        <input
          type="url"
          id="imagenUrl"
          name="imagenUrl"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={formData.imagenUrl}
          onChange={handleChange}
          disabled={enviando}
        />

        <label htmlFor="descripcion">Descripción (Opcional):</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="4"
          value={formData.descripcion}
          onChange={handleChange}
          disabled={enviando}
        />

        <button type="submit" id="btn-enviar" disabled={enviando}>
          {enviando
            ? "Guardando..."
            : esEdicion
            ? "Guardar Cambios"
            : "Crear Producto"}
        </button>
      </form>

      <div id="mensaje-feedback" aria-live="polite">
        {exito && <p className="mensaje-exito">{exito}</p>}
        {errorEnvio && (
          <p className="error-span" role="alert">
            {errorEnvio}
          </p>
        )}
      </div>
    </section>
  );
}

export default ProductForm;

    
