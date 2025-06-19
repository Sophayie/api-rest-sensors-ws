const WebSocket = require('ws');
const dotenv = require('dotenv');
const Sensor = require('./models/Sensor');
const Measurement = require('./models/Measurement');
const User = require('./models/User');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement (.env)
dotenv.config();

const WS_PORT = process.env.WS_PORT || 3002;
const AUTHORIZED_DEVICE_ID = 'rpi-007'; // ID attendu depuis le client RPi

// Journal des commandes
const logFilePath = path.join(__dirname, 'journal.log');

// Dictionnaire pour stocker les clients connectés
const connectedClients = {}; // ex: { "rpi-007": ws }

const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`WebSocket Server lancé sur ws://localhost:${WS_PORT}`);
});

// Écoute des connexions entrantes
wss.on('connection', (ws) => {
  console.log("[+] Nouvelle connexion WebSocket...");

  let deviceId = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      // Étape 1 : Authentifier le client avec son deviceId
      if (data.deviceId && !deviceId) {
        if (data.deviceId !== AUTHORIZED_DEVICE_ID) {
          console.warn(`[!] Connexion refusée : deviceId non autorisé (${data.deviceId})`);
          ws.close();
          return;
        }

        deviceId = data.deviceId;
        connectedClients[deviceId] = ws;
        console.log(`[✓] Connexion autorisée pour ${deviceId}`);
        return;
      }

      // Étape 2 : réception de mesure
      if (data.sensorId && data.value !== undefined) {
        const { sensorId, value, takenAt } = data;

        // Journaliser réception
        const logEntry = `${new Date().toISOString()} - From ${deviceId} : ${JSON.stringify(data)}\n`;
        fs.appendFileSync(logFilePath, logEntry);

        // Vérifier si le capteur existe
        const sensor = await Sensor.findById(sensorId).populate('user');
        if (!sensor) {
          console.warn(`[!] SensorId inconnu : ${sensorId}`);
          return;
        }

        // Créer et enregistrer la mesure
        const newMeasurement = new Measurement({
          sensorId,
          userId: sensor.user._id,
          deviceId,
          value,
          takenAt: takenAt || new Date().toISOString()
        });

        await newMeasurement.save();
        console.log(`[✓] Mesure enregistrée : ${value} (${sensor.name}) pour ${sensor.user.email}`);
      }

    } catch (err) {
      console.error("[!] Erreur message WebSocket :", err.message);
    }
  });

  ws.on('close', () => {
    console.log(`[-] Connexion fermée pour ${deviceId || 'inconnu'}`);
    if (deviceId && connectedClients[deviceId]) {
      delete connectedClients[deviceId];
    }
  });
});


// Fonction pour envoyer une commande à un device
function sendCommandToDevice(deviceId, payload) {
  const client = connectedClients[deviceId];
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(payload));
    console.log(`[⮞] Commande envoyée à ${deviceId} :`, payload);

    // Journaliser envoi
    const logEntry = `${new Date().toISOString()} - To ${deviceId} : ${JSON.stringify(payload)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
  } else {
    console.warn(`[!] Aucun client connecté pour ${deviceId}`);
  }
}

module.exports = {
  sendCommandToDevice
};
