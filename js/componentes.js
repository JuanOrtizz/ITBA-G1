import "./cart.js";

function initNavMovil() {
    const nav = document.querySelector("#site-nav");
    const toggle = document.querySelector("#nav-toggle");
    if (!nav || !toggle) return;
    toggle.addEventListener("click", () => {
        const abierto = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(abierto));
    });
}

// Arma el header y lo antepone al body. paginaActiva: "inicio" | "catalogo" | "contacto"
export function cargarHeader(paginaActiva) {
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
        <div class="container header-inner">
            <a class="logo" href="index.html" aria-label="Hermanos Jota — inicio">
                <img src="assets/img/logo.svg" alt="Logotipo Hermanos Jota" />
                <span class="logo-text">Hermanos Jota</span>
            </a>
            <nav class="site-nav" id="site-nav" aria-label="Principal">
                <ul class="nav-list">
                    <li><a href="index.html"${paginaActiva === "inicio" ? ' aria-current="page"' : ""}>Inicio</a></li>
                    <li><a href="productos.html"${paginaActiva === "catalogo" ? ' aria-current="page"' : ""}>Catálogo</a></li>
                    <li><a href="contacto.html"${paginaActiva === "contacto" ? ' aria-current="page"' : ""}>Contacto</a></li>
                </ul>
            </nav>
            <div class="header-actions">
                <a class="cart-btn" href="#" aria-label="Carrito de compras">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6h15l-1.5 9h-12L5 3H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="9" cy="20" r="1.4" fill="currentColor" />
                        <circle cx="18" cy="20" r="1.4" fill="currentColor" />
                    </svg>
                    <span class="cart-count" id="contador-carrito">0</span>
                </a>
                <button class="nav-toggle" id="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Abrir menú">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>`;
    document.body.prepend(header);
    initNavMovil();
}

// Arma el footer y lo agrega al final del body
export function cargarFooter() {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <img src="assets/img/logo.svg" alt="" />
                    <strong>Hermanos Jota</strong>
                    <p>Mueblería de autor. Carpintería de banco, maderas locales y terminaciones al aceite.</p>
                </div>
                <div class="footer-col">
                    <h3>Contacto</h3>
                    <p>Av. San Juan 2847, CABA</p>
                    <p>Lun a Vie: 10:00 - 19:00<br>Sábados: 10:00 - 14:00</p>
                    <a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a>
                    <a href="tel:+541145678900">WhatsApp: +54 11 4567-8900</a>
                    <a href="https://instagram.com/hermanosjota_ba" target="_blank" rel="noopener">@hermanosjota_ba</a>
                </div>
                <div class="footer-col">
                    <h3>Sitio</h3>
                    <a href="index.html">Inicio</a>
                    <a href="productos.html">Catálogo</a>
                    <a href="contacto.html">Contacto</a>
                </div>
            </div>
            <p class="footer-bottom">© 2026 Hermanos Jota. Todos los derechos reservados.</p>
        </div>`;
    document.body.appendChild(footer);
}

// Grilla de tarjetas de productos
export function mostrarProductos(arrayMuebles, contenedorDestino) {
    contenedorDestino.innerHTML = "";

    arrayMuebles.forEach((mueble) => {
        const divProducto = document.createElement("div");
        divProducto.classList.add("tarjeta-producto");

        // Cada producto detalla su enlace
        divProducto.addEventListener("click", function () {
            window.location.href = `producto.html?id=${mueble.id}`;
        });

        const nombre = document.createElement("h2");
        nombre.textContent = mueble.nombre;
        divProducto.appendChild(nombre);

        const imagen = document.createElement("img");
        imagen.src = mueble.imagenURL;
        divProducto.appendChild(imagen);

        const descripcion = document.createElement("p");
        descripcion.textContent = mueble.descripcion;
        divProducto.appendChild(descripcion);

        const boton = document.createElement("button");
        boton.className = "btn btn-primary detalle-boton-carrito";
        boton.textContent = "Ver detalle";
        boton.addEventListener("click", function(evento) {
            evento.stopPropagation();
            window.location.href = `producto.html?id=${mueble.id}`;
        });
        divProducto.appendChild(boton);

        contenedorDestino.appendChild(divProducto);
    });
}
