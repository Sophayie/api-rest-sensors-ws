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
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Sécurité
app.use(helmet());

// Routes
const userRoutes = require('./routes/userRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const measurementRoutes = require('./routes/measurementRoutes');

app.use('/api/users', userRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/measurements', measurementRoutes);

module.exports = app;
