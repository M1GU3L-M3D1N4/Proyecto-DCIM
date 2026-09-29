// Router de Express para las salas físicas de cada sitio.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/rooms');
// Protege las operaciones que cambian la estructura física.
const { authenticate } = require('../middlewares/auth');

// GET permite consultar salas y su estado operativo.
router.get('/', controller.list);
router.get('/:id', controller.getById);
// POST, PUT y DELETE requieren autenticación.
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

// server.js monta este router bajo el prefijo /api/rooms.
module.exports = router;
