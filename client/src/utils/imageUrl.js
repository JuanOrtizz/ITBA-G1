const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Obtiene la URL completa y válida para una imagen.
 * Si la URL ya comienza con http://, https:// o data:, la devuelve tal cual.
 * Si es una ruta relativa (ej: /assets/img/...), le antepone la URL base de la API.
 * Si es vacía o nula, devuelve un string vacío o un fallback opcional.
 */
export function getImageUrl(path) {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const cleanApiUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${cleanApiUrl}${cleanPath}`;
}
