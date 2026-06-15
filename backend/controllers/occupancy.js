const dataStore = require('../utils/dataStore');

exports.list = (req, res) => {
  const { rack_id } = req.query;
  let occupancy = dataStore.getOccupancy();
  if (rack_id) occupancy = occupancy.filter((unit) => String(unit.rack_id) === String(rack_id));
  return res.json(occupancy);
};

exports.getByRack = (req, res) => {
  return res.json(dataStore.getOccupancyByRackId(req.params.rackId));
};
