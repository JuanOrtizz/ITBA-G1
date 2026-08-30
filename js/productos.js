import { catalogo } from "./datos.js";

const contenedorCatalogo = document.querySelector("#contenedor-catalogo");
const inputBuscador = document.querySelector("#buscador");
let mueblesDescargados = [];

iniciarCatalogo();

//Simular una petición de datos asíncrona para cargar el catálogo
async function iniciarCatalogo() {
    contenedorCatalogo.innerHTML = "<h2>Cargando Catálogo</h2>"
    mueblesDescargados = await pedirDatos();
    mostrarProductos(mueblesDescargados);
}

function pedirDatos() {
    return new Promise(function (resolver) {
        setTimeout(function() {
            resolver(catalogo);
        }, 1500);
    });
}

// Grilla de tarjetas de productos
function mostrarProductos(arrayMuebles) {
    contenedorCatalogo.innerHTML = "";

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

        contenedorCatalogo.appendChild(divProducto);
    });
}

// Campo de Búsqueda
inputBuscador.addEventListener("input", function (evento) {
    const textoBuscado = quitarAcentos(evento.target.value.toLowerCase());

    const resultadosFiltrados = catalogo.filter(function (mueble) {
        const nombreMueble = quitarAcentos(mueble.nombre.toLowerCase());
        const categoriaMueble = quitarAcentos(mueble.categoria.toLowerCase());
        if (nombreMueble.startsWith(textoBuscado) || categoriaMueble.startsWith(textoBuscado)) {
            return true;
        } else {
            return false;
        }
    });
    mostrarProductos(resultadosFiltrados);
});

function quitarAcentos(texto) {
    return texto
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u');
}