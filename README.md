# DCIM — Gestión de Datacenter

Este repositorio contiene una interfaz frontend y un backend (esqueleto) para un sistema DCIM (Data Center Infrastructure Management). El README está escrito como si te lo contara un compañero de equipo: directo, claro y con instrucciones para arrancar rápido.

## Resumen

- Frontend: React + Vite
- Backend: carpeta `backend/` (esqueleto)
- Diseño: Tema oscuro con variables CSS; Tailwind fue eliminado y reemplazado por CSS modular por componente
- Datos de desarrollo: `src/data/mockData.json` (usuarios, métricas y atajos)

## Requisitos

- Node.js >= 18
- npm

## Arrancar en desarrollo (frontend)

Abre una consola en `frontend/` y ejecuta:

```bash
cd frontend
npm install
npm run dev
```

El servidor de Vite arranca normalmente en `http://localhost:5173`.

## Credenciales de prueba

Para probar el login mock implementado en el frontend usa:

- Email: `admin@dcim.local`
- Contraseña: `admin123`

Al iniciar sesión con esas credenciales verás el Dashboard. El inicio de sesión utiliza datos simulados y guarda un objeto `user` y `token` en `localStorage`.

## Qué cambié / cosas a tener en cuenta

- Tailwind: eliminado (dependencias y plugin Vite). Todos los estilos se migraron a CSS modular por componente. Los estilos globales mínimos (variables CSS y resets) están en `src/index.css`.
- Login: validación local, botón para mostrar/ocultar contraseña, guarda usuario en `localStorage` y notifica al `App` sobre el login exitoso.
- Rutas: `App.jsx` ahora tiene protección en memoria para rutas privadas (ej. `/dashboard`) y se expone un callback `onLoginSuccess` en `Login`.
- Mock data centralizado en `src/data/mockData.json` — útil para pruebas mientras no haya backend.

## Estructura relevante

- `frontend/src/pages/login/` — Login
- `frontend/src/pages/dashboard/` — Dashboard y layout
- `frontend/src/components/` — Componentes reutilizables (Sidebar, StatCard, StatusPanel, QuickAccess, etc.)
- `frontend/src/data/mockData.json` — Datos falsos para desarrollo
