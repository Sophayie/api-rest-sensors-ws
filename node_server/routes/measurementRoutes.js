const express = require('express');
const router = express.Router();

const {
  createMeasurement,
  getAllMeasurements,
  getMeasurementsBySensor,
  updateMeasurement,
  replaceMeasurement,
  getLatestMeasurementBySensor,
  deleteMeasurement 
} = require('../controllers/measurementController');

const {
  validateMeasurementFields
} = require('../middlewares/validationMiddleware');

const { auth } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// POST /api/measurements --> Créer une mesure
router.post('/', auth, isAdmin, validateMeasurementFields, createMeasurement); // Uniquement pour les administrateurs

// GET /api/measurements --> Récupérer toutes les mesures
router.get('/', auth, isAdmin, getAllMeasurements); // Uniquement pour les administrateurs

// GET /api/measurements/sensorId/:sensorId --> Récupérer les mesures par sensorId
router.get('/sensorId/:sensorId', auth, getMeasurementsBySensor); 

// PATCH /api/measurements/:id --> Mettre à jour une mesure
router.patch('/:id', auth, isAdmin, updateMeasurement); // Uniquement pour les administrateurs

// PUT /api/measurements/:id --> Remplacer une mesure
router.put('/:id', auth, isAdmin, validateMeasurementFields, replaceMeasurement); // Uniquement pour les administrateurs

router.get('/latest/sensorId/:sensorId', auth, getLatestMeasurementBySensor);

// DELETE /api/measurements/:id → Supprimer une mesure
router.delete('/:id', auth, isAdmin, deleteMeasurement);

module.exports = router;
