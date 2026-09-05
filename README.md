# ITBA-G1

Proyecto grupal del curso de **Desarrollo Web (ITBA)**. Sitio web de una mueblería que permite explorar el catálogo de productos, ver el detalle de cada pieza, enviar consultas por medio de un formulario de contacto y armar un carrito de compras con contador dinámico.

## Integrantes

| Nombre |
|--------|
| Ortiz, Juan Ignacio |
| Llanquín, Franco Ariel|
| Lingordo, Manuel |
| Valdez, Juan Pablo |
| Céspedes, Tadeo |

## Funcionalidades

- **Home / Layout**: Plantilla base con HTML5 semántico, header con logo y menú de navegación, footer y sección Hero Banner. Renderiza en el home de 3 a 4 productos destacados desde el archivo central de datos. Diseño Mobile-First con Flexbox.
- **Catálogo y Búsqueda**: Grilla responsiva de tarjetas de productos (imagen, nombre, precio y enlace al detalle). Barra de búsqueda que filtra en tiempo real por nombre o categoría.
- **Detalle de producto**: Vista individual con imagen ampliada, descripción completa, detalles de fabricación, precio y botón de compra. Captura el id desde la URL y renderiza la información correspondiente.
- **Contacto y Feedback**: Formulario con validación en el cliente (campos requeridos y formato de correo), mensajes de error en tiempo real y confirmación de envío sin recargar la página.
- **Carrito**: Estado del carrito simulado con contador dinámico en el header. Simula la petición asíncrona de datos (setTimeout / async-await) y persiste el carrito en el almacenamiento local del navegador.

## Tecnologías utilizadas

- **HTML5** — Estructura semántica de las páginas.
- **CSS3** — Estilos, layout con Flexbox, diseño Mobile-First.
- **JavaScript (ES Modules)** — Renderizado dinámico del DOM, eventos, búsqueda en tiempo real, estado del carrito y lógica asíncrona.
- **Git y GitHub** — Control de versiones, ramas por persona y trabajo colaborativo.
- **GitHub Pages** — Hosting estático del sitio.

## Estructura del proyecto

```
/
├── index.html            # Home y layout global (Persona 1)
├── productos.html        # Catálogo y búsqueda (Persona 2)
├── producto.html         # Detalle de producto (Persona 3)
├── contacto.html         # Formulario de contacto (Persona 4)
├── README.md             # Documentación (Persona 5)
├── css/
│   └── styles.css        # Estilos globales
├── js/
│   ├── datos.js          # Datos del catálogo (data central)
│   ├── productos.js      # Lógica del catálogo (Persona 2)
│   ├── detalle.js        # Lógica del detalle (Persona 3)
│   ├── contacto.js       # Validación del contacto (Persona 4)
│   └── cart.js           # Estado del carrito y contador (Persona 5)
└── assets/
    ├── img/              # Imágenes de los productos
    └── icons/            # Iconos del sitio
```

## Cómo ejecutar

El proyecto es un sitio estático de JavaScript puro, sin dependencias ni build. Solo hay que abrir `index.html` en el navegador o servirlo con un servidor local (por ejemplo, el de Visual Studio Code "Live Server").

## Deploy

El sitio se despliega en **GitHub Pages** desde la rama `main` apuntando a la raíz del repositorio.
