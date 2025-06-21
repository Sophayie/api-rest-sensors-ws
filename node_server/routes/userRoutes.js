const express = require('express');
const router = express.Router();

// Contrôleur utilisateur 
const {
  createUser,
  createAdmin,
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

// Middleware d'authentification
const { auth } = require('../middlewares/authMiddleware');

// Middleware d'administration
const { isAdmin } = require('../middlewares/adminMiddleware');

// GET /api/users/:id --> Récupérer un utilisateur par son ID
router.get('/:id', auth, isAdmin, getUserById);  // Uniquement pour les administrateurs

// POST /api/users --> Ajouter un utilisateur
router.post('/', auth, isAdmin, validateUserFields, createUser);  // Uniquement pour les administrateurs

// POST /api/users/create-admin --> Créer un administrateur
router.post('/create-admin', validateUserFields, createAdmin); 

// GET /api/users --> Liste des utilisateurs
router.get('/', auth, isAdmin, getAllUsers); // Uniquement pour les administrateurs

// PATCH /api/users/:id --> Modifier un ou plusieurs champs
router.patch('/:id', auth, isAdmin, updateUser); // Uniquement pour les administrateurs

// PUT /api/users/:id --> Remplacer un utilisateur
router.put('/:id', auth, isAdmin, validateUserFields, replaceUser); // Uniquement pour les administrateurs

// POST /api/users/login --> Connexion d'un utilisateur
router.post('/login', validateLoginFields, loginUser); // Connexion libre

// DELETE /api/users/:id --> Supprimer un utilisateur
router.delete('/:id', auth, isAdmin, deleteUser); // Uniquement pour les administrateurs

module.exports = router;
