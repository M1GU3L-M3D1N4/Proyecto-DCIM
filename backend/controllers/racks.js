/**
 * Controladores para `racks`.
 * Permiten obtener listados y detalles de racks desde el mock store.
 */
const dataStore = require('../utils/dataStore');

/**
 * list(req, res)
 * - Query params: `room_id` (opcional) para filtrar por sala.
 * - Responde con un array de racks (posiblemente vacío).
 */
exports.list = (req, res) => {
  const { room_id } = req.query;
  let racks = dataStore.getRacks();
  if (room_id) racks = racks.filter((r) => String(r.room_id) === String(room_id));
  return res.json(racks.map((rack) => dataStore.getRackSummary(rack)));
};

/**
 * getById(req, res)
 * - Params: `id` (rack_id)
 * - Responde 404 si no existe el rack.
 */
exports.getById = (req, res) => {
  const id = req.params.id;
  const rack = dataStore.getRackById(id);
  if (!rack) return res.status(404).json({ error: 'Rack not found' });
  return res.json(dataStore.getRackSummary(rack));
};
