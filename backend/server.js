/**
 * ARCHIVO: server.js
 * 
 * Punto de entrada del servidor backend del DCIM (Data Center Infrastructure Management).
 * Este archivo inicializa Express, configura middlewares globales y monta los routers modulares
 * para gestionar sitios, racks, dispositivos, etc.
 * 
 * Dependencias principales:
 * - express: framework web para Node.js
 * - cors: middleware para permitir peticiones cross-origin
 * - dotenv: carga variables de entorno del archivo .env
 * - mysql2/promise: cliente MySQL con promesas para conexiones a base de datos
 */

require('dotenv').config(); // Cargar variables de entorno (.env)

const express = require('express');
const cors = require('cors');
const repository = require('./db/repository');

const app = express(); // Crear instancia de aplicación Express

/**
 * MIDDLEWARES GLOBALES
 * 
 * cors() - Permite solicitudes desde diferentes orígenes (frontend local)
 * express.json() - Parsea automáticamente cuerpos JSON en las solicitudes
 */
app.use(cors());
app.use(express.json());

/**
 * HEALTH CHECK ENDPOINT
 * 
 * GET /api/health
 * 
 * Verifica el estado del servidor y la disponibilidad de la base de datos.
 * Retorna:
 * - status: "ok" si el servidor está operativo
 * - database: "connected" o "disconnected" según disponibilidad de MySQL
 * - message: descripción del estado de la conexión
 * 
 * Este endpoint se usa para monitoreo y verificación de salud del sistema.
 */
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await repository.testConnection(); // Probar conexión a MySQL
    return res.json({
      status: 'ok', // Estado del servidor
      database: dbStatus.success ? 'connected' : 'disconnected', // Estado de BD
      message: dbStatus.message, // Mensaje descriptivo
    });
  } catch (error) {
    return res.json({
      status: 'ok',
      database: 'disconnected',
      message: error.message,
    });
  }
});

/**
 * ROUTERS MODULARES
 * 
 * Cada router gestiona un aspecto diferente del DCIM:
 * - authRouter: Autenticación y gestión de sesiones (login, perfil)
 * - sitesRouter: Gestión de sitios/datacenters
 * - racksRouter: Gestión de racks individuales
 * - devicesRouter: Gestión de dispositivos/equipos
 * - vendorsRouter: Catálogo de fabricantes
 * - modelsRouter: Catálogo de modelos de dispositivos
 * - roomsRouter: Gestión de salas dentro de sitios
 * - occupancyRouter: Ocupación de unidades (U) en racks
 * 
 * Cada ruta se prefija con `/api/{recurso}` para claridad y versionado.
 */
const authRouter = require('./routes/auth');
const sitesRouter = require('./routes/sites');
const racksRouter = require('./routes/racks');
const devicesRouter = require('./routes/devices');
const vendorsRouter = require('./routes/vendors');
const modelsRouter = require('./routes/models');
const roomsRouter = require('./routes/rooms');
const occupancyRouter = require('./routes/occupancy');

// Montar routers en sus rutas correspondientes
app.use('/api/auth', authRouter); // Endpoints de autenticación
app.use('/api/sites', sitesRouter); // CRUD de sitios
app.use('/api/racks', racksRouter); // CRUD de racks
app.use('/api/devices', devicesRouter); // CRUD de dispositivos
app.use('/api/vendors', vendorsRouter); // Catálogo de proveedores
app.use('/api/models', modelsRouter); // Catálogo de modelos
app.use('/api/rooms', roomsRouter); // CRUD de salas
app.use('/api/occupancy', occupancyRouter); // Ocupación por unidad (U)

// Puerto en el que se ejecuta el servidor (por defecto 3000)
const PORT = process.env.PORT || 3000;

/**
 * INICIALIZACIÓN DEL SERVIDOR
 * 
 * Inicia el servidor Express en el puerto configurado y verifica
 * la conexión a la base de datos MySQL para confirmar que el sistema
 * está completamente operativo.
 */
app.listen(PORT, async () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
  
  // Verificar conexión a MySQL al iniciar
  try {
    const dbStatus = await repository.testConnection();
    if (dbStatus.success) {
      console.log('✓ Conectado a MySQL'); // La base de datos está disponible
    } else {
      // Si MySQL no está disponible, el sistema puede funcionar con datos mock
      console.warn('⚠ No se puede conectar a MySQL:', dbStatus.message);
      console.warn('  Las APIs usarán datos mock si la BD no está disponible');
    }
  } catch (error) {
    console.warn('⚠ Error al verificar conexión MySQL:', error.message);
  }
});