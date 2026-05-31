/**
 * Simple data store para desarrollo.
 * - Lee `backend/data/mockData.json` de forma síncrona al arrancar.
 * - Exponemos helpers mínimos para que los controladores puedan
 *   obtener listas y elementos por id.
 */
const path = require('path');
const fs = require('fs');

// Ruta al JSON con datos de ejemplo.
const dataPath = path.join(__dirname, '..', 'data', 'mockData.json');
let store = {};
try {
  store = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (err) {
  // Fallar aquí solo emite una advertencia y dejamos el store vacío.
  console.warn('dataStore: no se pudo leer mockData.json:', err.message);
  store = {};
}

// Helpers de acceso a datos. Cada función devuelve valores seguros
// aunque el store no esté inicializado correctamente.

/** Devuelve array de sites o array vacío. */
exports.getSites = () => store.sites || [];

/** Busca un site por su `site_id`. */
exports.getSiteById = (id) => (store.sites || []).find((s) => String(s.site_id) === String(id));

/** Devuelve array de racks o array vacío. */
exports.getRacks = () => store.racks || [];

/** Busca un rack por su `rack_id`. */
exports.getRackById = (id) => (store.racks || []).find((r) => String(r.rack_id) === String(id));

/**
 * Devuelve dispositivos aplicando filtros opcionales.
 * - `filters.rack_id`, `filters.model_id`, `filters.status` son soportados.
 */
exports.getDevices = (filters = {}) => {
  let items = store.devices || [];
  if (filters.rack_id) items = items.filter((d) => String(d.rack_id) === String(filters.rack_id));
  if (filters.model_id) items = items.filter((d) => String(d.model_id) === String(filters.model_id));
  if (filters.status) items = items.filter((d) => String(d.status) === String(filters.status));
  return items;
};

/** Busca un dispositivo por su `device_id`. */
exports.getDeviceById = (id) => (store.devices || []).find((d) => String(d.device_id) === String(id));
