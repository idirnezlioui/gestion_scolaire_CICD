const db = require("../config/db");

const Presence = {
  insererPresences: async (presences) => {
    const insertions = [];

    for (const p of presences) {
      const { num_etudiant, ref_module, numero_seance, etat, observation } = p;

      const promise = db.query(
        `INSERT INTO presence (num_etudiant, ref_module, date_seance, statut, observation)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           statut = VALUES(statut),
           observation = VALUES(observation)`,
        [num_etudiant, ref_module, numero_seance, etat, observation || null]
      );

      insertions.push(promise);
    }

    try {
      await Promise.all(insertions);
      
      return { succes: true, message: 'Présences enregistrées avec succès.' };
    } catch (error) {
      console.error("Erreur d'insertion des présences :", error);
      throw error;
    }
    
  },

  getPresencesParNiveauDomaine: async (niveau, domaine) => {
  const [rows] = await db.query(`
    SELECT 
      p.num_etudiant, p.ref_module, p.date_seance AS numero_seance, p.statut AS etat, p.observation
    FROM presence p
    JOIN etudiants e ON p.num_etudiant = e.num_etudiant
    JOIN niveau n ON e.id_niveau = n.id_niveau
    JOIN domaines d ON e.id_domaine = d.ref_domaine
    WHERE n.niveau = ? AND d.intitule = ?
    ORDER BY e.nom, e.prenom, p.ref_module, p.date_seance
  `, [niveau, domaine]);

  return rows;
},

  getSeanceAttendue: async (num_etudiant, ref_module) => {
  const [rows] = await db.query(
    `SELECT IFNULL(MAX(date_seance), 0) + 1 AS seance_attendue
     FROM presence 
     WHERE num_etudiant = ? AND ref_module = ?`,
    [num_etudiant, ref_module]
  );
  return rows;
},
getPresenceByEtudiant :async (num_etudiant) => {
  
    const [rows] = await db.query(
      "SELECT * FROM presence WHERE num_etudiant = ?",
      [parseInt(num_etudiant)]);
      return rows;
}

}

module.exports = Presence;
