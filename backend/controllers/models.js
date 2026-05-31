/**
 * Controladores para `device_models`.
 * Actualmente son placeholders que devuelven 501 hasta implementar
 * la lógica real contra una fuente de datos.
 */

/**
 * list(req, res)
 * - Query params: `vendor_id` (opcional)
 * - Respuesta: [{ model_id, vendor_id, model_name, device_type, u_height }, ...]
 */
exports.list = (req, res) => {
  // Implementar filtrado y recuperación real de datos cuando se conecte
  // a la base de datos o al servicio correspondiente.
  res.status(501).json({ error: 'Not implemented: list models' });
};

/**
 * getById(req, res)
 * - Params: `id` (model_id)
 */
exports.getById = (req, res) => {
  res.status(501).json({ error: 'Not implemented: get model by id' });
};
