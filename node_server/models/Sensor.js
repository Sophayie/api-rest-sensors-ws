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
    enum: ['temperature', 'humidity', 'led'],
  },
  unit: {
    type: String,
    required: function () {
      return this.type !== 'led';
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {                                
    type: String,
    required: false
  }
}, {
  timestamps: true                           
});

module.exports = mongoose.model('Sensor', sensorSchema);
