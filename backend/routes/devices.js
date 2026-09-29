// Router de Express para los endpoints de dispositivos.
const express = require('express');
const router = express.Router();
// Los controladores contienen la lógica de negocio y acceso al repositorio.
const controller = require('../controllers/devices');
// Las operaciones que modifican inventario requieren autenticación.
const { authenticate } = require('../middlewares/auth');

// GET públicos para consultar el inventario; list admite filtros por rack, modelo y estado.

router.get('/', controller.list);
router.get('/:id', controller.getById);
// POST, PUT y DELETE están protegidos porque cambian el inventario.
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

// server.js monta este router bajo el prefijo /api/devices.
module.exports = router;
