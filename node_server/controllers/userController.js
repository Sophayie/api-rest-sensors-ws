require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// POST /api/users --> Créer un utilisateur
const createUser = async (req, res) => {
  try {
    const data = { ...req.body };

    // Hacher le mot de passe s’il est présent
    if (data.motdepasse) {
      data.motdepasse = await bcrypt.hash(data.motdepasse, 10);
    }

    // Forcer isAdmin à false si tu veux
    data.isAdmin = false;

    const newUser = await User.create(data);

    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      serre: newUser.serre,
      message: 'Utilisateur créé avec succès'
    });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// POST /api/users/create-admin --> Créer un administrateur
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, motdepasse } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    // Création avec le rôle admin
    const newAdmin = await User.create({
      firstName,
      lastName,
      email,
      motdepasse: hashedPassword,
      isAdmin: true,
    });

    res.status(201).json({
      _id: newAdmin._id,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
      email: newAdmin.email,
      isAdmin: true,
      message: 'Administrateur créé avec succès',
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/users --> Lister tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// PATCH /api/users/:id --> Mettre à jour un utilisateur partiellement
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.isAdmin;
    const userIdFromToken = req.user._id;

    // Si ce n’est pas un admin, on autorise uniquement la modification du nom de la serre de son propre compte
    if (!isAdmin) {
      if (userIdFromToken.toString() !== id) {
        return res.status(403).json({ message: "Vous ne pouvez modifier que votre propre compte." });
      }

      if (!req.body.serre || typeof req.body.serre.nom !== 'string') {
        return res.status(403).json({ message: "Seule la modification du nom de la serre est autorisée." });
      }

      // on ne garde que serre.nom
      req.body = { serre: { nom: req.body.serre.nom } };
    }

    // Hash du mot de passe si présent (optionnel pour admin seulement)
    if (req.body.motdepasse) {
      req.body.motdepasse = await bcrypt.hash(req.body.motdepasse, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour.", error: error.message });
  }
};

// PUT /api/users/:id --> Mettre à jour un utilisateur entièrement
const replaceUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Hacher le nouveau mot de passe si présent
    if (req.body.motdepasse) {
      req.body.motdepasse = await bcrypt.hash(req.body.motdepasse, 10);
    }

    const replacedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // renvoie l'utilisateur mis à jour
      runValidators: true, // obligatoire pour forcer la validation du schéma
      overwrite: true, // remplace l'utilisateur entièrement
    });

    if (!replacedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(replacedUser);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors du remplacement de l\'utilisateur.', error: error.message });
  }
};

// POST /api/users/login --> Connexion d'un utilisateur
const loginUser = async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = generateToken(user._id);
    console.log('Token généré :', token);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token, // Ajout du token JWT
      message: 'Connexion réussie'
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/users/:id --> Supprimer un utilisateur
const Sensor = require('../models/Sensor'); //  n'oublie d'importer le modèle

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Supprimer les capteurs liés à ce user
    await Sensor.deleteMany({ userId: id });

    // Supprimer l'utilisateur
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ message: 'Utilisateur et capteurs supprimés.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      serre: user.serre
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
// POST /api/users --> Inscription publique
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, motdepasse } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      motdepasse: hashedPassword
    });

    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      message: 'Inscription réussie'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
// POST /api/users/register --> Inscription publique (devient admin)
const publicRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, motdepasse } = req.body;
    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    // Génération automatique du nom de serre
    const suffixe = Math.floor(Math.random() * 1000);
    const nomSerre = `Serre_${firstName}_${suffixe}`;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      motdepasse: hashedPassword,
      isAdmin: true,
      serre: {
        nom: nomSerre
      }
    });

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      isAdmin: true,
      serre: newUser.serre,
      message: "Inscription réussie (admin)"
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


module.exports = {
  createUser,
  createAdmin,
  getAllUsers,
  updateUser,
  replaceUser,
  loginUser,
  deleteUser,
  getUserById,
  registerUser,
  publicRegister
};
