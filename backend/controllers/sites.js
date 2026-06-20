const repository = require('../db/repository');

// GET /api/sites
exports.list = async (req, res) => {
  try {
    const sites = await repository.getSites();
    
    // Enriquecer con conteo de salas
    const sitesWithCount = await Promise.all(
      sites.map(async (site) => {
        const rooms = await repository.getRooms({ site_id: site.site_id });
        return { ...site, rooms_count: rooms.length };
      })
    );
    
    return res.json(sitesWithCount);
  } catch (error) {
    console.error('Error listing sites:', error);
    return res.status(500).json({ error: 'Error al cargar sitios', details: error.message });
  }
};

// GET /api/sites/:id
exports.getById = async (req, res) => {
  try {
    const site = await repository.getSiteById(req.params.id);
    if (!site) return res.status(404).json({ error: 'Site not found' });
    
    const rooms = await repository.getRooms({ site_id: site.site_id });
    return res.json({ ...site, rooms_count: rooms.length });
  } catch (error) {
    console.error('Error getting site:', error);
    return res.status(500).json({ error: 'Error al obtener sitio', details: error.message });
  }
};

// POST /api/sites
exports.create = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    
    if (!name || !city) {
      return res.status(400).json({ error: 'name y city son requeridos' });
    }
    
    const newSite = await repository.createSite({ name, city, address });
    return res.status(201).json({ ...newSite, rooms_count: 0 });
  } catch (error) {
    console.error('Error creating site:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El sitio ya existe' });
    }
    return res.status(500).json({ error: 'Error al crear sitio', details: error.message });
  }
};

// PUT /api/sites/:id
exports.update = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    
    if (!name || !city) {
      return res.status(400).json({ error: 'name y city son requeridos' });
    }
    
    const site = await repository.getSiteById(req.params.id);
    if (!site) return res.status(404).json({ error: 'Site not found' });
    
    const updatedSite = await repository.updateSite(req.params.id, { name, city, address });
    const rooms = await repository.getRooms({ site_id: updatedSite.site_id });
    return res.json({ ...updatedSite, rooms_count: rooms.length });
  } catch (error) {
    console.error('Error updating site:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El sitio ya existe' });
    }
    return res.status(500).json({ error: 'Error al actualizar sitio', details: error.message });
  }
};

// DELETE /api/sites/:id
exports.delete = async (req, res) => {
  try {
    const site = await repository.getSiteById(req.params.id);
    if (!site) return res.status(404).json({ error: 'Site not found' });
    
    await repository.deleteSite(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting site:', error);
    return res.status(500).json({ error: 'Error al eliminar sitio', details: error.message });
  }
};
