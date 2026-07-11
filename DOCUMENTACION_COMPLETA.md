# Documentación del Proyecto DCIM

## Contenido
1. Resumen General  
2. Estructura del Proyecto  
3. Backend  
4. Frontend  
5. Flujo de Datos  
6. Autenticación  
7. Estructura de Datos  
8. Tecnologías Utilizadas  
9. Notas Finales  

---

## Resumen General
**DCIM (Data Center Infrastructure Management)** es una aplicación web full-stack para gestionar datacenters.  
Incluye administración de:  
- Sitios (ubicaciones físicas)  
- Salas (espacios dentro de sitios)  
- Racks (muebles de instalación en unidades "U")  
- Dispositivos (servidores, switches, etc.)  
- Modelos (especificaciones de hardware)  
- Fabricantes (proveedores de equipamiento)  

---

## Estructura del Proyecto

Proyecto-DCIM/
├── backend/        # API y lógica de negocio
├── frontend/       # Interfaz React

**Backend**: Node.js + Express, conexión MySQL, controladores, rutas y middlewares.  
**Frontend**: React + Vite, componentes reutilizables, páginas CRUD y router principal.  

---

## Backend
- **server.js**: Inicializa Express, middlewares globales y routers.  
- **db/connection.js**: Pool de conexiones MySQL.  
- **db/repository.js**: Funciones CRUD para cada entidad (sitios, salas, racks, dispositivos, modelos, fabricantes, ocupación).  
- **middlewares/auth.js**: Validación JWT.  
- **controllers/**: Lógica de negocio por recurso.  
- **routes/**: Endpoints HTTP siguiendo patrón REST.  

---

## Frontend
- **main.jsx**: Punto de entrada React.  
- **App.jsx**: Router principal, autenticación y rutas protegidas.  
- **components/**: Sidebar, UserCard, StatCard, StatusPanel, QuickAccess.  
- **pages/**: CRUD completo para sitios, salas, racks, dispositivos, fabricantes y modelos.  
- **lib/dcimApi.js**: Funciones HTTP (GET, POST, PUT, DELETE) con token JWT.  

---

## Flujo de Datos
- **Autenticación**: Login → validación backend → generación JWT → almacenamiento en localStorage → sincronización en frontend.  
- **CRUD típico**: Frontend envía petición → backend valida JWT → ejecuta operación → responde → frontend actualiza UI.  

---

## Autenticación
- **JWT**: Generado en login, expira en 8h.  
- **Almacenamiento**: localStorage (token + usuario).  
- **Protección**: Endpoints POST, PUT, DELETE requieren autenticación.  

---

## Estructura de Datos
Tablas principales en MySQL:  
- Usuarios  
- Sitios  
- Salas  
- Racks  
- Fabricantes  
- Modelos  
- Dispositivos  
- Ocupación de racks  

Cada tabla incluye claves primarias, foráneas y campos relevantes para gestión de inventario.  

---

## Tecnologías Utilizadas
**Backend**: Node.js, Express, MySQL, JWT, bcrypt, dotenv, cors.  
**Frontend**: React, React Router, Vite, CSS.  

---

## Notas Finales
- **Seguridad**: Endpoints de escritura protegidos, contraseñas hasheadas.  
- **Escalabilidad**: Pool de conexiones, arquitectura modular.  
- **Desarrollo**: `npm run dev` en backend y frontend con recarga automática.  
