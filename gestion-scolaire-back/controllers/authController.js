const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilisateur = require('../modls/utilisateurs');
const secret = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  console.log('Tentative de login détectée !');
  try {
    const mail = req.body.mail;
    const mot_pass = req.body.mot_pass ?? req.body.password;

    const result = await Utilisateur.findBymail(mail);
    const user = Array.isArray(result) ? result[0] : result;
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

    if (!mot_pass || !user.mot_pass) {
      return res.status(400).json({ message: 'Requête invalide' });
    }

    const isMatch = await bcrypt.compare(mot_pass, user.mot_pass);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user.id_utilisateur, email: user.mail, role: user.role },
      secret,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      utilisateur: { nom: user.nom, role: user.role, id: user.id_utilisateur },
    });
  } catch (err) {
    console.error('Erreur login :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /utilisateurs
exports.registerUser = async (req, res) => {
  try {
    const { nom, prenom, mail, mot_pass, diplome } = req.body; // mot_pass en clair
    await Utilisateur.create({ nom, prenom, mail, mot_pass, diplome, role: 'user' });
    res.status(201).json({ message: "Utilisateur ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout", error: err.message });
  }
};

// POST /admin
exports.registerAdmin = async (req, res) => {
  try {
    const { nom, prenom, mail, mot_pass, diplome } = req.body; // mot_pass en clair
    await Utilisateur.create({ nom, prenom, mail, mot_pass, diplome, role: 'admin' });
    res.status(201).json({ message: "Admin ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout", error: err.message });
  }
};