const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connexion à MongoDB réussie.');
  } catch (err) {
    console.error('Échec de la connexion à MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
