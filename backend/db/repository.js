/**
 * Capa de acceso a datos para MySQL.
 * Abstrae operaciones CRUD y agregaciones.
 */

const pool = require('./connection');

// ========== VENDORS ==========
exports.getVendors = async () => {
  const [rows] = await pool.query('SELECT * FROM vendors');
  return rows;
};

exports.getVendorById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM vendors WHERE vendor_id = ?', [id]);
  return rows[0] || null;
};

exports.createVendor = async (data) => {
  const { name, support_url } = data;
  const [result] = await pool.query('INSERT INTO vendors (name, support_url) VALUES (?, ?)', [name, support_url]);
  return { vendor_id: result.insertId, name, support_url };
};

exports.updateVendor = async (id, data) => {
  const { name, support_url } = data;
  await pool.query('UPDATE vendors SET name = ?, support_url = ? WHERE vendor_id = ?', [name, support_url, id]);
  return exports.getVendorById(id);
};

exports.deleteVendor = async (id) => {
  await pool.query('DELETE FROM vendors WHERE vendor_id = ?', [id]);
  return true;
};

// ========== DEVICE MODELS ==========
exports.getModels = async () => {
  const [rows] = await pool.query('SELECT * FROM device_models');
  return rows;
};

exports.getModelById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM device_models WHERE model_id = ?', [id]);
  return rows[0] || null;
};

exports.createModel = async (data) => {
  const { vendor_id, model_name, device_type, u_height } = data;
  const [result] = await pool.query(
    'INSERT INTO device_models (vendor_id, model_name, device_type, u_height) VALUES (?, ?, ?, ?)',
    [vendor_id, model_name, device_type, u_height || 1]
  );
  return { model_id: result.insertId, vendor_id, model_name, device_type, u_height: u_height || 1 };
};

exports.updateModel = async (id, data) => {
  const { vendor_id, model_name, device_type, u_height } = data;
  await pool.query(
    'UPDATE device_models SET vendor_id = ?, model_name = ?, device_type = ?, u_height = ? WHERE model_id = ?',
    [vendor_id, model_name, device_type, u_height || 1, id]
  );
  return exports.getModelById(id);
};

exports.deleteModel = async (id) => {
  await pool.query('DELETE FROM device_models WHERE model_id = ?', [id]);
  return true;
};

// ========== SITES ==========
exports.getSites = async () => {
  const [rows] = await pool.query('SELECT * FROM sites');
  return rows;
};

exports.getSiteById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM sites WHERE site_id = ?', [id]);
  return rows[0] || null;
};

exports.createSite = async (data) => {
  const { name, city, address } = data;
  const [result] = await pool.query('INSERT INTO sites (name, city, address) VALUES (?, ?, ?)', [name, city, address]);
  return { site_id: result.insertId, name, city, address };
};

exports.updateSite = async (id, data) => {
  const { name, city, address } = data;
  await pool.query('UPDATE sites SET name = ?, city = ?, address = ? WHERE site_id = ?', [name, city, address, id]);
  return exports.getSiteById(id);
};

exports.deleteSite = async (id) => {
  await pool.query('DELETE FROM sites WHERE site_id = ?', [id]);
  return true;
};

// ========== ROOMS ==========
exports.getRooms = async (filters = {}) => {
  let query = 'SELECT * FROM rooms';
  const params = [];
  if (filters.site_id) {
    query += ' WHERE site_id = ?';
    params.push(filters.site_id);
  }
  const [rows] = await pool.query(query, params);
  return rows;
};

exports.getRoomById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM rooms WHERE room_id = ?', [id]);
  return rows[0] || null;
};

exports.createRoom = async (data) => {
  const { site_id, name, floor } = data;
  const [result] = await pool.query('INSERT INTO rooms (site_id, name, floor) VALUES (?, ?, ?)', [site_id, name, floor]);
  return { room_id: result.insertId, site_id, name, floor };
};

exports.updateRoom = async (id, data) => {
  const { site_id, name, floor } = data;
  await pool.query('UPDATE rooms SET site_id = ?, name = ?, floor = ? WHERE room_id = ?', [site_id, name, floor, id]);
  return exports.getRoomById(id);
};

exports.deleteRoom = async (id) => {
  await pool.query('DELETE FROM rooms WHERE room_id = ?', [id]);
  return true;
};

// ========== RACKS ==========
exports.getRacks = async (filters = {}) => {
  let query = `
    SELECT
      r.*,
      rm.name AS room_name,
      rm.floor AS room_floor,
      s.name AS site_name
    FROM racks r
    LEFT JOIN rooms rm ON rm.room_id = r.room_id
    LEFT JOIN sites s ON s.site_id = rm.site_id
    WHERE 1=1
  `;
  const params = [];
  if (filters.room_id) {
    query += ' AND r.room_id = ?';
    params.push(filters.room_id);
  }
  const [rows] = await pool.query(query, params);
  return rows;
};

exports.getRackById = async (id) => {
  const [rows] = await pool.query(
    `
      SELECT
        r.*,
        rm.name AS room_name,
        rm.floor AS room_floor,
        s.name AS site_name
      FROM racks r
      LEFT JOIN rooms rm ON rm.room_id = r.room_id
      LEFT JOIN sites s ON s.site_id = rm.site_id
      WHERE r.rack_id = ?
    `,
    [id]
  );
  return rows[0] || null;
};

