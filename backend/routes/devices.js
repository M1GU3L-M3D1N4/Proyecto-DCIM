// Rutas para `devices` - agrupan endpoints relacionados con dispositivos.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/devices');

/*
	Rutas `devices`

	Propósito: listar y obtener detalles de dispositivos. Un `device` está
	asociado a un `device_model` y opcionalmente a un `rack`.

	Campos comunes en las respuestas:
	- device_id, model_id, name, asset_tag, serial_number, rack_id, u_start, status, installed_at

	Filtros sugeridos (cuando se implemente): `rack_id`, `model_id`, `status`.
*/

router.get('/', controller.list);
router.get('/:id', controller.getById);

module.exports = router;
