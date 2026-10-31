import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

const getDetallesVacios = () => Array.from({ length: 5 }, () => ({ clave: "", valor: "" }));
const ESTADO_VACIO = {
    nombre: "",
    categoria: "",
    precio: "",
    imagenUrl: "",
    descripcion: "",
    detalles: getDetallesVacios(),
    stock: "",
};

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = Boolean(id);
    const [enviado, setEnviado] = useState(false);
    const [formData, setFormData] = useState(ESTADO_VACIO);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!esEdicion) {
            setTimeout(() => setFormData(ESTADO_VACIO), 0);
            return;
        }

        const url = `${API_URL}/api/productos/${id}`;
        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al conectar con el servidor");
                }
                return res.json();
            })
            .then((data) => {
                const detallesBD = data.detalles ? Object.entries(data.detalles).map(([c, v]) => ({ clave: c, valor: v })) : [];
                const detallesCompletos = [...detallesBD, ...getDetallesVacios()].slice(0, 5);
                setFormData({
                    nombre: data.nombre || "",
                    categoria: data.categoria || "",
                    precio: data.precio || "",
                    imagenUrl: data.imagenUrl || data.imagen || "",      
                    descripcion: data.descripcion || "",
                    detalles: detallesCompletos,
                    stock: data.stock || "",
                });
                setError(null);
            })
            .catch((err) => {
                console.error("Error al cargar el detalle:", err);
                setError(err.message);
            })
            .finally(() => {
                setCargando(false);
            });
    }, [id, esEdicion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const handleDetalleChange = (index, campo, valor) => {
        const nuevosDetalles = [...formData.detalles];
        nuevosDetalles[index][campo] = valor;
        setFormData({ ...formData, detalles: nuevosDetalles });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCargando(true);
        setError(null);
        
        // Limpieza y camelCase de los detalles antes de enviar
        const objetoDetalles = {};
        formData.detalles.forEach(item => {
            if (item.clave.trim() !== "" && item.valor.trim() !== "") {
                const claveCamelCase = item.clave.trim().split(/\s+/).map((palabra, index) => {
                    if (index === 0) return palabra.toLowerCase();
                    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
                }).join("");
                objetoDetalles[claveCamelCase] = item.valor;
            }
        });
        
        try {
            const productoAEnviar = {
                ...formData,
                precio: Number(formData.precio),
                stock: Number(formData.stock),
                detalles: objetoDetalles,
            };

            // Definimos dinámicamente si es un POST (crear) o PUT (editar)
            const url = esEdicion ? `${API_URL}/api/productos/${id}` : `${API_URL}/api/productos`;
            const method = esEdicion ? "PUT" : "POST";
            
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productoAEnviar),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Error al crear el producto");
            }

            setEnviado(true);

            // Si estábamos creando, limpiamos el form. Si editábamos, volvemos al catálogo.
            if (!esEdicion) {
                setTimeout(() => {
                    setEnviado(false);
                    navigate("/productos");
                }, 3000);
            } else {
                setTimeout(() => navigate("/productos"), 3000);
            }
            
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <form className="formulario-base" onSubmit={handleSubmit}>
                <label>Nombre del mueble *</label>
                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} />

                <label>Categoría</label>
                <input type="text" name="categoria" required value={formData.categoria} onChange={handleChange} />
                
                <label>Precio ($) *</label>
                <input type="number" name="precio" min="0" required value={formData.precio} onChange={handleChange} />
                
                <label>URL de la imagen</label>
                <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} />
                
                <label>Descripción</label>
                <textarea name="descripcion" rows="4" value={formData.descripcion} onChange={handleChange}></textarea>

                <fieldset className="fieldset-detalles">
                    <legend>Especificaciones (Tus 5 campos. Dejá vacío el que no uses)</legend>
                    {formData.detalles.map((detalle, index) => (
                        <div key={index} className="fila-detalle">
                            <input 
                                type="text" 
                                className="input-clave" 
                                placeholder="Clave (Ej: Material)" 
                                value={detalle.clave} 
                                onChange={(e) => handleDetalleChange(index, "clave", e.target.value)} 
                            />
                            <input 
                                type="text" 
                                className="input-valor" 
                                placeholder="Valor (Ej: Nogal Macizo)" 
                                value={detalle.valor} 
                                onChange={(e) => handleDetalleChange(index, "valor", e.target.value)} 
                            />
                        </div>
                    ))}
                </fieldset>

                <label>Stock disponible</label>
                <input type="number" name="stock" min="0" value={formData.stock} onChange={handleChange} />
                
                <button type="submit" className="btn btn-primary" disabled={cargando}>
                    {cargando ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Crear Producto"}
                </button>
            </form>
            <h3 className="mensaje-estado" style={{ display: enviado || error ? "block" : "none" }}>
                {error ? error : esEdicion ? "¡El producto fue actualizado exitosamente!" : "¡El producto fue creado exitosamente!"}
            </h3>
        </>
    );
}

export default ProductForm;
