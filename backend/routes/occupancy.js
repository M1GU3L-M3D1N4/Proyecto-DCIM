// Router para consultar y modificar la ocupación por unidad U de los racks.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/occupancy');
// Registrar o liberar unidades modifica la ubicación física del inventario.
const { authenticate } = require('../middlewares/auth');

// GET permite consultar toda la ocupación o la de un rack específico.
router.get('/', controller.list);
router.get('/rack/:rackId', controller.getByRack);
// POST registra una unidad ocupada y DELETE libera una unidad concreta.
router.post('/', authenticate, controller.create);
router.delete('/rack/:rackId/unit/:unit', authenticate, controller.delete);

// server.js monta este router bajo el prefijo /api/occupancy.
module.exports = router;
