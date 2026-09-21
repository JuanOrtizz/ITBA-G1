import { catalogo, formatearPrecio } from "./datos.js";
import { iniciarCarrito, agregarAlCarrito } from "./cart.js";
import { cargarHeader, cargarFooter } from "./componentes.js";

const IMG_FALLBACK = "assets/img/placeholder.svg";
const RETRASO_SIMULADO_MS = 600;

function obtenerIdDesdeURL() {
  const parametros = new URLSearchParams(window.location.search);
  return Number(parametros.get("id"));
}

// Simula una petición asíncrona de datos, igual que el resto del catálogo
function buscarProducto(id) {
  return new Promise((resolver) => {
    setTimeout(() => {
      resolver(catalogo.find((producto) => producto.id === id));
    }, RETRASO_SIMULADO_MS);
  });
}

function crearListaDetalles(detalles) {
  const lista = document.createElement("dl");
  lista.className = "detalle-specs";
  Object.entries(detalles).forEach(([clave, valor]) => {
    const dt = document.createElement("dt");
    dt.textContent = clave;
    const dd = document.createElement("dd");
    dd.textContent = valor;
    lista.append(dt, dd);
  });
  return lista;
}

function renderNoEncontrado(contenedor) {
  contenedor.replaceChildren();
  const aviso = document.createElement("p");
  aviso.className = "detalle-error";
  aviso.textContent =
    "No encontramos el producto que buscás. Volvé al catálogo e intentá de nuevo.";
  contenedor.appendChild(aviso);
}

function renderProducto(producto) {
  const contenedor = document.querySelector("#detalle-producto");
  contenedor.replaceChildren();

  document.title = `${producto.nombre} | Hermanos Jota`;

  const figura = document.createElement("figure");
  figura.className = "detalle-media";
  const img = document.createElement("img");
  img.src = producto.imagenURL;
  img.alt = producto.nombre;
  img.onerror = () => {
    img.src = IMG_FALLBACK;
    img.onerror = null;
  };
  figura.appendChild(img);

  const info = document.createElement("div");
  info.className = "detalle-info";

  const categoria = document.createElement("p");
  categoria.className = "detalle-categoria";
  categoria.textContent = producto.categoria;

  const titulo = document.createElement("h1");
  titulo.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "detalle-precio";
  precio.textContent = formatearPrecio(producto.precio);

  const descripcion = document.createElement("p");
  descripcion.className = "detalle-descripcion";
  descripcion.textContent = producto.descripcion;

  const specsTitulo = document.createElement("h2");
  specsTitulo.textContent = "Detalles de fabricación";

  const specs = crearListaDetalles(producto.detalles);

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn btn-primary detalle-boton-carrito";
  boton.textContent = "Añadir al carrito";

  const feedback = document.createElement("p");
  feedback.className = "detalle-feedback";
  feedback.setAttribute("role", "status");

  boton.addEventListener("click", async () => {
    boton.disabled = true;
    await agregarAlCarrito(producto);
    feedback.textContent = `${producto.nombre} se agregó al carrito.`;
    boton.disabled = false;
  });

  const compra = document.createElement("div");
  compra.className = "detalle-compra";
  compra.append(precio, boton);

  info.append(
    categoria,
    titulo,
    compra,
    feedback,
    descripcion,
    specsTitulo,
    specs
  );
  contenedor.append(figura, info);
}

cargarHeader("catalogo");
cargarFooter();

async function init() {
  iniciarCarrito();

  const contenedor = document.querySelector("#detalle-producto");
  const id = obtenerIdDesdeURL();
  const producto = await buscarProducto(id);

  if (!producto) {
    renderNoEncontrado(contenedor);
    return;
  }
  renderProducto(producto);
}

document.addEventListener("DOMContentLoaded", init);
