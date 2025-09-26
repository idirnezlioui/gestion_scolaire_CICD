const Profs=require("../modls/profs")

const gettAllProfs=async(req,res)=>{
    try {
        const profs=await Profs.getAll()
        res.status(200).json(profs)
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la recupération des profs"})
        
    }
}

const createProf = async (req, res) => {
  try {
    const newProf = await Profs.createProf(req.body);
    res.status(201).json(newProf);
  } catch (error) {
    console.error("Erreur SQL :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du professeur" });
  }
};

const updateProf = async (req, res) => {
  const id = req.params.id;
  try {
    await Profs.updateProf(id, req.body);
    res.status(200).json({ success: true, message: "Professeur mis à jour" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification du professeur" });
  }
};

const deleteProf = async (req, res) => {
  const id = req.params.id;
  try {
    await Profs.deleteProf(id);
    res.status(200).json({ success: true, message: "Professeur supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du professeur" });
  }
};

const getProfById = async (req, res) => {
  const id = req.params.id;
  try {
    const prof = await Profs.getById(id);
    res.status(200).json(prof);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du professeur" });
  }
};


module.exports={gettAllProfs,createProf,updateProf,deleteProf,getProfById}