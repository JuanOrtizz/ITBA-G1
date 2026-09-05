import { obtenerDestacados, formatearPrecio } from "./data.js";

const SELECTORES = {
  grid: "#productos-destacados",
  nav: "#site-nav",
  toggle: "#nav-toggle"
};

const IMG_FALLBACK = "assets/img/placeholder.svg";

function crearTarjeta(producto) {
  const articulo = document.createElement("article");
  articulo.className = "product-card";
  const media = document.createElement("div");
  media.className = "product-card__media";
  const img = document.createElement("img");
  img.src = producto.imagen;
  img.alt = producto.nombre;
  img.loading = "lazy";
  img.onerror = () => {
    img.src = IMG_FALLBACK;
    img.onerror = null;
  };
  media.appendChild(img);
  const body = document.createElement("div");
  body.className = "product-card__body";
  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;
  const precio = document.createElement("p");
  precio.className = "product-card__price";
  precio.textContent = formatearPrecio(producto.precio);
  const detalle = document.createElement("a");
  detalle.className = "btn btn-ghost";
  detalle.href = `producto.html?id=${producto.id}`;
  detalle.textContent = "Ver detalle";
  body.append(titulo, precio, detalle);
  articulo.append(media, body);
  return articulo;
}

function renderDestacados() {
  const grid = document.querySelector(SELECTORES.grid);
  if (!grid) return;

  const cargando = document.createElement("p");
  cargando.className = "products-empty";
  cargando.textContent = "Cargando productos...";
  grid.replaceChildren(cargando);

  setTimeout(() => {
    const destacados = obtenerDestacados(4);
    grid.replaceChildren();
    if (!destacados.length) {
      const vacio = document.createElement("p");
      vacio.className = "products-empty";
      vacio.textContent = "Todavía no hay productos destacados.";
      grid.appendChild(vacio);
      return;
    }
    destacados.forEach((producto) => {
      grid.appendChild(crearTarjeta(producto));
    });
  }, 2000);
}

function initNavMovil() {
  const nav = document.querySelector(SELECTORES.nav);
  const toggle = document.querySelector(SELECTORES.toggle);
  if (!nav || !toggle) return;
  toggle.addEventListener("click", () => {
    const abierto = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(abierto));
  });
}

function init() {
  initNavMovil();
  renderDestacados();
}

document.addEventListener("DOMContentLoaded", init);