const Niveau = require("../modls/niveau");

const gettAllNiveau = async (req, res) => {
  try {
    const niveaux = await Niveau.getAll();
    res.status(200).json(niveaux);
  } catch (error) {
    console.error("Erreur getAll:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des niveaux" });
  }
};

const createNiveau = async (req, res) => {
  try {
    const { niveau, tarifs } = req.body;

    if (!niveau || tarifs === undefined || isNaN(tarifs)) {
      return res.status(400).json({ error: "Champs niveau ou tarifs invalides" });
    }

    const nouveau = await Niveau.create({ niveau, tarifs });
    res.status(201).json(nouveau);
  } catch (error) {
    console.error("Erreur create:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du niveau" });
  }
};

const deleteNiveau = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    await Niveau.delete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur delete:", error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};

const updateNiveau = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { niveau, tarifs } = req.body;

    if (!id || !niveau || tarifs === undefined || isNaN(tarifs)) {
      return res.status(400).json({ error: "Champs manquants ou invalides" });
    }

    const maj = await Niveau.update(id, niveau, tarifs);
    res.status(200).json(maj);
  } catch (error) {
    console.error("Erreur update:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

module.exports = {
  gettAllNiveau,
  createNiveau,
  deleteNiveau,
  updateNiveau,
};
