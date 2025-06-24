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
  getUserById,
  publicRegister
} = require('../controllers/userController');

// Middleware de validation
const {
  validateUserFields, validateLoginFields
} = require('../middlewares/validationMiddleware');

// Middleware d'authentification
const { auth } = require('../middlewares/authMiddleware');

// Middleware d'administration
const { isAdmin } = require('../middlewares/adminMiddleware');

// Route publique d’inscription (devient admin)
router.post('/register', validateUserFields, publicRegister);

// GET /api/users/:id --> Récupérer un utilisateur par son ID
router.patch('/:id', auth, updateUser);  // Uniquement pour les administrateurs


// POST /api/users --> Créer un utilisateur (admin uniquement)
router.post('/', auth, isAdmin, validateUserFields, createUser);

// POST /api/users/create-admin --> Créer un administrateur
router.post('/create-admin', validateUserFields, createAdmin);

// GET /api/users --> Liste des utilisateurs
router.get('/', auth, isAdmin, getAllUsers); // Uniquement pour les administrateurs

router.get('/:id', auth, (req, res) => {
  if (req.user.isAdmin || req.user._id.toString() === req.params.id) {
    return getUserById(req, res);
  } else {
    return res.status(403).json({ message: "Accès refusé." });
  }
});

// PUT /api/users/:id --> Remplacer un utilisateur
router.put('/:id', auth, isAdmin, validateUserFields, replaceUser); // Uniquement pour les administrateurs

// POST /api/users/login --> Connexion d'un utilisateur
router.post('/login', validateLoginFields, loginUser); // Connexion libre

// DELETE /api/users/:id --> Supprimer un utilisateur
router.delete('/:id', auth, isAdmin, deleteUser); // Uniquement pour les administrateurs

module.exports = router;
