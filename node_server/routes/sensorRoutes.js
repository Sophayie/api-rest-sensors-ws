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

const { auth } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// POST /api/sensors --> Créer un capteur 
router.post('/', auth, isAdmin, validateSensorFields, createSensor); // Uniquement pour les administrateurs

// GET /api/sensors --> Liste des capteurs
router.get('/', auth, isAdmin, getAllSensors); // Uniquement pour les administrateurs

// GET /api/sensors/user/:userId --> Liste des capteurs d'un utilisateur
router.get('/userId/:userId', auth, getSensorsByUser);

router.get('/:id', auth, getSensorById);

// PATCH /api/sensors/:id --> Modifier un capteur
router.patch('/:id', auth, isAdmin, updateSensor); // Uniquement pour les administrateurs

// PUT /api/sensors/:id --> Remplacer un capteur
router.put('/:id', auth, isAdmin, validateSensorFields, replaceSensor); // Uniquement pour les administrateurs

// DELETE /api/sensors/:id --> Supprimer un capteur
router.delete('/:id', auth, isAdmin, deleteSensor); // Uniquement pour les administrateurs

module.exports = router;
