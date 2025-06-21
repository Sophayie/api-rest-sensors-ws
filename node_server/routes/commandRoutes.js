const express = require('express');
const router = express.Router();
const { sendCommand } = require('../controllers/commandController');
const { auth } = require('../middlewares/authMiddleware');

// POST /api/commands
router.post('/', auth, sendCommand);

module.exports = router;
