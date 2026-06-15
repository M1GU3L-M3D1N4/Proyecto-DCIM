const path = require('path');
const fs = require('fs');

// Carga simple del JSON de mock (síncrona y suficiente para pruebas)
const dataPath = path.join(__dirname, '..', 'data', 'mockData.json');
let store = {};
try {
  store = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (err) {
  console.warn('dataStore: no se pudo leer mockData.json:', err.message);
  store = {};
}

// Helpers de acceso a datos
exports.getSites = () => store.sites || [];
exports.getSiteById = (id) => (store.sites || []).find((s) => String(s.site_id) === String(id));

exports.getVendors = () => store.vendors || [];
exports.getVendorById = (id) => (store.vendors || []).find((v) => String(v.vendor_id) === String(id));

exports.getModels = () => store.device_models || [];
exports.getModelById = (id) => (store.device_models || []).find((m) => String(m.model_id) === String(id));

exports.getRooms = () => store.rooms || [];
exports.getRoomById = (id) => (store.rooms || []).find((r) => String(r.room_id) === String(id));

exports.getRacks = () => store.racks || [];
exports.getRackById = (id) => (store.racks || []).find((r) => String(r.rack_id) === String(id));

exports.getDevices = (filters = {}) => {
  let items = store.devices || [];
  if (filters.rack_id) items = items.filter((d) => String(d.rack_id) === String(filters.rack_id));
  if (filters.model_id) items = items.filter((d) => String(d.model_id) === String(filters.model_id));
  if (filters.status) items = items.filter((d) => String(d.status) === String(filters.status));
  return items;
};

exports.getDeviceById = (id) => (store.devices || []).find((d) => String(d.device_id) === String(id));

exports.getOccupancy = () => store.rack_unit_occupancy || [];

exports.getOccupancyByRackId = (rackId) =>
  (store.rack_unit_occupancy || []).filter((unit) => String(unit.rack_id) === String(rackId));

exports.getSiteSummary = (site) => {
  const roomsCount = exports.getRooms().filter((room) => String(room.site_id) === String(site.site_id)).length;
  return {
    ...site,
    rooms_count: roomsCount,
  };
};

exports.getRoomSummary = (room) => {
  const site = exports.getSiteById(room.site_id);
  const racks = exports.getRacks().filter((rack) => String(rack.room_id) === String(room.room_id));
  const occupiedRacks = racks.filter((rack) => exports.getOccupancyByRackId(rack.rack_id).length > 0).length;
  const status = racks.length === 0 ? 'Disponible' : occupiedRacks === 0 ? 'Disponible' : occupiedRacks >= racks.length ? 'Llena' : 'Operativa';

  return {
    ...room,
    site_name: site?.name ?? 'Sin sitio',
    site_city: site?.city ?? null,
    racks_count: racks.length,
    occupied_racks: occupiedRacks,
    status,
  };
};

exports.getRackSummary = (rack) => {
  const room = exports.getRoomById(rack.room_id);
  const site = room ? exports.getSiteById(room.site_id) : null;
  const occupancy = exports.getOccupancyByRackId(rack.rack_id);
  const usedUnits = occupancy.length;
  const usedPercent = rack.total_u ? Math.min(Math.round((usedUnits / rack.total_u) * 100), 100) : 0;
  const deviceCount = exports.getDevices({ rack_id: rack.rack_id }).length;

  return {
    ...rack,
    room_name: room?.name ?? 'Sin sala',
    site_name: site?.name ?? 'Sin sitio',
    device_count: deviceCount,
    used_units: usedUnits,
    used_percent: usedPercent,
  };
};

exports.getDeviceSummary = (device) => {
  const model = exports.getModelById(device.model_id);
  const vendor = model ? exports.getVendorById(model.vendor_id) : null;
  const rack = device.rack_id ? exports.getRackById(device.rack_id) : null;
  const room = rack ? exports.getRoomById(rack.room_id) : null;
  const site = room ? exports.getSiteById(room.site_id) : null;

  return {
    ...device,
    rack_code: rack?.code ?? 'Sin rack',
    room_name: room?.name ?? 'Sin sala',
    site_name: site?.name ?? 'Sin sitio',
    model_name: model?.model_name ?? 'Sin modelo',
    vendor_name: vendor?.name ?? 'Sin fabricante',
  };
};
