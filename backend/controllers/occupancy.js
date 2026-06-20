const repository = require('../db/repository');

exports.list = async (req, res) => {
  try {
    const { rack_id } = req.query;
    const occupancy = await repository.getOccupancy(rack_id ? { rack_id } : {});
    return res.json(occupancy);
  } catch (error) {
    return res.status(500).json({ error: 'Error al cargar ocupación', details: error.message });
  }
};

exports.getByRack = async (req, res) => {
  try {
    const data = await repository.getOccupancyByRackId(req.params.rackId);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener ocupación del rack', details: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { rack_id, unit, device_id } = req.body;
    if (!rack_id || !unit || !device_id) {
      return res.status(400).json({ error: 'rack_id, unit y device_id son requeridos' });
    }

    const rack = await repository.getRackById(rack_id);
    if (!rack) return res.status(404).json({ error: 'Rack not found' });

    const device = await repository.getDeviceById(device_id);
    if (!device) return res.status(404).json({ error: 'Device not found' });

    const created = await repository.createOccupancy({ rack_id, unit, device_id });
    return res.status(201).json(created);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'La unidad ya está ocupada en ese rack' });
    }
    return res.status(500).json({ error: 'Error al crear ocupación', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { rackId, unit } = req.params;
    await repository.deleteOccupancy(rackId, unit);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar ocupación', details: error.message });
  }
};
