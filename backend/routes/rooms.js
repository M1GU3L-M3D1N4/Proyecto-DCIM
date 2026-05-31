// Rutas para `rooms` - gestión de salas dentro de sites.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/rooms');

/*
	Rutas `rooms`

	Propósito: gestionar espacios físicos dentro de un `site`. Campos: room_id,
	site_id, name, floor.
*/

router.get('/', controller.list);
router.get('/:id', controller.getById);

module.exports = router;
