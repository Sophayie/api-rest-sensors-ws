const express = require('express');
const router = express.Router();

const {
  createSensor,
  getAllSensors,
  getSensorsByUser,
  getSensorById,
  updateSensor,
  replaceSensor,
  deleteSensor,
} = require('../controllers/sensorController');

const {
  validateSensorFields
} = require('../middlewares/validationMiddleware');

// POST /api/sensors --> Créer un capteur 
router.post('/', validateSensorFields, createSensor);

// GET /api/sensors --> Liste des capteurs
router.get('/', getAllSensors);

// GET /api/sensors/user/:userId --> Liste des capteurs d'un utilisateur
router.get('/userId/:userId', getSensorsByUser);

router.get('/:id', getSensorById);

// PATCH /api/sensors/:id --> Modifier un capteur
router.patch('/:id', updateSensor);

// PUT /api/sensors/:id --> Remplacer un capteur
router.put('/:id', validateSensorFields, replaceSensor);

router.delete('/:id', deleteSensor);

module.exports = router;
