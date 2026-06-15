const dataStore = require('../utils/dataStore');

exports.list = (req, res) => {
  const { vendor_id } = req.query;
  let models = dataStore.getModels();
  if (vendor_id) models = models.filter((model) => String(model.vendor_id) === String(vendor_id));

  const response = models.map((model) => {
    const vendor = dataStore.getVendorById(model.vendor_id);
    const devices_count = dataStore.getDevices({ model_id: model.model_id }).length;
    return {
      ...model,
      vendor_name: vendor?.name ?? 'Sin fabricante',
      devices_count,
    };
  });

  return res.json(response);
};

exports.getById = (req, res) => {
  const model = dataStore.getModelById(req.params.id);
  if (!model) return res.status(404).json({ error: 'Model not found' });

  const vendor = dataStore.getVendorById(model.vendor_id);
  const devices_count = dataStore.getDevices({ model_id: model.model_id }).length;

  return res.json({
    ...model,
    vendor_name: vendor?.name ?? 'Sin fabricante',
    devices_count,
  });
};
