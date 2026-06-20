const repository = require('../db/repository');

// GET /api/devices
exports.list = async (req, res) => {
  try {
    const { rack_id, model_id, status } = req.query;
    const filters = {};
    if (rack_id) filters.rack_id = rack_id;
    if (model_id) filters.model_id = model_id;
    if (status) filters.status = status;
    
    const devices = await repository.getDevices(filters);
    return res.json(devices);
  } catch (error) {
    console.error('Error listing devices:', error);
    return res.status(500).json({ error: 'Error al cargar dispositivos', details: error.message });
  }
};

// GET /api/devices/:id
exports.getById = async (req, res) => {
  try {
    const device = await repository.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });

    return res.json({
      ...device,
      model_name: device.model_name ?? 'Sin modelo',
      vendor_name: device.vendor_name ?? 'Sin fabricante',
      device_type: device.device_type ?? 'N/D',
      rack_code: device.rack_code ?? 'Sin rack',
      room_name: device.room_name ?? 'Sin sala',
      room_floor: device.room_floor ?? 'N/D',
      site_name: device.site_name ?? 'Sin sitio',
    });
  } catch (error) {
    console.error('Error getting device:', error);
    return res.status(500).json({ error: 'Error al obtener dispositivo', details: error.message });
  }
};

// POST /api/devices
exports.create = async (req, res) => {
  try {
    const { model_id, name, asset_tag, serial_number, rack_id, u_start, status, installed_at } = req.body;
    
    if (!model_id || !name) {
      return res.status(400).json({ error: 'model_id y name son requeridos' });
    }
    
    const model = await repository.getModelById(model_id);
    if (!model) return res.status(404).json({ error: 'Model no encontrado' });
    
    const newDevice = await repository.createDevice({
      model_id,
      name,
      asset_tag,
      serial_number,
      rack_id,
      u_start,
      status: status || 'active',
      installed_at,
    });
    
    return res.status(201).json(newDevice);
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      const duplicateField = error?.sqlMessage?.includes('serial_number')
        ? 'serial_number'
        : error?.sqlMessage?.includes('asset_tag')
          ? 'asset_tag'
          : 'campo único';
      return res.status(409).json({
        error: `Valor duplicado en ${duplicateField}`,
        details: 'El serial y asset tag deben ser únicos por equipo.',
      });
    }
    console.error('Error creating device:', error);
    return res.status(500).json({ error: 'Error al crear dispositivo', details: error.message });
  }
};

// PUT /api/devices/:id
exports.update = async (req, res) => {
  try {
    const { model_id, name, asset_tag, serial_number, rack_id, u_start, status, installed_at } = req.body;
    
    if (!model_id || !name) {
      return res.status(400).json({ error: 'model_id y name son requeridos' });
    }
    
    const device = await repository.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    
    const model = await repository.getModelById(model_id);
    if (!model) return res.status(404).json({ error: 'Model no encontrado' });
    
    const updatedDevice = await repository.updateDevice(req.params.id, {
      model_id,
      name,
      asset_tag,
      serial_number,
      rack_id,
      u_start,
      status: status || 'active',
      installed_at,
    });
    
    return res.json(updatedDevice);
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      const duplicateField = error?.sqlMessage?.includes('serial_number')
        ? 'serial_number'
        : error?.sqlMessage?.includes('asset_tag')
          ? 'asset_tag'
          : 'campo único';
      return res.status(409).json({
        error: `Valor duplicado en ${duplicateField}`,
        details: 'El serial y asset tag deben ser únicos por equipo.',
      });
    }
    console.error('Error updating device:', error);
    return res.status(500).json({ error: 'Error al actualizar dispositivo', details: error.message });
  }
};

// DELETE /api/devices/:id
exports.delete = async (req, res) => {
  try {
    const device = await repository.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    
    await repository.deleteDevice(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting device:', error);
    return res.status(500).json({ error: 'Error al eliminar dispositivo', details: error.message });
  }
};
