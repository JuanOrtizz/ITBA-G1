import { agregarAlCarrito } from "./cart.js";

export function cargarHeader() {
    const header = document.createElement("header");
    header.innerHTML = `
        <div id="contenedor-header">
            <a href="index.html" id="header-logo">
                <img src="assets/icons/logo.svg" alt="">
                Hermanos Jota
            </a>
                
            <nav id="header-nav">
                <ul>
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="productos.html">Catálogo</a></li>
                    <li><a href="contacto.html">Contacto</a></li>
                </ul>
            </nav>
                
            <span id="contador-carrito">0</span>
        </div>`;
    document.body.prepend(header);
}

export function cargarFooter() {
    const footer = document.createElement("footer");
    footer.innerHTML = `
        <div id="contenedor-footer">
                
            <div class="footer-columna">
                <h3>Navegación</h3>
                <ul>
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="productos.html">Catálogo de productos</a></li>
                    <li><a href="contacto.html">Contacto</a></li>
                </ul>
            </div>
                
            <div class="footer-columna">
                <h3>Dirección</h3>
                <p>Av. San Juan 2847</p>
                <p>C1232AAB — Barrio de San Cristóbal</p>
                <p>CABA, Argentina</p>
                <h3>Horarios</h3>
                <p>Lunes a Viernes: 10:00 - 19:00</p>
                <p>Sábados: 10:00 - 14:00</p>
            </div>
                
            <div class="footer-columna">
                <h3>Contactanos</h3>
                <p> <img src="assets/icons/whatsapp.svg" alt="WhatsApp" class="icono-footer" id="icono-wpp">
                    +54 11 4567-8900
                </p>
                <p> <img src="assets/icons/gmail.svg" alt="Gmail" class="icono-footer">
                    info@hermanosjota.com.ar
                </p>
                <p> <img src="assets/icons/gmail.svg" alt="Gmail" class="icono-footer">
                    ventas@hermanosjota.com.ar
                </p>
                <p> <img src="assets/icons/instagram.svg" alt="Instagram" class="icono-footer">
                    @hermanosjota_ba
                </p>
            </div>
                
        </div>
            
        <div id="footer-copyright">
            <p><strong>© 2026 Hermanos Jota.</strong> Todos los derechos reservados</p>
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
        boton.textContent = "Añadir al Carrito";
        boton.addEventListener("click", function(evento) {
            evento.stopPropagation();
            agregarAlCarrito(mueble);
        });
        divProducto.appendChild(boton);

        contenedorDestino.appendChild(divProducto);
    });
}
