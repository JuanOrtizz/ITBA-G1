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

## Estado del proyecto

El repositorio convive con dos etapas del mismo trabajo:

- **Sitio estático (Sprints 1 y 2).** En la raíz viven `index.html`, `productos.html`, `producto.html` y `contacto.html` junto a `css/`, `js/` y `assets/`. Es la versión publicada en GitHub Pages y se mantiene sin cambios.
- **Arquitectura cliente-servidor (Sprints 3 y 4).** En `backend/` y `client/` está la migración a una API REST y una SPA en React que consume esa API por `fetch`.

## Arquitectura

El objetivo de la migración es desacoplar el frontend de los datos. El catálogo deja de estar embebido en el cliente y pasa a tener una única fuente de verdad: la API.

```
┌──────────────────────┐        ┌───────────────────────────────────┐
│  client/ (React SPA) │        │  backend/ (Node.js + Express)     │
│                      │        │                                   │
│  fetch()  ───────────┼───────▶│  GET /api/productos               │
│  Sin datos locales   │◀───────┼──  JSON 200                       │
│  localhost:3000      │        │  GET /api/productos/:id           │
└──────────────────────┘        │  localhost:5000                   │
                                │                                   │
                                │  data/productos.js  (en memoria)  │
                                │  assets/img/        (estáticos)   │
                                └───────────────────────────────────┘
```

**Decisiones técnicas tomadas:**

- **Persistencia en memoria.** El catálogo vive en `backend/data/productos.js` como un array exportable. Es suficiente para el alcance del trabajo y permite cambiarlo por una base de datos sin tocar las rutas, porque los handlers solo conocen el array.
- **Ruteo modular con `express.Router`.** Las rutas de productos están aisladas en `backend/routes/productosRoutes.js`, y `server.js` solo las monta. Sumar un recurso nuevo no obliga a tocar el arranque del servidor.
- **Cadena de middlewares explícita.** `logger` → `cors` → `express.json` → estáticos → rutas → `notFound` → `errorHandler`. Cada petición se registra con marca de tiempo ISO 8601, y cualquier respuesta de error sale siempre con la misma forma JSON, sin importar dónde se originó.
- **Errores sin filtrar internos.** El `errorHandler` centralizado responde `{ error, mensaje }` y deja el stack únicamente en la consola del servidor. Una respuesta de error nunca expone rutas absolutas del proyecto.
- **Puerto y URL de la API por variable de entorno.** El servidor lee `process.env.PORT` y el catálogo arma las URLs de sus imágenes a partir de `process.env.API_BASE_URL`, con valores por defecto para desarrollo local. El mismo código sirve en la máquina de cada integrante y en un hosting, sin editar archivos.
- **Los assets se resuelven con `__dirname`.** La carpeta de imágenes se resuelve relativa al archivo del servidor y no al directorio desde donde se lo invoca, así se sirve el directorio correcto sin importar el `cwd`.

## Estructura del proyecto

```
/
├── backend/                    # API REST (Node.js + Express)
│   ├── data/
│   │   └── productos.js        # Catálogo en memoria
│   ├── middlewares/
│   │   ├── errorHandler.js     # notFound (404) + errorHandler (500) centralizado
│   │   └── logger.js           # Log de cada petición con timestamp ISO
│   ├── routes/
│   │   └── productosRoutes.js  # Router de /api/productos
│   ├── assets/img/             # Imágenes servidas en /assets
│   ├── package.json
│   └── server.js               # Arranque del servidor (puerto 5000)
├── client/                     # SPA React (Vite)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── index.html                  # Sitio estático de los Sprints 1 y 2
├── productos.html
├── producto.html
├── contacto.html
├── css/
├── js/
└── assets/
```

## Requisitos

- **Node.js 20.19 o superior** (se recomienda la LTS actual, que hoy es la 24). Vite 8, que es el que usa `client/`, no arranca en versiones anteriores.
- Git.

Verificar la instalación:

```bash
node -v
npm -v
```

## Instalación

Instalar las dependencias de cada aplicación por separado. Se usa `npm ci` en lugar de `npm install` porque ambos proyectos tienen `package-lock.json` y así se replican exactamente las versiones probadas.

```bash
# Backend
cd backend
npm ci

# Cliente
cd ../client
npm ci
```

## Ejecución en simultáneo

Hacen falta **dos terminales abiertas al mismo tiempo**: una para la API y otra para el cliente.

**Terminal 1 — Backend (puerto 5000):**

```bash
cd backend
npm run dev
```

Debería imprimir:

```
Servidor corriendo exitosamente en http://localhost:5000
```

**Terminal 2 — Cliente (puerto 3000):**

```bash
cd client
npm run dev
```

Vite imprime la URL del cliente: `http://localhost:3000`.

