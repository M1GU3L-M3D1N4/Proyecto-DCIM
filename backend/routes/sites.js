// Rutas para `sites` - endpoints para consultar sitios del datacenter.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/sites');

/*
	Rutas `sites`

	Propósito: exponer endpoints para consultar sitios del datacenter.
	Notas:
	- Actualmente los controladores devuelven 501 (placeholders).
	- Cuando se implemente la lógica, estos endpoints deben devolver JSON
		con las estructuras definidas en `backend/data/mockData.json`.

	Ejemplos:
	- GET /api/sites         -> [{ site_id, name, city, address }, ...]
	- GET /api/sites/:id     -> { site_id, name, city, address }
*/

// Lista de sitios
router.get('/', controller.list);

// Detalle de sitio
router.get('/:id', controller.getById);

module.exports = router;
