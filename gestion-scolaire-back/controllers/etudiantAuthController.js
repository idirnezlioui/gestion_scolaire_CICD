const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.loginEtudiant = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM etudiants WHERE email = ?", [email]);
    const etudiant = rows[0];

    if (!etudiant) {
      return res.status(401).json({ message: "Email non trouvé" });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, etudiant.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: etudiant.num_etudiant,
        email: etudiant.email,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        role: "etudiant"
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      etudiant: {
        id: etudiant.num_etudiant,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email
      }
    });
  } catch (error) {
    console.error("Erreur login étudiant :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
