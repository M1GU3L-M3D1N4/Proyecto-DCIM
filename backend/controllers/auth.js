/**
 * ARCHIVO: controllers/auth.js
 * 
 * Controlador de autenticación.
 * 
 * Gestiona:
 * - Validación de credenciales (email y contraseña)
 * - Generación de tokens JWT
 * - Obtención de datos del usuario autenticado
 * 
 * Dependencias:
 * - bcrypt: Hash seguro de contraseñas
 * - jsonwebtoken: Generación de JWT
 * - repository: Acceso a datos de usuario en MySQL
 */

const bcrypt = require('bcrypt'); // Para comparar contraseñas hasheadas
const jwt = require('jsonwebtoken'); // Para crear tokens JWT
const repository = require('../db/repository'); // Para acceder a la base de datos

/**
 * FUNCIÓN: login
 * 
 * Endpoint POST /api/auth/login
 * 
 * Autentica un usuario validando email y contraseña.
 * 
 * Parámetros esperados en req.body:
 * - email: Correo electrónico del usuario
 * - password: Contraseña en texto plano
 * 
 * Validaciones:
 * 1. Email y password son requeridos
 * 2. Usuario existe en la BD
 * 3. Usuario está activo
 * 4. Contraseña coincide con el hash almacenado
 * 
 * Retorna:
 * - Si es exitoso: { token: JWT, user: { user_id, username, email, full_name, active } }
 * - Si falla: { error: "Credenciales inválidas" } con status 401
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validar que email y password estén presentes
    if (!email || !password) {
      return res.status(400).json({ error: 'Se requiere email y password' });
    }

    // Buscar usuario por email en la BD
    const user = await repository.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar que el usuario esté activo
    if (!user.active) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    // Comparar contraseña ingresada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT con datos del usuario
    const token = jwt.sign(
      {
        user_id: user.user_id, // ID único del usuario
        username: user.username, // Nombre de usuario
        email: user.email, // Email
        full_name: user.full_name, // Nombre completo
      },
      process.env.JWT_SECRET || 'dev-secret-key', // Clave secreta para firmar el token
      { expiresIn: '8h' } // El token expira en 8 horas
    );

    // Retornar token y datos del usuario
    return res.json({
      token, // JWT para incluir en futuras solicitudes
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        active: Boolean(user.active), // Convertir a booleano
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error en login', details: error.message });
  }
};

/**
 * FUNCIÓN: me
 * 
 * Endpoint GET /api/auth/me
 * 
 * Obtiene los datos del usuario autenticado actualmente.
 * Este endpoint está protegido por el middleware authenticate.
 * 
 * Retorna:
 * - { user_id, username, email, full_name, active, created_at }
 * - Si el usuario no existe: { error: "Usuario no encontrado" } con status 404
 */
exports.me = async (req, res) => {
  try {
    // req.user viene del middleware authenticate, contiene datos decodificados del JWT
    const user = await repository.getUserById(req.user.user_id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    return res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      active: Boolean(user.active),
      created_at: user.created_at, // Fecha de creación del usuario
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener perfil', details: error.message });
  }
};
