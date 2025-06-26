const Measurement = require('../models/Measurement');
const { sendCommandToDevice } = require('../wsServer');
const mongoose = require('mongoose');
const Sensor = require('../models/Sensor');

// POST /api/measurements --> Ajouter une mesure
const createMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.create(req.body);

    // Recherche du capteur lié à cette mesure
    const sensor = await Sensor.findById(measurement.sensorId);

    // Si c’est une LED, on envoie la commande via WebSocket
    if (sensor?.type === 'led' && sensor.deviceId) {
      console.log('[DEBUG] sensor récupéré :', sensor);
      sendCommandToDevice(sensor.deviceId, {
        sensorId: sensor._id,
        value: measurement.value
      });

      console.log(`[WS] Commande envoyée à ${sensor.deviceId} pour LED : ${measurement.value}`);
    }

    res.status(201).json(measurement);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// GET /api/measurements --> Liste complète
const getAllMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.find().populate({
      path: 'sensorId',
      select: 'name type unit userId',
      populate: {
        path: 'userId',
        select: 'firstName lastName'
      }
    });

    res.status(200).json(measurements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/measurements/sensorId/:sensorId --> Liste des mesures pour un capteur
const getMeasurementsBySensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const measurements = await Measurement.find({ sensorId }).populate({
      path: 'sensorId',
      select: 'name type unit userId',
      populate: {
        path: 'userId',
        select: 'firstName lastName'
      }
    });

    res.status(200).json(measurements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PATCH /api/measurements/:id → Modifier la valeur d'une mesure
const updateMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Measurement.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Mesure non trouvée.' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la mesure', error: error.message });
  }
};

// PUT /api/measurements/:id --> Remplacer une mesure
const replaceMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const replaced = await Measurement.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      overwrite: true
    });

    if (!replaced) {
      return res.status(404).json({ message: 'Mesure non trouvée.' });
    }

    res.status(200).json(replaced);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors du remplacement de la mesure', error: error.message });
  }
};

// GET /api/measurements/latest/sensorId/:sensorId
const getLatestMeasurementBySensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const measurement = await Measurement.findOne({ sensorId }).sort({ takenAt: -1 });

    if (!measurement) {
      return res.status(404).json({ message: 'Aucune mesure trouvée.' });
    }

    res.status(200).json(measurement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
const deleteMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Measurement.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Mesure non trouvée.' });
    }
    res.status(200).json({ message: 'Mesure supprimée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};
module.exports = {
  createMeasurement,
  getAllMeasurements,
  getMeasurementsBySensor,
  updateMeasurement,
  replaceMeasurement,
  getLatestMeasurementBySensor,
  deleteMeasurement
};
