import { formatearPrecio } from "./datos.js"

// Estado del carrito (arreglo de objetos producto)
let carrito = []

// Clave usada para persistir el carrito en el almacenamiento local
const CLAVE_CARRITO = "carrito"

function pedirCarritoGuardado() {
    return new Promise(function (resolver) {
        setTimeout(function () {
            try {
                const guardado = localStorage.getItem(CLAVE_CARRITO)
                resolver(guardado ? JSON.parse(guardado) : [])
            } catch (error) {
                // Si el JSON guardado esta corrupto, empieza vacio
                resolver([])
            }
        }, 0)
    })
}

// Inicializa el carrito cargando su estado de forma asincrona
// Debe llamarse una vez al cargar la pagina
async function iniciarCarrito() {
    carrito = await pedirCarritoGuardado()
    actualizarContador()
}


// Agrega un producto al carrito
async function agregarAlCarrito(producto) {
    await new Promise(function (resolver) {
        setTimeout(resolver, 100)
    })
    carrito.push(producto)
    guardarCarrito()
    actualizarContador()
    return carrito.length
}

// Elimina un producto del carrito según su id
function eliminarDelCarrito(id) {
    const indice = carrito.findIndex(function (item) {
        return item.id === id
    })
    if (indice !== -1) {
        carrito.splice(indice, 1)
        guardarCarrito()
        actualizarContador()
    }
    return carrito.length
}

// Vacia el carrito por completo
function vaciarCarrito() {
    carrito = []
    guardarCarrito()
    actualizarContador()
}

// Persiste el estado actual en el almacenamiento local
function guardarCarrito() {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
    } catch (error) {
        // Si el almacenamiento no esta disponible, se ignora usando try-catch
    }
}

// Actualiza el numero del contador en el header
function actualizarContador() {
    const contador = document.querySelector("#contador-carrito")
    if (contador) {
        contador.textContent = String(carrito.length)
    }
}

function crearPanelCarrito() {
    if (document.querySelector("#panel-carrito")) return

    const panel = document.createElement("aside")
    panel.id = "panel-carrito"
    panel.setAttribute("aria-hidden", "true")
    panel.innerHTML = `
        <div class="carrito-panel__contenido">
            <div class="carrito-panel__encabezado">
                <h2>Mi carrito</h2>
                <button type="button" class="carrito-panel__cerrar" aria-label="Cerrar carrito">&times;</button>
            </div>
            <div class="carrito-panel__productos"></div>
            <div class="carrito-panel__pie"></div>
        </div>`
    document.body.appendChild(panel)

    panel.addEventListener("click", function (evento) {
        const botonEliminar = evento.target.closest("[data-eliminar-id]")
        if (evento.target === panel || evento.target.closest(".carrito-panel__cerrar")) {
            cerrarPanelCarrito()
        } else if (botonEliminar) {
            eliminarDelCarrito(Number(botonEliminar.dataset.eliminarId))
            renderCarrito()
        } else if (evento.target.closest("[data-vaciar-carrito]")) {
            vaciarCarrito()
            renderCarrito()
        }
    })
}

function renderCarrito() {
    const panel = document.querySelector("#panel-carrito")
    if (!panel) return

    const productos = panel.querySelector(".carrito-panel__productos")
    const pie = panel.querySelector(".carrito-panel__pie")
    productos.replaceChildren()
    pie.replaceChildren()

    if (!carrito.length) {
        const vacio = document.createElement("p")
        vacio.textContent = "Tu carrito está vacío."
        productos.appendChild(vacio)
        return
    }

    let total = 0
    carrito.forEach(function (producto) {
        total += producto.precio
        const item = document.createElement("article")
        item.className = "carrito-item"
        item.innerHTML = `
            <img src="${producto.imagenURL}" alt="${producto.nombre}">
            <div>
                <h3>${producto.nombre}</h3>
                <p>${formatearPrecio(producto.precio)}</p>
                <button type="button" data-eliminar-id="${producto.id}">Eliminar</button>
            </div>`
        productos.appendChild(item)
    })

    pie.innerHTML = `
        <p class="carrito-panel__total"><strong>Total:</strong> ${formatearPrecio(total)}</p>
        <button type="button" class="btn btn-ghost" data-vaciar-carrito>Vaciar carrito</button>`
}

function abrirPanelCarrito() {
    crearPanelCarrito()
    renderCarrito()
    const panel = document.querySelector("#panel-carrito")
    panel.classList.add("is-open")
    panel.setAttribute("aria-hidden", "false")
}

function cerrarPanelCarrito() {
    const panel = document.querySelector("#panel-carrito")
    if (!panel) return
    panel.classList.remove("is-open")
    panel.setAttribute("aria-hidden", "true")
}

function iniciarInterfazCarrito() {
    crearPanelCarrito()
    document.querySelectorAll(".cart-btn").forEach(function (boton) {
        boton.addEventListener("click", function (evento) {
            evento.preventDefault()
            abrirPanelCarrito()
        })
    })
}

// Al cargar la pagina, se inicializa el carrito de forma asincrona
document.addEventListener("DOMContentLoaded", function () {
    iniciarCarrito()
    iniciarInterfazCarrito()
})

// Exportaciones para que se pueda integrar el carrito
export { iniciarCarrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, actualizarContador }