El puerto del cliente no es el que trae Vite por defecto (5173), sino que está fijado en `client/vite.config.js` junto con `strictPort`. Con `strictPort` activo, si el 3000 está ocupado Vite falla con un mensaje claro en vez de moverse en silencio a otro puerto, que es lo que rompería la configuración de CORS y de la API.

Los dos puertos están fijados a propósito: **5000 para la API y 3000 para el cliente**. No se pisan, así que se pueden levantar en cualquier orden.

### Nota para quienes usan PowerShell

Si al ejecutar `npm` aparece un error del tipo *"no se puede cargar el archivo npm.ps1 porque la ejecución de scripts está deshabilitada"*, es la política de ejecución de PowerShell y no un problema de Node. Hay dos salidas:

1. Usar `npm.cmd` en lugar de `npm`:
   ```powershell
   npm.cmd ci
   ```
2. Habilitar scripts locales para el usuario actual (no requiere administrador):
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```

## API

Base: `http://localhost:5000`

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| `GET` | `/api/productos` | Lista completa del catálogo | `200` con el array de productos |
| `GET` | `/api/productos/:id` | Un producto por su id numérico | `200` con el objeto, o `404` si no existe |
| `GET` | `/assets/img/:archivo` | Imágenes de los productos | `200` con la imagen |
| `GET` | `/` | Mensaje de bienvenida | `200` con texto plano |
| `POST` | `/api/productos` | Recibe un producto y lo devuelve en el eco. No persiste: sirve para verificar el parseo de JSON | `201` con el cuerpo recibido |

Errores: cualquier respuesta de error tiene la forma

```json
{ "error": "Not Found", "mensaje": "Producto no encontrado" }
```

### Campos de un producto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | Identificador numérico |
| `nombre` | string | Nombre de la pieza |
| `categoria` | string | Almacenamiento, Asientos, Mesas u Oficina |
| `precio` | number | Precio en pesos, sin formatear |
| `imagen` | string | Ruta relativa de la imagen (`/assets/img/...`), para resolver contra la API |
| `imagenURL` | string | URL absoluta de la imagen, ya armada con `API_BASE_URL` |
| `materiales` | string | Materiales principales, en la raíz del objeto |
| `descripcion` | string | Descripción comercial |
| `detalles` | object | Ficha técnica: medidas, acabado y demás |
| `destacado` | boolean | Si se muestra en el home |

### Probar la API

Con Git Bash, WSL o macOS/Linux:

```bash
# Catálogo completo
curl http://localhost:5000/api/productos

# Un producto
curl http://localhost:5000/api/productos/3

# Un id que no existe -> 404
curl -i http://localhost:5000/api/productos/999

# Una ruta que no existe -> 404
curl -i http://localhost:5000/no-existe
```

En PowerShell `curl` es un alias de `Invoke-WebRequest` y se comporta distinto. Ahí conviene:

```powershell
Invoke-RestMethod http://localhost:5000/api/productos
curl.exe -i http://localhost:5000/api/productos/999
```

## Variables de entorno

Ninguna es obligatoria: todas tienen un valor por defecto pensado para desarrollo local.

| Variable | Archivo | Por defecto | Descripción |
|----------|---------|-------------|-------------|
| `PORT` | `backend` | `5000` | Puerto de la API. Las plataformas de hosting lo inyectan solas. |
| `API_BASE_URL` | `backend` | `http://localhost:5000` | Host con el que se arma `imagenURL`. En producción debe ser la URL pública del backend. |
| `NODE_ENV` | `backend` | — | En `production` el stack de los errores no se imprime en consola. |

En el cliente, Vite expone las variables con prefijo `VITE_` a través de `import.meta.env`. El archivo `.env` no se versiona; hay un `.env.example` como referencia.

## Deploy

El sitio estático de la raíz se publica en **GitHub Pages** desde la rama `main`, que es como está configurado el repositorio.

**GitHub Pages no puede ejecutar la API**, porque solo sirve archivos estáticos y un servidor Express necesita un proceso de Node corriendo. Para publicar la arquitectura nueva hacen falta dos destinos:

1. **Cliente:** se puede publicar en GitHub Pages compilando `client/` con `npm run build` y publicando el contenido de `client/dist`. Si se lo publica en una URL con subcarpeta, hay que pasarle esa subcarpeta a Vite con la opción `base` en `vite.config.js`.
2. **Backend:** requiere un hosting de Node (Render, Railway, Fly.io, Vercel, etc.). El código ya está preparado: toma el puerto de `PORT` y solo hace falta definir `API_BASE_URL` con la URL pública que asigne el proveedor, para que las imágenes se resuelvan bien. **Si se olvida esa variable, las imágenes van a seguir apuntando a `localhost` y no se van a ver desde afuera.**
