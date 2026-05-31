/**
 * Controladores para `sites`.
 * Leen datos desde el mock store para facilitar pruebas con Postman
 * y el frontend en desarrollo.
 */
const dataStore = require('../utils/dataStore');

/**
 * list(req, res)
 * - Devuelve todos los sitios disponibles en el mock.
 */
exports.list = (req, res) => {
  const sites = dataStore.getSites();
  return res.json(sites);
};

/**
 * getById(req, res)
 * - Params: `id` (site_id)
 * - Responde 404 si no existe el sitio.
 */
exports.getById = (req, res) => {
  const id = req.params.id;
  const site = dataStore.getSiteById(id);
  if (!site) return res.status(404).json({ error: 'Site not found' });
  return res.json(site);
};
