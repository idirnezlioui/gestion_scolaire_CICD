const db = require("../config/db");

const Historique = {
  getAjoutsEtudiants: async () => {
    const [rows] = await db.query(`
      SELECT 
        u.id_utilisateur,
        u.nom AS nom_utilisateur,
        u.prenom AS prenom_utilisateur,
        e.num_etudiant,
        e.nom AS nom_etudiant,
        e.prenom AS prenom_etudiant,
        e.date_inse AS date_ajout_etudiant
      FROM etudiants e
      JOIN utilisateurs u ON e.id_utilisateur = u.id_utilisateur
    `);
    return rows;
  },

  getPaiementsEffectues: async () => {
    const [rows] = await db.query(`
      SELECT 
        u.id_utilisateur,
        u.nom AS nom_utilisateur,
        e.num_etudiant,
        e.nom AS nom_etudiant,
        p.date_paiement
      FROM paiements p
      JOIN utilisateurs u ON p.id_utilisateur = u.id_utilisateur
      JOIN etudiants e ON p.id_etudiant = e.num_etudiant
      ORDER BY p.date_paiement DESC
    `);
    return rows;
  }
};

module.exports = Historique;
