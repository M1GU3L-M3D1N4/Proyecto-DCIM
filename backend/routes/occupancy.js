// Rutas para `occupancy` - ocupación por unidad (U) en racks.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/occupancy');

/*
	Rutas `rack_unit_occupancy`

	Propósito: exponer ocupación por unidad (U) en racks. Ejemplos:
	- GET /api/occupancy?rack_id=1
	- GET /api/occupancy/rack/1
*/

router.get('/', controller.list);
router.get('/rack/:rackId', controller.getByRack);

module.exports = router;
