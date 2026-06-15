const dataStore = require('../utils/dataStore');

exports.list = (req, res) => {
  const { site_id } = req.query;
  let rooms = dataStore.getRooms();
  if (site_id) rooms = rooms.filter((room) => String(room.site_id) === String(site_id));

  return res.json(rooms.map((room) => dataStore.getRoomSummary(room)));
};

exports.getById = (req, res) => {
  const room = dataStore.getRoomById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  return res.json(dataStore.getRoomSummary(room));
};
