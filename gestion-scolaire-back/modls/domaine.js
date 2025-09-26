const db = require("../config/db");

const Domaine = {
  getAll: async () => {
    const [rows] = await db.query(" SELECT d.ref_domaine, d.intitule, s.intitule AS sigle_specia FROM domaines d LEFT JOIN specialites s ON d.sigle_sp = s.sigle_specia;");
    return rows;
  },
  create: async (domaine) => {
    const { intitule, intitule_specialite } = domaine;
    //recuperation du sigle de la spécialité
    try {
        const [specialiteResult] = await db.query(
            "SELECT sigle_specia FROM specialites WHERE intitule = ?",
            [intitule_specialite]
          );
      if (specialiteResult.length === 0) {
        console.log(specialiteResult);
        throw new Error("specialite introuvable");
      }
      const sigle_sp = specialiteResult[0].sigle_specia;

      //reqeutte insertion
      const [result] = await db.query(
        `INSERT INTO domaines( intitule, sigle_sp) VALUES (?,?)`,
        [intitule, sigle_sp]
      );
      return {
        succes: true,
        message: "domaine ajouter avec succe",
        id: result.insertId,
      };
    } catch (error) {
      console.error(
        "Erreure de lors de l'insertion du domaine ",
        error.message
      );
      return { succes: false, message: error.message };
    }
  },

  update: async (id, domaine) => {
    const { intitule, sigle_specia } = domaine;

    try {
      // On récupère le sigle à partir de l’intitulé reçu du frontend
      const [specialiteResult] = await db.query(
        "SELECT sigle_specia FROM specialites WHERE intitule = ?",
        [sigle_specia]
      );
    
      if (specialiteResult.length === 0) {
        throw new Error("Spécialité introuvable");
      }
    
      const sigle_sp = specialiteResult[0].sigle_specia;
    
      await db.query(
        "UPDATE domaines SET intitule = ?, sigle_sp = ? WHERE ref_domaine = ?",
        [intitule, sigle_sp, id]
      );
    
      return {
        succes: true,
        message: "Domaine mis à jour avec succès",
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du domaine :", error.message);
      return { succes: false, message: error.message };
    }
  },
  
  

  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM domaines WHERE ref_domaine = ?",
      [id]
    );
    return result;
  },
};
module.exports = Domaine;
