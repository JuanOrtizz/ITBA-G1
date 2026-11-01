# ITBA-G1 — Mueblería Hermanos Jota

Proyecto grupal desarrollado para la materia de **Desarrollo Web (ITBA)**. Consiste en una plataforma de e-commerce para una mueblería que permite explorar el catálogo, consultar los detalles de cada producto, gestionar un carrito de compras y enviar consultas mediante un formulario de contacto.

La aplicación utiliza una arquitectura cliente-servidor: un frontend desarrollado en React y una API REST desarrollada con Node.js y Express. Los productos se almacenan en MongoDB.

## Integrantes

| Nombre                 |
| ---------------------- |
| Ortiz, Juan Ignacio    |
| Llanquín, Franco Ariel |
| Lingordo, Manuel       |
| Valdez, Juan Pablo     |
| Céspedes, Tadeo        |

## Estado del proyecto

El repositorio contiene dos etapas del trabajo:

- **Sitio estático (Sprints 1 y 2).** En la raíz se conservan `index.html`, `productos.html`, `producto.html` y `contacto.html`, junto con `css/`, `js/` y `assets/`. Corresponden a la primera versión del proyecto.
- **Aplicación cliente-servidor (Sprints posteriores).** La versión actual se encuentra en `client/` y `backend/`. El frontend consume la API REST y el backend obtiene los productos desde MongoDB.

## Arquitectura

La aplicación está separada en dos partes:

```text
┌──────────────────────────┐       ┌──────────────────────────────┐
│ client/                  │       │ backend/                     │
│ React + Vite             │       │ Node.js + Express            │
│                          │ HTTP  │                              │
│ Inicio                   |       |                              |
| Catálogo                 ◀──────▶ API REST                     │
│ Detalle de productos     │       │ Rutas de productos           │
│ Carrito                  │       │ Modelos con Mongoose         │
│ Administración           │       │ MongoDB                      │
│ Formulario de contacto   │       │                              │
└──────────────────────────┘       └──────────────────────────────┘
```

**Responsabilidades principales:**

- **Frontend.** Renderiza la tienda, gestiona la navegación, el estado del carrito y los formularios, y realiza solicitudes HTTP a la API.
- **Backend.** Expone los endpoints de productos, valida y procesa las solicitudes y se comunica con MongoDB mediante Mongoose.
- **Base de datos.** MongoDB almacena la información persistente de los productos.

## Funcionalidades

### Tienda

- Visualización del catálogo de productos.
- Búsqueda y filtrado de productos.
- Visualización de productos destacados.
- Página de detalle de cada producto.
- Carrito de compras con modificación de cantidades y contador dinámico.
- Formulario de contacto para enviar consultas a la mueblería.

### Administración de productos

- **Alta:** creación de nuevos productos.
- **Consulta:** listado y selección de productos existentes.
- **Edición:** modificación de los datos de un producto.
- **Eliminación:** eliminación de productos.
- **Persistencia:** almacenamiento de los cambios en MongoDB.

### Navegación

La aplicación utiliza **React Router** para gestionar la navegación entre páginas sin recargar el documento.

Rutas administrativas:

| Ruta                         | Descripción                                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| `/admin/crear-producto`      | Formulario para crear un producto.                                |
| `/admin/seleccionar-edicion` | Selección del producto que se desea editar.                       |
| `/admin/editar-producto/:id` | Formulario para editar el producto indicado por su identificador. |

## Estructura del proyecto

```text
/
├── backend/                    # API REST (Node.js + Express)
│   ├── models/                 # Modelos de Mongoose
│   ├── routes/                 # Rutas de la API
│   ├── middlewares/            # Middlewares del servidor
│   ├── package.json
│   └── server.js               # Arranque del servidor
├── client/                     # Aplicación frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas de la aplicación
│   │   ├── styles/             # Estilos
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── index.html                  # Versión estática inicial
├── productos.html
├── producto.html
├── contacto.html
├── css/
├── js/
└── assets/
```

## Requisitos

- **Node.js 20.19 o superior.**
- **npm**, incluido con Node.js.
- **Git.**
- Una instancia de **MongoDB** local o una base de datos en MongoDB Atlas.

Verificar las instalaciones:

```bash
node -v
npm -v
git --version
```

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/JuanOrtizz/ITBA-G1.git
cd ITBA-G1
```

Instalar las dependencias del backend:

```bash
cd backend
npm install
```

Instalar las dependencias del frontend:

```bash
cd ../client
npm install
```

## Ejecución en simultáneo

Se necesitan **dos terminales abiertas al mismo tiempo**: una para el backend y otra para el frontend.

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

La API queda disponible en `http://localhost:5000` (si no se configuró otro puerto).

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

Vite inicia el frontend en `http://localhost:3000`, según la configuración del proyecto.

Una vez iniciados ambos servicios, se puede acceder a la aplicación desde el navegador.

