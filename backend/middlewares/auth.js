/**
 * ARCHIVO: middlewares/auth.js
 * 
 * Middleware de autenticación para proteger rutas privadas.
 * 
 * Función: 
 * - Extrae y valida el JWT (JSON Web Token) del encabezado Authorization
 * - Si el token es válido, lo decodifica y lo adjunta a req.user
 * - Si no hay token o es inválido, retorna error 401 (No autorizado)
 * 
 * Uso:
 * router.put('/api/sites/:id', authenticate, controller.update);
 *     ^- Este middleware solo permite que usuarios autenticados actualicen sitios
 */

const jwt = require('jsonwebtoken'); // Librería para JWT

/**
 * FUNCIÓN: authenticate
 * 
 * Middleware que valida la autenticación del usuario.
 * 
 * Parámetros:
 * - req: Objeto de solicitud HTTP
 * - res: Objeto de respuesta HTTP
 * - next: Función para pasar al siguiente middleware
 * 
 * Retorna:
 * - Si es válido: llama next() para continuar
 * - Si falla: retorna JSON con error 401
 */
exports.authenticate = (req, res, next) => {
  // Obtener encabezado Authorization (ej: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
  const authHeader = req.headers.authorization || '';
  
  // Extraer token si comienza con "Bearer "
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  // Si no hay token, rechazar solicitud
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    // Verificar y decodificar el JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    
    // Adjuntar datos del usuario decodificados a la solicitud
    req.user = payload; // Ahora req.user contiene { user_id, username, email, full_name }
    
    // Pasar al siguiente middleware o controlador
    return next();
  } catch (error) {
    // Token inválido o expirado
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
