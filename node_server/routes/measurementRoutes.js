const express = require('express');
const router = express.Router();

const {
  createMeasurement,
  getAllMeasurements,
  getMeasurementsBySensor,
  updateMeasurement,
  replaceMeasurement,
  getLatestMeasurementBySensor
} = require('../controllers/measurementController');

const {
  validateMeasurementFields
} = require('../middlewares/validationMiddleware');

// POST /api/measurements --> Créer une mesure
router.post('/', validateMeasurementFields, createMeasurement);

// GET /api/measurements --> Récupérer toutes les mesures
router.get('/', getAllMeasurements);

// GET /api/measurements/sensorId/:sensorId --> Récupérer les mesures par sensorId
router.get('/sensorId/:sensorId', getMeasurementsBySensor);

// PATCH /api/measurements/:id --> Mettre à jour une mesure
router.patch('/:id', updateMeasurement);

// PUT /api/measurements/:id --> Remplacer une mesure
router.put('/:id',validateMeasurementFields, replaceMeasurement);

router.get('/latest/sensorId/:sensorId', getLatestMeasurementBySensor);

module.exports = router;