### Nota para quienes usan PowerShell

Si PowerShell muestra un error indicando que no puede ejecutar `npm.ps1` porque la ejecución de scripts está deshabilitada, se puede utilizar:

```powershell
npm.cmd install
```

También se puede habilitar la ejecución de scripts locales para el usuario actual:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## API REST

La API permite consultar y administrar los productos almacenados en MongoDB.

**Base URL local:** `http://localhost:5000`

| Método   | Ruta                 | Descripción                               |
| -------- | -------------------- | ----------------------------------------- |
| `GET`    | `/api/productos`     | Obtiene el catálogo de productos.         |
| `GET`    | `/api/productos/:id` | Obtiene un producto por su identificador. |
| `POST`   | `/api/productos`     | Crea un producto.                         |
| `PUT`    | `/api/productos/:id` | Actualiza un producto existente.          |
| `DELETE` | `/api/productos/:id` | Elimina un producto.                      |

Las respuestas de la API utilizan **JSON** y códigos de estado HTTP para indicar el resultado de cada operación.

### Modelo de producto

Los productos se almacenan en MongoDB mediante un modelo de Mongoose.

| Campo         | Tipo     | Descripción                                         |
| ------------- | -------- | --------------------------------------------------- |
| `_id`         | ObjectId | Identificador único generado por MongoDB.           |
| `nombre`      | String   | Nombre del producto.                                |
| `categoria`   | String   | Categoría del producto.                             |
| `precio`      | Number   | Precio del producto.                                |
| `imagenUrl`   | String   | Dirección de la imagen del producto.                |
| `descripcion` | String   | Descripción comercial.                              |
| `detalles`    | Object   | Información técnica del producto.                   |
| `stock`       | Number   | Cantidad disponible.                                |
| `destacado`   | Boolean  | Indica si el producto aparece entre los destacados. |

## Formulario de contacto

El formulario de contacto permite que los visitantes envíen consultas a la mueblería.

Incluye los campos de **nombre**, **correo electrónico** y **mensaje**. Cuenta con validaciones y utiliza **Formspree** para gestionar el envío de las consultas.

El formulario de contacto es independiente de la administración de productos y no modifica los registros almacenados en MongoDB.

## Variables de entorno

La aplicación utiliza variables de entorno para configurar la conexión entre el frontend, el backend y MongoDB.

### Backend

Crear un archivo `.env` dentro de `backend/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=tu_uri_de_mongodb
CLIENT_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000
```

| Variable       | Descripción                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `PORT`         | Puerto en el que se ejecuta el servidor.                               |
| `NODE_ENV`     | Entorno de ejecución (`development` o `production`).                   |
| `MONGODB_URI`  | Cadena de conexión a MongoDB.                                          |
| `CLIENT_URL`   | URL del frontend autorizada para acceder a la API mediante CORS.       |
| `API_BASE_URL` | URL base del backend utilizada para construir direcciones de recursos. |

### Frontend

Crear un archivo `.env` dentro de `client/`:

```env
VITE_API_URL=http://localhost:5000
```

| Variable       | Descripción                                 |
| -------------- | ------------------------------------------- |
| `VITE_API_URL` | URL base de la API que consume el frontend. |

**Importante:** los archivos `.env` pueden contener credenciales y no deben subirse al repositorio. En producción, las variables se configuran desde el panel del proveedor de hosting.

## Formulario de contacto

El envío de consultas se realiza mediante Formspree. Para que funcione correctamente, el formulario debe conservar la configuración del servicio correspondiente.

## Deploy

La aplicación se publica mediante dos servicios independientes:

### Frontend — Vercel

- **URL pública:** https://itba-g1.vercel.app/
- **Directorio raíz:** `client`.
- **Framework:** Vite.
- **Comando de instalación:** `npm install`.
- **Comando de compilación:** `npm run build`.
- **Directorio de salida:** `dist`.
- **Variable de entorno:** `VITE_API_URL`, con la URL pública del backend.

### Backend — Render

- **URL pública:** https://itba-g1.onrender.com/
- **API de productos:** https://itba-g1.onrender.com/api/productos
- **Directorio raíz:** `backend`.
- **Comando de instalación:** `npm install`.
- **Comando de inicio:** `npm start`.
- **Variables de entorno:** `NODE_ENV`, `MONGODB_URI`, `CLIENT_URL` y `API_BASE_URL`.

La variable `CLIENT_URL` debe contener el dominio público del frontend para permitir las solicitudes mediante CORS.

La variable `API_BASE_URL` debe contener el dominio público del backend para que las direcciones de los recursos sean accesibles desde producción.

Después de modificar las variables de entorno del frontend en Vercel, es necesario generar un nuevo deployment para que Vite las incorpore durante la compilación.

## Repositorio

**GitHub:** https://github.com/JuanOrtizz/ITBA-G1
