const repository = require('../db/repository');

// GET /api/racks
exports.list = async (req, res) => {
  try {
    const { room_id } = req.query;
    const racks = await repository.getRacks(room_id ? { room_id } : {});

    return res.json(racks);
  } catch (error) {
    console.error('Error listing racks:', error);
    return res.status(500).json({ error: 'Error al cargar racks', details: error.message });
  }
};

// GET /api/racks/:id
exports.getById = async (req, res) => {
  try {
    const rack = await repository.getRackById(req.params.id);
    if (!rack) return res.status(404).json({ error: 'Rack not found' });

    return res.json({
      ...rack,
      room_name: rack.room_name ?? 'Sin sala',
      room_floor: rack.room_floor ?? 'N/D',
      site_name: rack.site_name ?? 'Sin sitio',
      device_count: rack.device_count ?? 0,
      used_units: rack.used_units ?? 0,
      used_percent: rack.used_percent ?? 0,
    });
  } catch (error) {
    console.error('Error getting rack:', error);
    return res.status(500).json({ error: 'Error al obtener rack', details: error.message });
  }
};

// POST /api/racks
exports.create = async (req, res) => {
  try {
    const { room_id, code, total_u } = req.body;
    
    if (!room_id || !code) {
      return res.status(400).json({ error: 'room_id y code son requeridos' });
    }
    
    const room = await repository.getRoomById(room_id);
    if (!room) return res.status(404).json({ error: 'Room no encontrado' });
    
    const newRack = await repository.createRack({ room_id, code, total_u: total_u || 42 });
    return res.status(201).json({ ...newRack, device_count: 0, used_units: 0, used_percent: 0 });
  } catch (error) {
    console.error('Error creating rack:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El rack ya existe' });
    }
    return res.status(500).json({ error: 'Error al crear rack', details: error.message });
  }
};

// PUT /api/racks/:id
exports.update = async (req, res) => {
  try {
    const { room_id, code, total_u } = req.body;
    
    if (!room_id || !code) {
      return res.status(400).json({ error: 'room_id y code son requeridos' });
    }
    
    const rack = await repository.getRackById(req.params.id);
    if (!rack) return res.status(404).json({ error: 'Rack not found' });
    
    const room = await repository.getRoomById(room_id);
    if (!room) return res.status(404).json({ error: 'Room no encontrado' });
    
    const updatedRack = await repository.updateRack(req.params.id, { room_id, code, total_u: total_u || 42 });
    const rackWithMetrics = await repository.getRackById(updatedRack.rack_id);
    
    return res.json({
      ...rackWithMetrics,
      device_count: rackWithMetrics?.device_count ?? 0,
      used_units: rackWithMetrics?.used_units ?? 0,
      used_percent: rackWithMetrics?.used_percent ?? 0,
    });
  } catch (error) {
    console.error('Error updating rack:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El rack ya existe' });
    }
    return res.status(500).json({ error: 'Error al actualizar rack', details: error.message });
  }
};

// DELETE /api/racks/:id
exports.delete = async (req, res) => {
  try {
    const rack = await repository.getRackById(req.params.id);
    if (!rack) return res.status(404).json({ error: 'Rack not found' });
    
    await repository.deleteRack(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting rack:', error);
    return res.status(500).json({ error: 'Error al eliminar rack', details: error.message });
  }
};
