# Hermanos Jota — Cliente (React + Vite)

SPA en React que consume la API de `../backend`. No tiene datos de productos propios: todo el catálogo llega por `fetch` desde la API.

```bash
npm ci
npm run dev   # o npm start
```

Se abre en `http://localhost:3000` y espera la API en `http://localhost:5000` (configurable con `VITE_API_URL`, ver `.env.example`).

La arquitectura, las decisiones técnicas y las instrucciones para levantar los dos servidores están en el [README principal](../README.md).
