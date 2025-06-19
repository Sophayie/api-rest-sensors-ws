const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middlewares/loggerMiddleware');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// Chargement des variables d'environnement depuis .env
dotenv.config();

const app = express();

// Middleware JSON
app.use(express.json());

// Logger
app.use(logger);

// CORS configuration manuelle
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// ✅ Correction manuelle OPTIONS compatible avec Node 22+
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.sendStatus(200);
  }
  next();
});

// Sécurité
app.use(helmet());

// Routes
const userRoutes = require('./routes/userRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const measurementRoutes = require('./routes/measurementRoutes');
const commandRoutes = require('./routes/commandRoutes');

app.use('/api/users', userRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/commands', commandRoutes);

module.exports = app;
