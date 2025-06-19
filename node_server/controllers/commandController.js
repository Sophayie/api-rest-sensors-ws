const { sendCommandToDevice } = require('../wsServer');

// POST /api/commands
const sendCommand = (req, res) => {
  const { deviceId, sensorId, value } = req.body;

  if (!deviceId || !sensorId || value === undefined) {
    return res.status(400).json({ message: 'Champs deviceId, sensorId et value requis.' });
  }

  sendCommandToDevice(deviceId, { sensorId, value });
  res.status(200).json({ message: 'Commande envoyée avec succès.' });
};

module.exports = {
  sendCommand
};
