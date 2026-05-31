// Rutas para `device_models` - endpoints para modelos de dispositivos.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/models');

/*
	Rutas `device_models`

	Propósito: listar modelos de dispositivos. Campos: model_id, vendor_id,
	model_name, device_type, u_height.
*/

router.get('/', controller.list);
router.get('/:id', controller.getById);

module.exports = router;
