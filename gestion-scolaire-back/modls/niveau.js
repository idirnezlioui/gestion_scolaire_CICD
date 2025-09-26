const db = require("../config/db");
const { create, update } = require("./domaine");

const Niveau = {
  getAll: async () => {
    const [rows] = await db.query("SELECT n.id_niveau, n.niveau ,n.tarifs FROM niveau as n");
    return rows;
  },

  create: async (niveaux) => {
    const { niveau, tarifs } = niveaux;
    const [result] = await db.query(
      "INSERT INTO niveau (niveau , tarifs) VALUES (?, ?)",
      [niveau, tarifs]
    );
    return { id_niveau: result.insertId, ...niveaux };
  },
  //mettre a jour
  update: async (id_niveau, niveau, tarifs) => {
    await db.query(
      "UPDATE niveau SET niveau = ?, tarifs = ? WHERE id_niveau = ?",
      [niveau, tarifs, id_niveau]
    );
    return { id_niveau, niveau, tarifs };
  },

  //supprimer

  delete: async (id_niveau) => {
    await db.query("DELETE FROM niveau WHERE id_niveau = ?", [id_niveau]);
  },
};
module.exports = Niveau;
