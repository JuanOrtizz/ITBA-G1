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

- **Home / Layout**: Header con logo y menú de navegación, footer y sección Hero Banner, generados dinámicamente desde `componentes.js` y compartidos por las 4 páginas. Renderiza en el home los 4 productos destacados desde el archivo central de datos. Diseño Mobile-First con Flexbox.
- **Catálogo y Búsqueda**: Grilla responsiva de tarjetas de productos (imagen, nombre, precio y enlace al detalle). Barra de búsqueda que filtra en tiempo real por nombre o categoría.
- **Detalle de producto**: Vista individual con imagen ampliada, descripción completa, detalles de fabricación, precio y botón para agregar al carrito. Captura el id desde la URL y renderiza la información correspondiente.
- **Contacto y Feedback**: Formulario con validación en el cliente (campos requeridos y formato de correo), mensajes de error en tiempo real y envío real del mensaje mediante Formspree, sin recargar la página.
- **Carrito**: Estado del carrito con contador dinámico en el header, persistido en el almacenamiento local del navegador. Simula la latencia de una API real con setTimeout / async-await al cargar y modificar el carrito.

## Tecnologías utilizadas

- **HTML5** — Estructura semántica de las páginas.
- **CSS3** — Estilos, layout con Flexbox, diseño Mobile-First.
- **JavaScript (ES Modules)** — Renderizado dinámico del DOM, eventos, búsqueda en tiempo real, estado del carrito y lógica asíncrona.
- **Git y GitHub** — Control de versiones y trabajo colaborativo.
- **GitHub Pages** — Hosting estático del sitio.

## Estructura del proyecto

```
/
├── index.html            # Home
├── productos.html        # Catálogo y búsqueda
├── producto.html         # Detalle de producto
├── contacto.html         # Formulario de contacto
├── README.md             # Documentación
├── css/
│   └── styles.css        # Estilos globales
├── js/
│   ├── datos.js          # Datos del catálogo (data central)
│   ├── componentes.js    # Header, footer y tarjetas de producto compartidos
│   ├── index.js          # Lógica del home
│   ├── productos.js      # Lógica del catálogo
│   ├── detalle.js        # Lógica del detalle
│   ├── contacto.js       # Validación y envío del formulario de contacto
│   └── cart.js           # Estado del carrito y contador
└── assets/
    └── img/              # Imágenes y logo del sitio
```

## Cómo ejecutar

El proyecto es un sitio estático de JavaScript puro, sin dependencias ni build. Solo hay que abrir `index.html` en el navegador o servirlo con un servidor local (por ejemplo, el de Visual Studio Code "Live Server").

## Deploy

El sitio se despliega en **GitHub Pages** desde la rama `main` apuntando a la raíz del repositorio.
