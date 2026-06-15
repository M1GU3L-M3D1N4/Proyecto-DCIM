const dataStore = require('../utils/dataStore');

exports.list = (req, res) => {
  const vendors = dataStore.getVendors().map((vendor) => {
    const models = dataStore.getModels().filter((model) => String(model.vendor_id) === String(vendor.vendor_id));
    const devicesCount = models.reduce((count, model) => count + dataStore.getDevices({ model_id: model.model_id }).length, 0);

    return {
      ...vendor,
      models_count: models.length,
      devices_count: devicesCount,
    };
  });

  return res.json(vendors);
};

exports.getById = (req, res) => {
  const vendor = dataStore.getVendorById(req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

  const models = dataStore.getModels().filter((model) => String(model.vendor_id) === String(vendor.vendor_id));
  const devicesCount = models.reduce((count, model) => count + dataStore.getDevices({ model_id: model.model_id }).length, 0);

  return res.json({
    ...vendor,
    models_count: models.length,
    devices_count: devicesCount,
  });
};
