/**
 * Controladores para `vendors`.
 * Actualmente funcionan como placeholders hasta implementar la lógica.
 */

/**
 * list(req, res)
 * - Respuesta: [{ vendor_id, name, support_url }, ...]
 */
exports.list = (req, res) => {
  res.status(501).json({ error: 'Not implemented: list vendors' });
};

/**
 * getById(req, res)
 * - Params: `id` (vendor_id)
 */
exports.getById = (req, res) => {
  res.status(501).json({ error: 'Not implemented: get vendor by id' });
};
