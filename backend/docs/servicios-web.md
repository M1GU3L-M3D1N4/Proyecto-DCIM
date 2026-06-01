# Documentación de servicios web - Proyecto DCIM

Esta documentación reúne los servicios web que se dejaron listos en el backend del proyecto. La idea fue tener algo sencillo, entendible y fácil de probar en Postman mientras el sistema sigue creciendo.

## Propósito general

El backend expone endpoints REST para consultar información básica del DCIM, validar acceso y revisar datos simulados desde un archivo JSON. Por ahora no hay conexión a base de datos real; todo sale de datos mock para poder probar el comportamiento de cada servicio sin complicar la entrega.

## Cómo ejecutar el backend

Dentro de la carpeta `backend` se puede iniciar así:

```bash
npm install
npm run start
```

Si se quiere usar el modo de desarrollo con recarga automática:

```bash
npm run dev
```

El servidor queda disponible en:

```text
http://localhost:3000
```

## Servicios disponibles

### 1. Health check

- Método: `GET`
- Ruta: `/api/health`
- Qué hace: confirma que el servidor está activo.
- Respuesta esperada:

```json
{
  "status": "ok"
}
```

### 2. Login simulado

- Método: `POST`
- Ruta: `/api/auth/login`
- Qué hace: valida credenciales contra el usuario guardado en el mock.
- Body de ejemplo:

```json
{
  "email": "admin@dcim.com",
  "password": "admin123"
}
```

- Respuestas posibles:
  - `200`: credenciales correctas, devuelve usuario y token falso.
  - `400`: faltan campos obligatorios.
  - `401`: credenciales inválidas.

Ejemplo de respuesta correcta:

```json
{
  "user": {
    "email": "admin@dcim.com",
    "name": "Administrador DCIM",
    "role": "admin"
  },
  "token": "fake-jwt-token-1234567890"
}
```

### 3. Sitios

#### Listar sitios

- Método: `GET`
- Ruta: `/api/sites`
- Qué devuelve: lista completa de sitios guardados en el mock.
- Respuesta: array de objetos con información del sitio.

#### Consultar sitio por id

- Método: `GET`
- Ruta: `/api/sites/:id`
- Qué devuelve: un sitio específico por su identificador.
- Respuesta: objeto del sitio o `404` si no existe.

### 4. Racks

#### Listar racks

- Método: `GET`
- Ruta: `/api/racks`
- Qué devuelve: listado de racks.
- Filtro opcional: `room_id`

Ejemplo:

```text
/api/racks?room_id=1
```

#### Consultar rack por id

- Método: `GET`
- Ruta: `/api/racks/:id`
- Qué devuelve: detalle de un rack o `404` si no existe.

### 5. Dispositivos

#### Listar dispositivos

- Método: `GET`
- Ruta: `/api/devices`
- Qué devuelve: listado de dispositivos.
- Filtros opcionales:
  - `rack_id`
  - `model_id`
  - `status`

Ejemplo:

```text
/api/devices?status=active
```

#### Consultar dispositivo por id

- Método: `GET`
- Ruta: `/api/devices/:id`
- Qué devuelve: detalle de un dispositivo o `404` si no existe.

## Servicios pendientes

Estos endpoints todavía están como placeholder y responden `501 Not Implemented`:

- `GET /api/vendors`
- `GET /api/vendors/:id`
- `GET /api/models`
- `GET /api/models/:id`
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `GET /api/occupancy`
- `GET /api/occupancy/rack/:rackId`

## Archivos de referencia

- [backend/server.js](../server.js)
- [backend/data/mockData.json](../data/mockData.json)
- [backend/routes/sites.js](../routes/sites.js)
- [backend/routes/racks.js](../routes/racks.js)
- [backend/routes/devices.js](../routes/devices.js)
