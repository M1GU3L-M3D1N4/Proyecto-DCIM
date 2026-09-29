// Router de Express para el catálogo de fabricantes.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendors');
// Solo las operaciones de escritura requieren autenticación.
const { authenticate } = require('../middlewares/auth');

// GET expone el catálogo y el detalle de un fabricante.
router.get('/', controller.list);
router.get('/:id', controller.getById);
// POST, PUT y DELETE mantienen el catálogo protegido.
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

// server.js monta este router bajo el prefijo /api/vendors.
module.exports = router;
