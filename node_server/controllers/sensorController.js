const Sensor = require('../models/Sensor'); 

// POST /api/sensors --> Créer un capteur
const createSensor = async (req, res) => {
  console.log('Données reçues :', req.body);
  try {
    const sensor = await Sensor.create(req.body);
    res.status(201).json(sensor);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// GET /api/sensors --> Liste de tous les capteurs
const getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find()
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/sensors/:id --> Obtenir un capteur par ID 
const getSensorById = async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id).populate('userId', 'firstName lastName');
    if (!sensor) {
      return res.status(404).json({ message: 'Capteur introuvable' });
    }
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/sensors/userId/:userId --> Capteurs d’un utilisateur
const getSensorsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // L'utilisateur connecté n'est pas admin → il ne peut accéder qu'à ses propres capteurs
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit à ces capteurs." });
    }
    
    const sensors = await Sensor.find({ userId }).populate('userId', 'firstName lastName');
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PATCH /api/sensors/:id --> Mise à jour partielle (changer nom par exemple)
const updateSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Sensor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Capteur non trouvé.' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// PUT /api/sensors/:id --> Remplacement complet
const replaceSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const replaced = await Sensor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      overwrite: true
    });

    if (!replaced) {
      return res.status(404).json({ message: 'Capteur non trouvé.' });
    }

    res.status(200).json(replaced);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors du remplacement', error: error.message });
  }
};

// DELETE /api/sensors/:id --> Supprimer un capteur
const deleteSensor = async (req, res) => {
  try {
    const deleted = await Sensor.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Capteur non trouvé.' });
    }
    res.status(200).json({ message: 'Capteur supprimé.', deleted });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  createSensor,
  getAllSensors,
  getSensorById,       
  getSensorsByUser,
  updateSensor,
  replaceSensor,
  deleteSensor
};
