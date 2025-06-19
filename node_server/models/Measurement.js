const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,   // Ce champ sensorId contiendra un identifiant _id d'un document qui vient de la collection sensors
    ref: 'Sensor',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: [true, 'La valeur est requise'],
    min: [0, 'La valeur doit être positive']
  },
  takenAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Measurement', measurementSchema);
