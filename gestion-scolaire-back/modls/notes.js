const db = require("../config/db");
const Notes = {
  getModulesByEtudiant: async (num_etudiant) => {
    const [rows] = await db.query(
      "SELECT * FROM modules_etudiant WHERE num_etudiant = ?",
      [num_etudiant]
    );
    return rows;
  },

  //recupère les notes déja enregistre pour un etudiant 

  getNotesByEtudiant:async(num_etudiant)=>{
    const [rows]=await db.query('SELECT n.ref_note, n.ref_module, n.num_etudiant, n.note, m.intitule FROM notes AS n JOIN modules AS m ON n.ref_module = m.ref_module WHERE n.num_etudiant = ?',
      [num_etudiant])
    return rows
  },

  //inseret une nouvelle note
  insertNotes:async({  ref_module, num_etudiant, note })=>{
    await db.query('INSERT INTO notes ( ref_module, num_etudiant, note) VALUES ( ?, ?, ?)',
      [ ref_module, num_etudiant, note])
  },

  //mis a jours une note existante 
  updateNote:async({ ref_module, num_etudiant, note })=>{
    await db.query('UPDATE notes SET note = ? WHERE ref_module = ? AND num_etudiant = ?',
      [note, ref_module, num_etudiant])
  }


};

module.exports = Notes;
