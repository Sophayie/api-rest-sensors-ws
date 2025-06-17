const express = require('express');
const router = express.Router();

// Contrôleur utilisateur 
const {
  createUser,
  getAllUsers,
  updateUser,
  replaceUser,
  loginUser,
  deleteUser,
  getUserById
} = require('../controllers/userController');

// Middleware de validation
const {
  validateUserFields, validateLoginFields
} = require('../middlewares/validationMiddleware');

router.get('/:id', getUserById); 

// POST /api/users --> Ajouter un utilisateur
router.post('/', validateUserFields, createUser);

// GET /api/users --> Liste des utilisateurs
router.get('/', getAllUsers);

// PATCH /api/users/:id --> Modifier un ou plusieurs champs
router.patch('/:id', updateUser);

// PUT /api/users/:id --> Remplacer un utilisateur
router.put('/:id',validateUserFields, replaceUser);

router.post('/login', validateLoginFields, loginUser);

router.delete('/:id', deleteUser);

module.exports = router;
