const repository = require('../db/repository');

// GET /api/vendors
exports.list = async (req, res) => {
  try {
    const vendors = await repository.getVendors();
    
    const vendorsWithData = await Promise.all(
      vendors.map(async (vendor) => {
        const models = await repository.getModels();
        const vendorModels = models.filter((m) => m.vendor_id === vendor.vendor_id);
        
        const devicesCount = (await Promise.all(
          vendorModels.map(async (model) => {
            const devices = await repository.getDevices({ model_id: model.model_id });
            return devices.length;
          })
        )).reduce((a, b) => a + b, 0);
        
        return {
          ...vendor,
          models_count: vendorModels.length,
          devices_count: devicesCount,
        };
      })
    );
    
    return res.json(vendorsWithData);
  } catch (error) {
    console.error('Error listing vendors:', error);
    return res.status(500).json({ error: 'Error al cargar fabricantes', details: error.message });
  }
};

// GET /api/vendors/:id
exports.getById = async (req, res) => {
  try {
    const vendor = await repository.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    
    const models = await repository.getModels();
    const vendorModels = models.filter((m) => m.vendor_id === vendor.vendor_id);
    
    const devicesCount = (await Promise.all(
      vendorModels.map(async (model) => {
        const devices = await repository.getDevices({ model_id: model.model_id });
        return devices.length;
      })
    )).reduce((a, b) => a + b, 0);
    
    // Enriquecer modelos con información completa
    const enrichedModels = vendorModels.map(model => ({
      ...model,
      vendor_name: vendor.name,
    }));
    
    return res.json({
      ...vendor,
      models: enrichedModels,
      models_count: vendorModels.length,
      devices_count: devicesCount,
    });
  } catch (error) {
    console.error('Error getting vendor:', error);
    return res.status(500).json({ error: 'Error al obtener fabricante', details: error.message });
  }
};

// POST /api/vendors
exports.create = async (req, res) => {
  try {
    const { name, support_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'name es requerido' });
    }
    
    const newVendor = await repository.createVendor({ name, support_url });
    return res.status(201).json({ ...newVendor, models_count: 0, devices_count: 0 });
  } catch (error) {
    console.error('Error creating vendor:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El fabricante ya existe' });
    }
    return res.status(500).json({ error: 'Error al crear fabricante', details: error.message });
  }
};

// PUT /api/vendors/:id
exports.update = async (req, res) => {
  try {
    const { name, support_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'name es requerido' });
    }
    
    const vendor = await repository.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    
    const updatedVendor = await repository.updateVendor(req.params.id, { name, support_url });
    const models = await repository.getModels();
    const vendorModels = models.filter((m) => m.vendor_id === updatedVendor.vendor_id);
    
    const devicesCount = (await Promise.all(
      vendorModels.map(async (model) => {
        const devices = await repository.getDevices({ model_id: model.model_id });
        return devices.length;
      })
    )).reduce((a, b) => a + b, 0);
    
    return res.json({
      ...updatedVendor,
      models_count: vendorModels.length,
      devices_count: devicesCount,
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El fabricante ya existe' });
    }
    return res.status(500).json({ error: 'Error al actualizar fabricante', details: error.message });
  }
};

// DELETE /api/vendors/:id
exports.delete = async (req, res) => {
  try {
    const vendor = await repository.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    
    await repository.deleteVendor(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting vendor:', error);
    return res.status(500).json({ error: 'Error al eliminar fabricante', details: error.message });
  }
};
