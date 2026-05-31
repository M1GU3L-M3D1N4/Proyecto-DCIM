// Rutas para `racks` - listados y detalles de racks.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/racks');

/*
	Rutas `racks`

	Propósito: obtener listados y detalles de racks. En el modelo relacional
	un `rack` pertenece a una `room` y tiene `total_u` (altura en U).

	Ejemplos de respuesta esperada cuando se implemente:
	- GET /api/racks -> [{ rack_id, room_id, code, total_u }, ...]
	- GET /api/racks/:id -> { rack_id, room_id, code, total_u }
*/

router.get('/', controller.list);
router.get('/:id', controller.getById);

module.exports = router;
