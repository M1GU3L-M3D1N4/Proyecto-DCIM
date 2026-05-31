/**
 * Controladores para `rack_unit_occupancy`.
 * Endpoints relacionados con la ocupación por unidad (U) en racks.
 * Por ahora son placeholders que devuelven 501.
 */

/**
 * list(req, res)
 * - Query params: `rack_id` (opcional)
 * - Respuesta: [{ rack_id, unit, device_id }, ...]
 */
exports.list = (req, res) => {
  res.status(501).json({ error: 'Not implemented: list occupancy' });
};

/**
 * getByRack(req, res)
 * - Params: `rackId` (identificador de rack)
 * - Respuesta: array de ocupación para ese rack
 */
exports.getByRack = (req, res) => {
  res.status(501).json({ error: 'Not implemented: get occupancy by rack' });
};
