const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true                               // Supprime les espaces inutiles
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true                               // Supprime les espaces inutiles
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,                            // Assure que l'email est unique
    lowercase: true,                         // Convertit l'email en minuscules 
    trim: true,                              // Supprime les espaces inutiles
    match: [/\S+@\S+\.\S+/, 'Format d\'email invalide'] // Validation de format d'email
  },
  motdepasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [4, 'Le mot de passe doit contenir au moins 4 caractères']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  serre: {
    nom: { type: String, default: '' } //  Nouveau champ pour le nom de la serre
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('User', userSchema);

// ajout de validations supplémentaires côté base de données pour une couche de sécurité supplémentaire