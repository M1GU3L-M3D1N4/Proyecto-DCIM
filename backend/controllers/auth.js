const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const repository = require('../db/repository');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Se requiere email y password' });
    }

    const user = await repository.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.active) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        active: Boolean(user.active),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error en login', details: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await repository.getUserById(req.user.user_id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    return res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      active: Boolean(user.active),
      created_at: user.created_at,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener perfil', details: error.message });
  }
};
