const validateUserFields = (req, res, next) => {
  const { firstName, lastName, email, motdepasse } = req.body;

  if (!firstName || !lastName || !email || !motdepasse) {
    return res.status(400).json({ message: 'Tous les champs (prénom, nom, email, mot de passe) sont requis.' });
  }

  // Vérifie le format de l’email
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Format d\'email invalide.' });
  }

  // Vérifie que le mot de passe a au moins 4 caractères
  if (motdepasse.length < 4) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 4 caractères.' });
  }

  next();
};

// Validation pour le loggin
const validateLoginFields = (req, res, next) => {
  const { email, motdepasse } = req.body;

  if (!email || !motdepasse) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  next();
};

// Validation pour la création d’un capteur
function validateSensorFields(req, res, next) {
  const { name, type, unit, userId } = req.body;

  if (!name || !type || !userId) {
    return res.status(400).json({ error: 'Les champs name, type et userId sont requis.' });
  }

  const allowedTypes = ['temperature', 'humidity', 'led'];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: `Le type '${type}' n'est pas autorisé.` });
  }

  // Vérifie unit uniquement si type ≠ led
  if (type !== 'led' && !unit) {
    return res.status(400).json({ error: 'Le champ unit est requis pour ce type de capteur.' });
  }

  next();
}

// Validation pour la création d’une mesure
const validateMeasurementFields = (req, res, next) => {
  const { sensorId, value, takenAt, deviceId, userId } = req.body;

  if (!sensorId || value === undefined || !takenAt || !deviceId || !userId) {
    return res.status(400).json({
      message: 'Les champs sensorId, value, takenAt, deviceId et userId sont requis.'
    });
  }

  if (typeof value !== 'number' || value < 0) {
    return res.status(400).json({
      message: 'La valeur doit être un nombre positif.'
    });
  }

  next();
};

module.exports = {
  validateUserFields,
  validateLoginFields,
  validateSensorFields,
  validateMeasurementFields,
};
