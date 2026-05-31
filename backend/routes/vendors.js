// Rutas para `vendors` - catálogo de proveedores.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendors');

/*
	Rutas `vendors`

	Propósito: exponer catálogo de proveedores (vendors). Cada vendor tiene
	`vendor_id`, `name` y `support_url`.
*/

router.get('/', controller.list);
router.get('/:id', controller.getById);

module.exports = router;
