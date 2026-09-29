// Router de Express para agrupar los endpoints de autenticación.
const express = require('express');
const router = express.Router();
// El controlador contiene la lógica; esta capa solo define el verbo y la ruta.
const controller = require('../controllers/auth');
// Protege los endpoints que requieren un token JWT válido.
const { authenticate } = require('../middlewares/auth');

// Inicio de sesión: público porque todavía no existe un token.
router.post('/login', controller.login);
// Perfil actual: solo accesible para usuarios autenticados.
router.get('/me', authenticate, controller.me);

// server.js monta este router bajo el prefijo /api/auth.
module.exports = router;
