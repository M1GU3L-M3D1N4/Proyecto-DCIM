// Controladores para sites
// Devuelven datos desde el mock para pruebas en Postman.
const dataStore = require('../utils/dataStore');

// list: devuelve todos los sitios. En el futuro se añadirán filtros.
exports.list = (req, res) => {
	const sites = dataStore.getSites().map((site) => dataStore.getSiteSummary(site));
	return res.json(sites);
};

// getById: devuelve un sitio por su `site_id`.
exports.getById = (req, res) => {
	const id = req.params.id;
	const site = dataStore.getSiteById(id);
	if (!site) return res.status(404).json({ error: 'Site not found' });
	return res.json(dataStore.getSiteSummary(site));
};
