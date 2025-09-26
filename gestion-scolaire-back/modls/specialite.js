const db = require("../config/db");

const Specialite = {
  getAll: async () => {
    const [rows] = await db.query(`SELECT * FROM specialites`);

    return rows;
  },

  // ajouter une specialite 

  create: async(specialite)=>{
    const { sigle_specia, intitule } = specialite;
    const [result]=await db.query("INSERT INTO specialites (sigle_specia, intitule) VALUES (?, ?)",[sigle_specia,intitule])

    return {id:result.insertId,...specialite}
  },

  update:async(sigle_specia,specialite)=>{
    const {sigle_specia: newSigle,intitule}=specialite
    await db.query("UPDATE specialites SET sigle_specia = ?, intitule = ? WHERE sigle_specia = ?",
    [newSigle, intitule, sigle_specia])
    return {sigle_specia: newSigle, intitule}
  },

  delete:async(sigle_specia)=>{
    await db.query("DELETE FROM specialites WHERE sigle_specia = ?",[sigle_specia])
  }
};

module.exports=Specialite