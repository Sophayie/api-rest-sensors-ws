const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du capteur est requis'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Le type est requis'],
    enum: ['temperature', 'humidity', 'led'], // à adapter selon nos capteurs
  },
  unit: {
    type: String,
    required: function () {
      return this.type !== 'led'; // facultatif pour la led
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Ce champ userId contiendra un identifiant (_id) d’un document qui vient de la collection users
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // ajoute createdAt et updatedAt
});

module.exports = mongoose.model('Sensor', sensorSchema);
