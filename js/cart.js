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

// Devuelve el arreglo actual de productos en el carrito
function obtenerCarrito() {
    return carrito
}

// Devuelve la cantidad total de productos en el carrito
function obtenerCantidadCarrito() {
    return carrito.length
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

// Al cargar la pagina, se inicializa el carrito de forma asincrona
document.addEventListener("DOMContentLoaded", iniciarCarrito)

// Exportaciones para que se pueda integrar el carrito
export { iniciarCarrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, obtenerCarrito, obtenerCantidadCarrito, actualizarContador }
