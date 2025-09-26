const db = require("../config/db");

const Documents = {
    upsert: async ({ num_etudiant, fichier, nom_document }) => {
    await db.query(
      `INSERT INTO documents (num_etudiant, nom_document, fichier, date_ajout)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         fichier = VALUES(fichier),
         date_ajout = NOW()`,
      [num_etudiant, nom_document, fichier]
    );
  },

  getdocByEtudiantAndNom: async (num_etudiant, nom_document) => {
    const [rows] = await db.query(
      'SELECT fichier FROM documents WHERE num_etudiant = ? AND nom_document = ? LIMIT 1',
      [num_etudiant, nom_document]
    );
    return rows[0];
  },

   getAllNamesByStudent: async (num_etudiant) => {
    const [rows] = await db.query(
      'SELECT nom_document FROM documents WHERE num_etudiant = ?',
      [num_etudiant]
    );
    return rows;
  }

};

module.exports = Documents;
