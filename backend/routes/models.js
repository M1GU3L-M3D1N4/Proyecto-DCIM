// Rutas para `device_models` - endpoints para modelos de dispositivos.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/models');
const { authenticate } = require('../middlewares/auth');

/*
	Rutas `device_models`

	Propósito: listar modelos de dispositivos. Campos: model_id, vendor_id,
	model_name, device_type, u_height.
*/

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

module.exports = router;
