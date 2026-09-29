// Router de Express para el catálogo de modelos de dispositivos.
const express = require('express');
const router = express.Router();
// Separa el enrutamiento de la lógica implementada en el controlador.
const controller = require('../controllers/models');
// Solo las operaciones de escritura necesitan autenticación.
const { authenticate } = require('../middlewares/auth');

// Las consultas GET son públicas para permitir cargar el catálogo en la interfaz.

router.get('/', controller.list);
router.get('/:id', controller.getById);
// Crear, actualizar y eliminar modelos requiere un usuario autenticado.
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

// server.js monta este router bajo el prefijo /api/models.
module.exports = router;
