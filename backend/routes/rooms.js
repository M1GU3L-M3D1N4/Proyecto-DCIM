// Rutas para `rooms` - gestión de salas dentro de sites.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/rooms');
const { authenticate } = require('../middlewares/auth');

/*
	Rutas `rooms`

	Propósito: gestionar espacios físicos dentro de un `site`. Campos: room_id,
	site_id, name, floor.
*/

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

module.exports = router;
