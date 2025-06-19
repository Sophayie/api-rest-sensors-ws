const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Non autorisé : utilisateur non identifié." });
    }

    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit : administrateur requis." });
    }

    next();
  } catch (err) {
    console.error("Erreur middleware admin :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = isAdmin;