exports.createRack = async (data) => {
  const { room_id, code, total_u } = data;
  const [result] = await pool.query('INSERT INTO racks (room_id, code, total_u) VALUES (?, ?, ?)', [room_id, code, total_u || 42]);
  return { rack_id: result.insertId, room_id, code, total_u: total_u || 42 };
};

exports.updateRack = async (id, data) => {
  const { room_id, code, total_u } = data;
  await pool.query('UPDATE racks SET room_id = ?, code = ?, total_u = ? WHERE rack_id = ?', [room_id, code, total_u || 42, id]);
  return exports.getRackById(id);
};

exports.deleteRack = async (id) => {
  await pool.query('DELETE FROM racks WHERE rack_id = ?', [id]);
  return true;
};

// ========== DEVICES ==========
exports.getDevices = async (filters = {}) => {
  let query = `
    SELECT
      d.*,
      m.model_name,
      m.device_type,
      v.name AS vendor_name,
      r.code AS rack_code,
      rm.name AS room_name,
      rm.floor AS room_floor,
      s.name AS site_name
    FROM devices d
    LEFT JOIN device_models m ON m.model_id = d.model_id
    LEFT JOIN vendors v ON v.vendor_id = m.vendor_id
    LEFT JOIN racks r ON r.rack_id = d.rack_id
    LEFT JOIN rooms rm ON rm.room_id = r.room_id
    LEFT JOIN sites s ON s.site_id = rm.site_id
    WHERE 1=1
  `;
  const params = [];
  if (filters.rack_id) {
    query += ' AND d.rack_id = ?';
    params.push(filters.rack_id);
  }
  if (filters.model_id) {
    query += ' AND d.model_id = ?';
    params.push(filters.model_id);
  }
  if (filters.status) {
    query += ' AND d.status = ?';
    params.push(filters.status);
  }
  const [rows] = await pool.query(query, params);
  return rows;
};

exports.getDeviceById = async (id) => {
  const [rows] = await pool.query(
    `
      SELECT
        d.*,
        m.model_name,
        m.device_type,
        v.name AS vendor_name,
        r.code AS rack_code,
        rm.name AS room_name,
        rm.floor AS room_floor,
        s.name AS site_name
      FROM devices d
      LEFT JOIN device_models m ON m.model_id = d.model_id
      LEFT JOIN vendors v ON v.vendor_id = m.vendor_id
      LEFT JOIN racks r ON r.rack_id = d.rack_id
      LEFT JOIN rooms rm ON rm.room_id = r.room_id
      LEFT JOIN sites s ON s.site_id = rm.site_id
      WHERE d.device_id = ?
    `,
    [id]
  );
  return rows[0] || null;
};

exports.createDevice = async (data) => {
  const { model_id, name, asset_tag, serial_number, rack_id, u_start, status, installed_at } = data;
  const [result] = await pool.query(
    'INSERT INTO devices (model_id, name, asset_tag, serial_number, rack_id, u_start, status, installed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [model_id, name, asset_tag, serial_number, rack_id || null, u_start || null, status || 'active', installed_at || null]
  );
  return exports.getDeviceById(result.insertId);
};

exports.updateDevice = async (id, data) => {
  const { model_id, name, asset_tag, serial_number, rack_id, u_start, status, installed_at } = data;
  await pool.query(
    'UPDATE devices SET model_id = ?, name = ?, asset_tag = ?, serial_number = ?, rack_id = ?, u_start = ?, status = ?, installed_at = ? WHERE device_id = ?',
    [model_id, name, asset_tag, serial_number, rack_id || null, u_start || null, status || 'active', installed_at || null, id]
  );
  return exports.getDeviceById(id);
};

exports.deleteDevice = async (id) => {
  await pool.query('DELETE FROM devices WHERE device_id = ?', [id]);
  return true;
};

// ========== OCCUPANCY ==========
exports.getOccupancy = async (filters = {}) => {
  let query = 'SELECT * FROM rack_unit_occupancy';
  const params = [];
  if (filters.rack_id) {
    query += ' WHERE rack_id = ?';
    params.push(filters.rack_id);
  }
  const [rows] = await pool.query(query, params);
  return rows;
};

exports.getOccupancyByRackId = async (rackId) => {
  const [rows] = await pool.query('SELECT * FROM rack_unit_occupancy WHERE rack_id = ? ORDER BY unit', [rackId]);
  return rows;
};

exports.createOccupancy = async (data) => {
  const { rack_id, unit, device_id } = data;
  await pool.query(
    'INSERT INTO rack_unit_occupancy (rack_id, unit, device_id) VALUES (?, ?, ?)',
    [rack_id, unit, device_id]
  );
  return { rack_id, unit, device_id };
};

exports.deleteOccupancy = async (rackId, unit) => {
  await pool.query('DELETE FROM rack_unit_occupancy WHERE rack_id = ? AND unit = ?', [rackId, unit]);
  return true;
};

exports.deleteOccupancyByRackAndUnit = async (rackId, unit) => {
  await pool.query('DELETE FROM rack_unit_occupancy WHERE rack_id = ? AND unit = ?', [rackId, unit]);
  return true;
};

// ========== UTILIDADES ==========
exports.testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 as test');
    connection.release();
    return { success: true, message: 'Conectado a MySQL correctamente' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ========== USERS ==========
exports.getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

exports.getUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ? LIMIT 1', [id]);
  return rows[0] || null;
};
