const db=require("../config/db")


const ProfModule={
    getAll:async()=>{
        const [rows]=await db.query(`SELECT * FROM profs_modules`)
        return rows
    },
    createAffectation: async (id_prof, ref_module, id_niveau) => {
  // Vérifier si l'affectation existe déjà
  const [existing] = await db.query(
    `SELECT * FROM profs_modules WHERE id_prof = ? AND ref_module = ? AND id_niveau = ?`,
    [id_prof, ref_module, id_niveau]
  );

  if (existing.length > 0) {
    // L'affectation existe déjà, on ne fait rien ou on peut retourner un message
    return { message: "Affectation déjà existante", affectedRows: 0 };
  }

  // Sinon, on insère
  const [result] = await db.query(
    `INSERT INTO profs_modules (id_prof, ref_module, id_niveau, date_affectation)
     VALUES (?, ?, ?, CURDATE())`,
    [id_prof, ref_module, id_niveau]
  );

  return result;
},

getByProf: async (id_prof) => {
  const [rows] = await db.query(
    `SELECT ref_module, id_niveau FROM profs_modules WHERE id_prof = ?`,
    [id_prof]
  );
  return rows;
},
deleteByModule: async (id_prof, ref_module) => {
  const [result] = await db.query(
    `DELETE FROM profs_modules WHERE id_prof = ? AND ref_module = ?`,
    [id_prof, ref_module]
  );
  return result;
},

deleteByNiveau: async (id_prof, id_niveau) => {
  const [result] = await db.query(
    `DELETE FROM profs_modules WHERE id_prof = ? AND id_niveau = ?`,
    [id_prof, id_niveau]
  );
  return result;
},
 deleteSingle: async ({ id_prof, ref_module, id_niveau }) => {
    const sql = `
      DELETE FROM profs_modules 
      WHERE id_prof = ? AND ref_module = ? AND id_niveau = ?
    `;
    return await db.query(sql, [id_prof, ref_module, id_niveau]);
  }


}

module.exports=ProfModule