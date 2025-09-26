const Presence = require("../modls/Presence");

const saisirPresences = async (req, res) => {
  try {
    const { presences } = req.body;
    if (!Array.isArray(presences) || presences.length === 0) {
      return res.status(400).json({ succes: false, message: "Aucune présence fournie." });
    }

    const resultat = await Presence.insererPresences(presences);
    res.status(201).json(resultat);

  } catch (error) {
    console.error("Erreur dans saisirPresences :", error.message);
    res.status(500).json({ succes: false, message: "Erreur lors de l'enregistrement des présences." });
  }
};

const getPresencesParNiveauDomaine = async (req, res) => {
  const { niveau, domaine } = req.params;

  try {
    const presences = await Presence.getPresencesParNiveauDomaine(niveau, domaine);
    res.status(200).json(presences);
  } catch (err) {
    console.error("Erreur lors de la récupération des présences :", err);
    res.status(500).json({ succes: false, message: "Erreur lors de la récupération des présences." });
  }
};

const getSeanceAttendue = async (req, res) => {
  const { num_etudiant, ref_module } = req.params;

  try {
    const rows = await Presence.getSeanceAttendue(num_etudiant, ref_module);

    if (rows.length === 0) {
      return res.status(404).json({ succes: false, message: "Aucune séance attendue trouvée." });
    }

    res.status(200).json({ seance_attendue: rows[0].seance_attendue });
  } catch (error) {
    console.error("Erreur getSeanceAttendue:", error);
    res.status(500).json({ succes: false, message: "Erreur serveur." });
  }
};
const getPresenceByEtudiant = async (req, res) => {
  const { num_etudiant } = req.params;

  try {
    const presences = await Presence.getPresenceByEtudiant(num_etudiant);

    if (!presences || presences.length === 0) {
      return res.status(404).json({ succes: false, message: "Aucune présence trouvée pour cet étudiant." });
    }

    res.status(200).json(presences);
  } catch (error) {
    console.error("Erreur getPresenceByEtudiant:", error);
    res.status(500).json({ succes: false, message: "Erreur lors de la récupération des présences." });
  }
};

module.exports = { saisirPresences ,getPresencesParNiveauDomaine,getSeanceAttendue,getPresenceByEtudiant};
