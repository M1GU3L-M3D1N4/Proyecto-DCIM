/**
 * ARCHIVO: db/connection.js
 * 
 * Gestión de la conexión a MySQL con mysql2/promise.
 * 
 * Este archivo crea un pool de conexiones (conexiones reutilizables) 
 * que permite que múltiples procesos accedan a MySQL sin crear una 
 * nueva conexión cada vez (más eficiente).
 * 
 * Configuración:
 * - host: Servidor MySQL (por defecto 'localhost')
 * - port: Puerto MySQL (por defecto 3306)
 * - user: Usuario de MySQL (por defecto 'root')
 * - password: Contraseña de MySQL (vacío por defecto)
 * - database: Base de datos (por defecto 'dcim')
 * - connectionLimit: Máximo 10 conexiones simultáneas
 * - queueLimit: Cola ilimitada de espera
 */

// mysql2/promise permite usar await en todas las consultas a la base de datos.
const mysql = require('mysql2/promise');
// Cargar la configuración local desde las variables definidas en el archivo .env.
require('dotenv').config();

// El pool reutiliza conexiones y limita cuántas operaciones simultáneas llegan a MySQL.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dcim',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// El repositorio importa este único pool para todas las operaciones del backend.
module.exports = pool;
