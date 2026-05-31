Estructura del backend (modular)

Carpetas:
- `routes/`     => define rutas Express por recurso (sites, racks, devices)
- `controllers/`=> lógica y handlers por recurso
- `data/`       => archivos JSON de prueba (mockData.json)
- `utils/`      => utilidades, middlewares
- `docs/`       => documentación de la API (api.md)

Estado actual: solo estructura esqueleto creada. No hay lógica implementada en routes o controllers.

Siguientes pasos sugeridos (tras autorización):
1. Implementar controladores y rutas.
2. Añadir tests y colección Postman.
3. Documentar endpoints en `docs/api.md`.
