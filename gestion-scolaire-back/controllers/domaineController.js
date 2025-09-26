const Domaine=require("../modls/domaine")

const gettAlldomaine=async(req,res)=>{
    try {
        const domaine=await Domaine.getAll()
        res.status(200).json(domaine)
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la recuperation des domaines"})
    }
}

const createDomaine = async (req, res) => {
    const { intitule, sigle_specia } = req.body;
  
    if (!intitule || !sigle_specia) {
      return res.status(400).json({ error: "Domaine et spécialité requis" });
    }
  
    try {
      const result = await Domaine.create({ intitule, intitule_specialite: sigle_specia });
      if (result.succes) {
        res.status(201).json({
          message: result.message,
          domaineId: result.id,
        });
      } else {
        res.status(400).json({ error: result.message });
      }
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création du domaine" });
    }
  };
  const updateDomaine = async (req, res) => {
    try {
      const { id } = req.params;
      const { intitule, sigle_specia } = req.body;
      await Domaine.update(id, { intitule, sigle_specia });
      res.status(200).json({ message: "Domaine mis à jour" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
  };
  const deleteDomaine = async (req, res) => {
    try {
      const { id } = req.params;
      await Domaine.delete(id);
      res.status(200).json({ message: "Domaine supprimé" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  };
  
module.exports={gettAlldomaine,createDomaine,updateDomaine,deleteDomaine}