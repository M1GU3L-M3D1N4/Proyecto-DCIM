const repository = require('../db/repository');
const PDFDocument = require('pdfkit');

const statusLabels = {
  active: 'Activo',
  maintenance: 'Mantenimiento',
  retired: 'Retirado',
};

const sortDevicesByUnit = (items = []) => {
  return [...items].sort((a, b) => {
    const aUnit = Number(a?.u_start);
    const bUnit = Number(b?.u_start);
    const aValid = Number.isFinite(aUnit);
    const bValid = Number.isFinite(bUnit);

    if (aValid && bValid) return aUnit - bUnit;
    if (aValid) return -1;
    if (bValid) return 1;
    return 0;
  });
};

const formatDateForReport = (value) => {
  if (!value) return 'N/D';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/D';
  return date.toLocaleDateString('es-CO');
};

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

// GET /api/racks/:id/pdf
exports.exportPdf = async (req, res) => {
  try {
    const rack = await repository.getRackById(req.params.id);
    if (!rack) return res.status(404).json({ error: 'Rack not found' });

    const devices = await repository.getDevices({ rack_id: req.params.id });
    const sortedDevices = sortDevicesByUnit(devices);

    const safeRackCode = String(rack.code || `rack-${req.params.id}`).replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rack-${safeRackCode}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    doc.pipe(res);

    const drawSectionHeader = () => {
      doc.fontSize(10).fillColor('#475569').text('Equipos instalados (ordenados por U ascendente)');
      doc.moveDown(0.3);
      doc.strokeColor('#cbd5e1').moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(0.5);
    };

    doc.fontSize(20).fillColor('#0f172a').text('Reporte de Rack');
    doc.moveDown(0.2);
    doc.fontSize(10).fillColor('#64748b').text(`Generado: ${new Date().toLocaleString('es-CO')}`);
    doc.moveDown(1);

    doc.fontSize(13).fillColor('#0f172a').text('Detalle del rack');
    doc.moveDown(0.4);
    doc.fontSize(11).fillColor('#1e293b');
    doc.text(`Codigo: ${rack.code || 'N/D'}`);
    doc.text(`Sitio: ${rack.site_name || 'Sin sitio'}`);
    doc.text(`Sala: ${rack.room_name || 'Sin sala'}`);
    doc.text(`Piso: ${rack.room_floor || 'N/D'}`);
    doc.text(`Capacidad: ${rack.total_u || 0}U`);
    doc.text(`Unidades ocupadas: ${rack.used_units || 0}`);
    doc.text(`Porcentaje de uso: ${rack.used_percent || 0}%`);
    doc.moveDown(1);

    doc.fontSize(13).fillColor('#0f172a').text('Equipos instalados');
    doc.moveDown(0.5);

    if (!Array.isArray(sortedDevices) || sortedDevices.length === 0) {
      doc.fontSize(11).fillColor('#64748b').text('Este rack no tiene equipos instalados actualmente.');
      doc.end();
      return;
    }

    drawSectionHeader();

    sortedDevices.forEach((device) => {
      if (doc.y > 730) {
        doc.addPage();
        drawSectionHeader();
      }

      const deviceName = device.name || 'N/D';
      const modelName = device.model_name || 'Sin modelo';
      const vendorName = device.vendor_name || 'Sin fabricante';
      const position = device.u_start ? `U ${device.u_start}` : 'N/D';
      const status = statusLabels[device.status] || device.status || 'N/D';
      const serial = device.serial_number || 'N/D';
      const assetTag = device.asset_tag || 'N/D';
      const installedDate = formatDateForReport(device.installed_at);

      doc.fontSize(10).fillColor('#0f172a').text(`${deviceName} | ${position} | ${status}`);
      doc.fontSize(9).fillColor('#334155').text(`Modelo: ${modelName} | Fabricante: ${vendorName}`);
      doc.fontSize(9).fillColor('#334155').text(`Serial: ${serial} | Asset tag: ${assetTag} | Fecha: ${installedDate}`);
      doc.moveDown(0.25);
      doc.strokeColor('#e2e8f0').moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error('Error exporting rack PDF:', error);
    return res.status(500).json({ error: 'Error al exportar PDF de rack', details: error.message });
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
