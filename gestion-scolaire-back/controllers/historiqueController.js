const Historique = require("../modls/historique");

const getAjoutsEtudiants = async (req, res) => {
  try {
    const data = await Historique.getAjoutsEtudiants();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des ajouts d'étudiants" });
  }
};

const getPaiementsEffectues = async (req, res) => {
  try {
    const data = await Historique.getPaiementsEffectues();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des paiements" });
  }
};

module.exports = {
  getAjoutsEtudiants,
  getPaiementsEffectues
};
