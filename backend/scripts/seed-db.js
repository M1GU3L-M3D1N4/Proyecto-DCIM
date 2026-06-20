/**
 * Script de migración: carga datos desde mockData.json a MySQL
 * Uso: node backend/scripts/seed-db.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('../db/connection');
const repository = require('../db/repository');

async function seedDatabase() {
  try {
    console.log('🔄 Iniciando migración de datos...\n');

    // Cargar mockData.json
    const mockDataPath = path.join(__dirname, '..', 'data', 'mockData.json');
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

    // Verificar que tenemos datos
    if (!mockData) {
      console.error('❌ No se pudo cargar mockData.json');
      process.exit(1);
    }

    // 0. Insertar usuario para autenticación
    console.log('👤 Insertando user de autenticación...');
    if (mockData.user?.email && mockData.user?.password) {
      const username = mockData.user.email.split('@')[0];
      const fullName = mockData.user.name || username;
      const passwordHash = await bcrypt.hash(mockData.user.password, 10);

      try {
        await pool.query(
          'INSERT INTO users (username, email, password_hash, full_name, active) VALUES (?, ?, ?, ?, 1)',
          [username, mockData.user.email, passwordHash, fullName]
        );
        console.log(`  ✓ User: ${mockData.user.email}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`  ⚠ User ya existe: ${mockData.user.email}`);
        } else {
          console.error(`  ✗ Error en user ${mockData.user.email}:`, err.message);
        }
      }
    } else {
      console.log('  ⚠ No hay user en mockData.json para insertar');
    }
    console.log();

    // 1. Insertar vendors
    console.log('📦 Insertando vendors...');
    if (mockData.vendors && mockData.vendors.length > 0) {
      for (const vendor of mockData.vendors) {
        try {
          await repository.createVendor({
            name: vendor.name,
            support_url: vendor.support_url,
          });
          console.log(`  ✓ Vendor: ${vendor.name}`);
        } catch (err) {
          if (err.code !== 'ER_DUP_ENTRY') {
            console.error(`  ✗ Error en vendor ${vendor.name}:`, err.message);
          }
        }
      }
    }
    console.log();

    // 2. Insertar device_models
    console.log('🖥️  Insertando device models...');
    if (mockData.device_models && mockData.device_models.length > 0) {
      for (const model of mockData.device_models) {
        try {
          await repository.createModel({
            vendor_id: model.vendor_id,
            model_name: model.model_name,
            device_type: model.device_type,
            u_height: model.u_height || 1,
          });
          console.log(`  ✓ Model: ${model.model_name}`);
        } catch (err) {
          console.error(`  ✗ Error en modelo ${model.model_name}:`, err.message);
        }
      }
    }
    console.log();

    // 3. Insertar sites
    console.log('🏢 Insertando sites...');
    if (mockData.sites && mockData.sites.length > 0) {
      for (const site of mockData.sites) {
        try {
          await repository.createSite({
            name: site.name,
            city: site.city,
            address: site.address,
          });
          console.log(`  ✓ Site: ${site.name}`);
        } catch (err) {
          if (err.code !== 'ER_DUP_ENTRY') {
            console.error(`  ✗ Error en site ${site.name}:`, err.message);
          }
        }
      }
    }
    console.log();

    // 4. Insertar rooms
    console.log('🚪 Insertando rooms...');
    if (mockData.rooms && mockData.rooms.length > 0) {
      for (const room of mockData.rooms) {
        try {
          await repository.createRoom({
            site_id: room.site_id,
            name: room.name,
            floor: room.floor,
          });
          console.log(`  ✓ Room: ${room.name}`);
        } catch (err) {
          console.error(`  ✗ Error en room ${room.name}:`, err.message);
        }
      }
    }
    console.log();

    // 5. Insertar racks
    console.log('📐 Insertando racks...');
    if (mockData.racks && mockData.racks.length > 0) {
      for (const rack of mockData.racks) {
        try {
          await repository.createRack({
            room_id: rack.room_id,
            code: rack.code,
            total_u: rack.total_u || 42,
          });
          console.log(`  ✓ Rack: ${rack.code}`);
        } catch (err) {
          if (err.code !== 'ER_DUP_ENTRY') {
            console.error(`  ✗ Error en rack ${rack.code}:`, err.message);
          }
        }
      }
    }
    console.log();

    // 6. Insertar devices
    console.log('⚙️  Insertando devices...');
    if (mockData.devices && mockData.devices.length > 0) {
      for (const device of mockData.devices) {
        try {
          await repository.createDevice({
            model_id: device.model_id,
            name: device.name,
            asset_tag: device.asset_tag,
            serial_number: device.serial_number,
            rack_id: device.rack_id || null,
            u_start: device.u_start || null,
            status: device.status || 'active',
            installed_at: device.installed_at || null,
          });
          console.log(`  ✓ Device: ${device.name}`);
        } catch (err) {
          console.error(`  ✗ Error en device ${device.name}:`, err.message);
        }
      }
    }
    console.log();

    // 7. Insertar occupancy
    console.log('📊 Insertando occupancy...');
    if (mockData.rack_unit_occupancy && mockData.rack_unit_occupancy.length > 0) {
      for (const occ of mockData.rack_unit_occupancy) {
        if (!occ.device_id) {
          console.warn(`  ⚠ Saltando occupancy (rack ${occ.rack_id}, unit ${occ.unit}) sin device_id`);
          continue;
        }
        try {
          await repository.createOccupancy({
            rack_id: occ.rack_id,
            unit: occ.unit,
            device_id: occ.device_id,
          });
          console.log(`  ✓ Occupancy: Rack ${occ.rack_id}, Unit ${occ.unit}`);
        } catch (err) {
          if (err.code !== 'ER_DUP_ENTRY') {
            console.error(`  ✗ Error en occupancy (rack ${occ.rack_id}, unit ${occ.unit}):`, err.message);
          }
        }
      }
    }
    console.log();

    console.log('✅ Migración completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
seedDatabase();
