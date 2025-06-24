const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const app = require('./app'); 

// Chargement du fichier .env
dotenv.config();
console.log(process.env.PORT);

// Connexion à MongoDB
connectDB();

// Lancement du serveur HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

// Si tu démarres aussi WebSocket
require('./wsServer');