// Backend minimal para desarrollo y pruebas.
// Proposito: exponer endpoints REST simples basados en datos mock
// definidos en `backend/data/mockData.json`. No es una API
// de producción; sirve para que el frontend y Postman puedan
// consumir respuestas realistas durante el desarrollo.

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middlewares básicos:
// - `cors()` permite peticiones cross-origin desde el frontend local.
// - `express.json()` parsea el cuerpo de las peticiones con JSON.
app.use(cors());
app.use(express.json());

// Cargar mock data (desarrollo)
const dataPath = path.join(__dirname, 'data', 'mockData.json');
let mockData = {};
try {
  mockData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (err) {
  console.warn('No se encontró backend/data/mockData.json o es inválido.');
  mockData = {};
}

// Health-check sencillo. Útil para comprobar que el servidor responde.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Endpoint de login (mock)
// Endpoint de login (mock).
// - Lee `mockData.user` y compara credenciales en texto plano.
// - Devuelve un token falso y datos básicos del usuario si coincide.
// NOTA: esto es solo para desarrollo; no usar en producción.
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Se requiere email y password' });
  const user = mockData.user;
  if (user && email === user.email && password === user.password) {
    const token = 'fake-jwt-token-' + Date.now();
    return res.json({ user: { email: user.email, name: user.name, role: user.role }, token });
  }
  return res.status(401).json({ error: 'Credenciales inválidas' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});

// Montar routers modulares.
// Cada router agrupa endpoints relacionados en `/api/<recurso>`.
// El orden de montaje no es crítico aquí, pero mantenerlo organizado
// por dominio (sites, racks, devices...) ayuda a la lectura.
const sitesRouter = require('./routes/sites');
const racksRouter = require('./routes/racks');
const devicesRouter = require('./routes/devices');
const vendorsRouter = require('./routes/vendors');
const modelsRouter = require('./routes/models');
const roomsRouter = require('./routes/rooms');
const occupancyRouter = require('./routes/occupancy');

// Montaje de rutas. Cuando un router todavía devuelve 501, significa
// que el controlador es un placeholder y debe implementarse.
app.use('/api/sites', sitesRouter);
app.use('/api/racks', racksRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/occupancy', occupancyRouter);