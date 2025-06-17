const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Chargement des variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

// Lecture du port dans .env ou fallback sur 3000
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
