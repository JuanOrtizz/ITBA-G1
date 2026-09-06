import { catalogo, pedirDatos } from "./datos.js";
import { cargarHeader, mostrarProductos, cargarFooter } from "./componentes.js";

const contenedorCatalogo = document.querySelector("#contenedor-catalogo");
const inputBuscador = document.querySelector("#buscador");
let mueblesDescargados = [];

cargarHeader("catalogo");
cargarFooter();

iniciarCatalogo();
inputBuscador.addEventListener("input", function (evento) {
    const textoBuscado = quitarAcentos(evento.target.value.toLowerCase());
    const resultadosFiltrados = catalogo.filter(function (mueble) {
        const nombreMueble = quitarAcentos(mueble.nombre.toLowerCase());
        const categoriaMueble = quitarAcentos(mueble.categoria.toLowerCase());
        return nombreMueble.startsWith(textoBuscado) || categoriaMueble.startsWith(textoBuscado);
    });

    // Faltaba agregar contenedorCatalogo como destino
    mostrarProductos(resultadosFiltrados, contenedorCatalogo);
});

//Simular una petición de datos asíncrona para cargar el catálogo
async function iniciarCatalogo() {
    contenedorCatalogo.innerHTML = "<h2>Cargando Catálogo</h2>";
    mueblesDescargados = await pedirDatos();
    mostrarProductos(mueblesDescargados, contenedorCatalogo);
}

function quitarAcentos(texto) {
    return texto.replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u");
}