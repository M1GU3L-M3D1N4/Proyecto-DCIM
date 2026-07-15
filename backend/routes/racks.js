// Rutas para `racks` - listados y detalles de racks.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/racks');
const { authenticate } = require('../middlewares/auth');

/*
	Rutas `racks`

	Propósito: obtener listados y detalles de racks. En el modelo relacional
	un `rack` pertenece a una `room` y tiene `total_u` (altura en U).

	Ejemplos de respuesta esperada cuando se implemente:
	- GET /api/racks -> [{ rack_id, room_id, code, total_u }, ...]
	- GET /api/racks/:id -> { rack_id, room_id, code, total_u }
*/

router.get('/', controller.list);
router.get('/:id/pdf', controller.exportPdf);
router.get('/:id', controller.getById);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

module.exports = router;
