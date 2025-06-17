const mongoose = require('mongoose');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../config/.env') });

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