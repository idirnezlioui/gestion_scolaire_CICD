const { create } = require("../modls/etudiant");
const Paiment = require("../modls/paiement");

const gettAllPaiement = async (req, res) => {
  try {
    const paiment = await Paiment.getAll();
    res.status(200).json(paiment);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération de la liste des paiements",
    });
  }
};

// Fonction pour ajouter un paiement
const createPaiement = async (req, res) => {
  try {
    console.log("Données reçues par le backend :", req.body);

    // Appel direct au modèle
    const result = await Paiment.create(req.body);
    res.status(201).json(result);

  } catch (error) {
    console.error("Erreur lors de la création du paiement :", error.message);
    res.status(400).json({ error: error.message }); //  400 si erreur métier
  }
};

const getPaiementsSemaineProchaine = async (req, res) => {
  try {
    const alertes = await Paiment.getPaiementsSemaineProchaine();
    res.status(200).json(alertes);
  } catch (error) {
    console.error("Erreur alerte paiement :", error.message);
    res.status(500).json({ error: "Erreur serveur - paiements à venir" });
  }
};




module.exports = { gettAllPaiement, createPaiement ,getPaiementsSemaineProchaine};
