const db = require("../config/db");
const { getAll } = require("./etudiant");

const Profs = {
  getAll: async () => {
    const [rows] = await db.query(`SELECT * FROM profs;`);
    return rows;
  },
  createProf: async (prof) => {
    const { nom, prenom, email, numero_telephone, domaine_enseignement } = prof;
    const [result] = await db.query(
      `INSERT INTO profs (nom, prenom, email, numero_telephone, domaine_enseignement)
       VALUES (?, ?, ?, ?, ?)`,
      [nom, prenom, email, numero_telephone, domaine_enseignement]
    );
    return {id_prof:result.insertId,...prof}
  },
  updateProf: async (id, prof) => {
  const { nom, prenom, email, numero_telephone, domaine_enseignement } = prof;
  await db.query(
    `UPDATE profs SET nom = ?, prenom = ?, email = ?, numero_telephone = ?, domaine_enseignement = ?
     WHERE id_prof = ?`,
    [nom, prenom, email, numero_telephone, domaine_enseignement, id]
  );
},
deleteProf: async (id) => {
  await db.query(`DELETE FROM profs WHERE id_prof = ?`, [id]);
},
getById: async (id) => {
  const [rows] = await db.query(`SELECT * FROM profs WHERE id_prof = ?`, [id]);
  return rows[0];
}


};

module.exports=Profs
