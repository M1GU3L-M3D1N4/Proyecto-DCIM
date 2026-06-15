/**
 * Controladores para `devices`.
 * Exponen funciones que el router utiliza para responder a peticiones.
 */
const dataStore = require('../utils/dataStore');

/**
 * list(req, res)
 * - Query params admitidos: `rack_id`, `model_id`, `status`.
 * - Devuelve un array de dispositivos filtrado según los parámetros.
 */
exports.list = (req, res) => {
	const { rack_id, model_id, status } = req.query;
	const filters = {};
	if (rack_id) filters.rack_id = rack_id;
	if (model_id) filters.model_id = model_id;
	if (status) filters.status = status;
	const devices = dataStore.getDevices(filters).map((device) => dataStore.getDeviceSummary(device));
	// Respuesta directa con el array de dispositivos.
	return res.json(devices);
};

/**
 * getById(req, res)
 * - Params: `id` (device_id)
 * - Responde con 404 si no existe el dispositivo.
 */
exports.getById = (req, res) => {
	const id = req.params.id;
	const device = dataStore.getDeviceById(id);
	if (!device) return res.status(404).json({ error: 'Device not found' });
	return res.json(dataStore.getDeviceSummary(device));
};
