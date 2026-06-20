const repository = require('../db/repository');

// GET /api/rooms
exports.list = async (req, res) => {
  try {
    const { site_id } = req.query;
    const rooms = await repository.getRooms(site_id ? { site_id } : {});
    
    // Enriquecer con conteo de racks y ocupación
    const roomsWithData = await Promise.all(
      rooms.map(async (room) => {
        const racks = await repository.getRacks({ room_id: room.room_id });
        const occupiedRacksCount = (await Promise.all(
          racks.map(async (rack) => {
            const occ = await repository.getOccupancyByRackId(rack.rack_id);
            return occ.length > 0 ? 1 : 0;
          })
        )).reduce((a, b) => a + b, 0);
        
        const status = racks.length === 0 ? 'Disponible' : occupiedRacksCount === 0 ? 'Disponible' : occupiedRacksCount >= racks.length ? 'Llena' : 'Operativa';
        
        return {
          ...room,
          racks_count: racks.length,
          occupied_racks: occupiedRacksCount,
          status,
        };
      })
    );
    
    return res.json(roomsWithData);
  } catch (error) {
    console.error('Error listing rooms:', error);
    return res.status(500).json({ error: 'Error al cargar salas', details: error.message });
  }
};

// GET /api/rooms/:id
exports.getById = async (req, res) => {
  try {
    const room = await repository.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    const racks = await repository.getRacks({ room_id: room.room_id });
    const occupiedRacksCount = (await Promise.all(
      racks.map(async (rack) => {
        const occ = await repository.getOccupancyByRackId(rack.rack_id);
        return occ.length > 0 ? 1 : 0;
      })
    )).reduce((a, b) => a + b, 0);
    
    const status = racks.length === 0 ? 'Disponible' : occupiedRacksCount === 0 ? 'Disponible' : occupiedRacksCount >= racks.length ? 'Llena' : 'Operativa';
    
    return res.json({
      ...room,
      racks_count: racks.length,
      occupied_racks: occupiedRacksCount,
      status,
    });
  } catch (error) {
    console.error('Error getting room:', error);
    return res.status(500).json({ error: 'Error al obtener sala', details: error.message });
  }
};

// POST /api/rooms
exports.create = async (req, res) => {
  try {
    const { site_id, name, floor } = req.body;
    
    if (!site_id || !name) {
      return res.status(400).json({ error: 'site_id y name son requeridos' });
    }
    
    const site = await repository.getSiteById(site_id);
    if (!site) return res.status(404).json({ error: 'Site no encontrado' });
    
    const newRoom = await repository.createRoom({ site_id, name, floor });
    return res.status(201).json({ ...newRoom, racks_count: 0, occupied_racks: 0, status: 'Disponible' });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ error: 'Error al crear sala', details: error.message });
  }
};

// PUT /api/rooms/:id
exports.update = async (req, res) => {
  try {
    const { site_id, name, floor } = req.body;
    
    if (!site_id || !name) {
      return res.status(400).json({ error: 'site_id y name son requeridos' });
    }
    
    const room = await repository.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    const site = await repository.getSiteById(site_id);
    if (!site) return res.status(404).json({ error: 'Site no encontrado' });
    
    const updatedRoom = await repository.updateRoom(req.params.id, { site_id, name, floor });
    const racks = await repository.getRacks({ room_id: updatedRoom.room_id });
    const occupiedRacksCount = (await Promise.all(
      racks.map(async (rack) => {
        const occ = await repository.getOccupancyByRackId(rack.rack_id);
        return occ.length > 0 ? 1 : 0;
      })
    )).reduce((a, b) => a + b, 0);
    
    const status = racks.length === 0 ? 'Disponible' : occupiedRacksCount === 0 ? 'Disponible' : occupiedRacksCount >= racks.length ? 'Llena' : 'Operativa';
    
    return res.json({
      ...updatedRoom,
      racks_count: racks.length,
      occupied_racks: occupiedRacksCount,
      status,
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return res.status(500).json({ error: 'Error al actualizar sala', details: error.message });
  }
};

// DELETE /api/rooms/:id
exports.delete = async (req, res) => {
  try {
    const room = await repository.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    await repository.deleteRoom(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting room:', error);
    return res.status(500).json({ error: 'Error al eliminar sala', details: error.message });
  }
};
