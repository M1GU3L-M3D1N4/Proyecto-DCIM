/**
 * Controladores para `rooms`.
 * Por ahora son placeholders que devuelven 501 para indicar que
 * la implementación pendiente está en progreso.
 */

/**
 * list(req, res)
 * - Query params: `site_id` (opcional)
 * - Respuesta: [{ room_id, site_id, name, floor }, ...]
 */
exports.list = (req, res) => {
  res.status(501).json({ error: 'Not implemented: list rooms' });
};

/**
 * getById(req, res)
 * - Params: `id` (room_id)
 */
exports.getById = (req, res) => {
  res.status(501).json({ error: 'Not implemented: get room by id' });
};
