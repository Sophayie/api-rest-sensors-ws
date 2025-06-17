const User = require('../models/User');

// POST /api/users --> Créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, motdepasse } = req.body;

    const newUser = await User.create({ firstName, lastName, email, motdepasse });
    res.status(201).json({
    _id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    message: 'Inscription réussie'
});
  } catch (error) {
    if (error.code === 11000) {
      // Erreur liée à la contrainte d’unicité de l’email
      res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    } else {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
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

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // renvoie l'utilisateur mis à jour
      runValidators: true, // obligatoire pour forcer la validation du schéma
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.', error: error.message });
  }
};

// PUT /api/users/:id --> Mettre à jour un utilisateur entièrement
const replaceUser = async (req, res) => {
  try {
    const { id } = req.params;

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

const loginUser = async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.motdepasse !== motdepasse) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    res.status(200).json({
      _id: user._id,             
      firstName: user.firstName,
      message: 'Connexion réussie'
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /api/users/:id --> Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé.' });
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
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  replaceUser,
  loginUser,
  deleteUser,
  getUserById,
};
