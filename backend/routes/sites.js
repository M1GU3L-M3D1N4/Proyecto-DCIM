// Router de Express para los sitios físicos del datacenter.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/sites');
// Las modificaciones del catálogo requieren autenticación.
const { authenticate } = require('../middlewares/auth');

// Consultas públicas del listado y detalle de sitios.
router.get('/', controller.list);
router.get('/:id', controller.getById);
// Crear, actualizar y eliminar sitios requiere autenticación.
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

// server.js monta este router bajo el prefijo /api/sites.
module.exports = router;
