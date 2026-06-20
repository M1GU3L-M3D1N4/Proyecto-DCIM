const repository = require('../db/repository');

// GET /api/models
exports.list = async (req, res) => {
  try {
    const { vendor_id } = req.query;
    let models = await repository.getModels();
    
    if (vendor_id) {
      models = models.filter((m) => m.vendor_id === parseInt(vendor_id));
    }
    
    const response = await Promise.all(
      models.map(async (model) => {
        const vendor = await repository.getVendorById(model.vendor_id);
        const devices = await repository.getDevices({ model_id: model.model_id });
        
        return {
          ...model,
          vendor_name: vendor?.name ?? 'Sin fabricante',
          devices_count: devices.length,
        };
      })
    );
    
    return res.json(response);
  } catch (error) {
    console.error('Error listing models:', error);
    return res.status(500).json({ error: 'Error al cargar modelos', details: error.message });
  }
};

// GET /api/models/:id
exports.getById = async (req, res) => {
  try {
    const model = await repository.getModelById(req.params.id);
    if (!model) return res.status(404).json({ error: 'Model not found' });
    
    const vendor = await repository.getVendorById(model.vendor_id);
    const devices = await repository.getDevices({ model_id: model.model_id });
    
    // Enriquecer equipos con información de ubicación
    const enrichedDevices = await Promise.all(
      devices.map(async (device) => {
        const rack = device.rack_id ? await repository.getRackById(device.rack_id) : null;
        const room = rack ? await repository.getRoomById(rack.room_id) : null;
        const site = room ? await repository.getSiteById(room.site_id) : null;
        
        return {
          ...device,
          rack_code: rack?.code ?? 'Sin rack',
          room_name: room?.name ?? 'Sin sala',
          site_name: site?.name ?? 'Sin sitio',
        };
      })
    );
    
    return res.json({
      ...model,
      vendor_id: model.vendor_id,
      vendor_name: vendor?.name ?? 'Sin fabricante',
      devices: enrichedDevices,
      devices_count: devices.length,
    });
  } catch (error) {
    console.error('Error getting model:', error);
    return res.status(500).json({ error: 'Error al obtener modelo', details: error.message });
  }
};

// POST /api/models
exports.create = async (req, res) => {
  try {
    const { vendor_id, model_name, device_type, u_height } = req.body;
    
    if (!vendor_id || !model_name) {
      return res.status(400).json({ error: 'vendor_id y model_name son requeridos' });
    }
    
    const vendor = await repository.getVendorById(vendor_id);
    if (!vendor) return res.status(404).json({ error: 'Vendor no encontrado' });
    
    const newModel = await repository.createModel({
      vendor_id,
      model_name,
      device_type,
      u_height: u_height || 1,
    });
    
    return res.status(201).json({
      ...newModel,
      vendor_name: vendor.name,
      devices_count: 0,
    });
  } catch (error) {
    console.error('Error creating model:', error);
    return res.status(500).json({ error: 'Error al crear modelo', details: error.message });
  }
};

// PUT /api/models/:id
exports.update = async (req, res) => {
  try {
    const { vendor_id, model_name, device_type, u_height } = req.body;
    
    if (!vendor_id || !model_name) {
      return res.status(400).json({ error: 'vendor_id y model_name son requeridos' });
    }
    
    const model = await repository.getModelById(req.params.id);
    if (!model) return res.status(404).json({ error: 'Model not found' });
    
    const vendor = await repository.getVendorById(vendor_id);
    if (!vendor) return res.status(404).json({ error: 'Vendor no encontrado' });
    
    const updatedModel = await repository.updateModel(req.params.id, {
      vendor_id,
      model_name,
      device_type,
      u_height: u_height || 1,
    });
    
    const devices = await repository.getDevices({ model_id: updatedModel.model_id });
    
    return res.json({
      ...updatedModel,
      vendor_name: vendor.name,
      devices_count: devices.length,
    });
  } catch (error) {
    console.error('Error updating model:', error);
    return res.status(500).json({ error: 'Error al actualizar modelo', details: error.message });
  }
};

// DELETE /api/models/:id
exports.delete = async (req, res) => {
  try {
    const model = await repository.getModelById(req.params.id);
    if (!model) return res.status(404).json({ error: 'Model not found' });
    
    await repository.deleteModel(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting model:', error);
    return res.status(500).json({ error: 'Error al eliminar modelo', details: error.message });
  }
};
