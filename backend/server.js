// Backend DCIM con soporte MySQL
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const repository = require('./db/repository');

const app = express();

// Middlewares básicos:
// - `cors()` permite peticiones cross-origin desde el frontend local.
// - `express.json()` parsea el cuerpo de las peticiones con JSON.
app.use(cors());
app.use(express.json());

// Health-check: incluye estado de MySQL
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await repository.testConnection();
    return res.json({
      status: 'ok',
      database: dbStatus.success ? 'connected' : 'disconnected',
      message: dbStatus.message,
    });
  } catch (error) {
    return res.json({
      status: 'ok',
      database: 'disconnected',
      message: error.message,
    });
  }
});

// Montar routers modulares
const authRouter = require('./routes/auth');
const sitesRouter = require('./routes/sites');
const racksRouter = require('./routes/racks');
const devicesRouter = require('./routes/devices');
const vendorsRouter = require('./routes/vendors');
const modelsRouter = require('./routes/models');
const roomsRouter = require('./routes/rooms');
const occupancyRouter = require('./routes/occupancy');

app.use('/api/auth', authRouter);
app.use('/api/sites', sitesRouter);
app.use('/api/racks', racksRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/occupancy', occupancyRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
  
  // Probar conexión a MySQL
  try {
    const dbStatus = await repository.testConnection();
    if (dbStatus.success) {
      console.log('✓ Conectado a MySQL');
    } else {
      console.warn('⚠ No se puede conectar a MySQL:', dbStatus.message);
      console.warn('  Las APIs usarán datos mock si la BD no está disponible');
    }
  } catch (error) {
    console.warn('⚠ Error al verificar conexión MySQL:', error.message);
  }
});