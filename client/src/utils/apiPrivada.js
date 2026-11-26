const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Error con el status HTTP, para que cada pantalla decida qué mostrar
export class ErrorApi extends Error {
    constructor(mensaje, status) {
        super(mensaje);
        this.status = status;
    }
}

// GET a un endpoint privado con el JWT en el header Authorization.
// El backend devuelve los errores como { error: "..." }
export async function getPrivado(ruta, token, signal) {
    let res;
    try {
        res = await fetch(`${API_URL}${ruta}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal,
        });
    } catch (err) {
        if (err.name === "AbortError") throw err;
        throw new ErrorApi("No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.", 0);
    }

    let datos = null;
    try {
        datos = await res.json();
    } catch {
        // respuesta sin JSON: se usa el mensaje genérico de abajo
    }

    if (!res.ok) {
        throw new ErrorApi(datos?.error || datos?.message || "Ocurrió un error inesperado.", res.status);
    }

    return datos;
}

export function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(precio);
}

export function formatearFecha(fechaIso, conHora = false) {
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    if (conHora) {
        opciones.hour = "2-digit";
        opciones.minute = "2-digit";
    }
    return new Date(fechaIso).toLocaleDateString("es-AR", opciones);
}
