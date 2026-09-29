// Router de Express para racks, sus detalles y su reporte PDF.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/racks');
// Las operaciones de escritura requieren autenticación.
const { authenticate } = require('../middlewares/auth');

// Consultas públicas del listado, detalle y reporte descargable.
router.get('/', controller.list);
// Esta ruta debe declararse antes de /:id para que "pdf" no se interprete como un ID.
router.get('/:id/pdf', controller.exportPdf);
router.get('/:id', controller.getById);
// Crear, actualizar y eliminar racks modifica la capacidad física registrada.
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

// server.js monta este router bajo el prefijo /api/racks.
module.exports = router;
