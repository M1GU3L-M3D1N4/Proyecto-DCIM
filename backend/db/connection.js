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

const mysql = require('mysql2/promise'); // Importar mysql2 con soporte para promesas
require('dotenv').config(); // Cargar variables de entorno

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Host de la BD desde variable de entorno
  port: process.env.DB_PORT || 3306, // Puerto de la BD
  user: process.env.DB_USER || 'root', // Usuario de MySQL
  password: process.env.DB_PASSWORD || '', // Contraseña de MySQL
  database: process.env.DB_NAME || 'dcim', // Nombre de la base de datos
  waitForConnections: true, // Esperar si no hay conexiones disponibles
  connectionLimit: 10, // Máximo número de conexiones en el pool
  queueLimit: 0, // Cola ilimitada para esperar conexiones
});

module.exports = pool; // Exportar el pool para usarlo en repository.js
