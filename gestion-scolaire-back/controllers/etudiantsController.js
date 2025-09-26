const Etudiant=require("../modls/etudiant")

const getAlletudiants=async(req,res)=>{
    try {
        const etudiant=await Etudiant.getAll()
        res.status(200).json(etudiant)
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la récupération des étudiants"})

    }
}

const getEtudiantById =async(req,res)=>{
    try {
        const etudiant=await Etudiant.getById(req.params.id)
        if (!etudiant) {
            return res.status(404).json({error:"Etudiant non trouve"})
        }
        res.status(200).json({etudiant})
        
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la recupération de l'etudiant"})
    }
}

const getEtudiantByNom=async(req,res)=>{
    try {
        const etudiants=await Etudiant.getByNom(req.params.nom)
        if (etudiants.length ===0) {
            return res.status(404).json({error:"Aucun etudiant trouve avec se nom"})
        }
        res.status(200).json({etudiants})
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la recherche de l'etudiant"})
    }
}

const getEtudiantByNiveau=async(req,res)=>{
    try {
        const etudiants=await Etudiant.getByNiveau(req.params.niveau)
        if (etudiants.length === 0) {
            return res.status(404).json({error:"Aucun etudiant trouvé pour ce niveau"})
        }
        res.status(200).json({etudiants})
    } catch (error) {
        res.status(500).json({error:"Erreur lors de la recuperation des etudiants par niveau"})
    }
}

const getEtudiantBySession=async(req,res)=>{
    try{
        const {type_session}=req.params
    if (!type_session) {
        return res.status(400).json({error:"le type de session est requi"})
    }


    const etudiants=await Etudiant.getBySession(type_session)
    if (etudiants.length === 0) {
        return res.status(404).json({error:"aucun etudiant trouvé pour cette session"})
    }
    res.status(200).json(etudiants)

    }
    catch(error){
        console.error("Erreure",error)
        res.status(500).json({error:"Erreure lors de la recuperation des etudiants par type de session"})

    }
    
}



const createEtudiant = async (req, res) => {
  try {
    console.log("Requête reçue :", req.body);  
    const newEtudiant = await Etudiant.create(req.body,req.user.id);
    if (!newEtudiant.succes) {
      return res.status(400).json({ error: newEtudiant.message });
    }
    res.status(200).json({ message: "Etudiant créé avec succès", newEtudiant });
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }

  console.log("utilisateur connecté:", req.user);
};

const updateEtudiant = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Etudiant.update(id, req.body);
    if (!result.succes) {
      return res.status(400).json({ error: result.message });
    }
    res.status(200).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
  }
};

const getSeancesEtudiants = async (req, res) => {
  const { niveau, domaine } = req.params;
  try {
    const result = await Etudiant.getSeancesByNiveauEtDomaine(niveau, domaine);
    if (result.length === 0) {
      return res.status(404).json({ error: "Aucun étudiant trouvé pour ce niveau et domaine" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des séances des étudiants :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
};

// controllers/etudiantsController.js
const updatePersonal = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Etudiant.updatePersonal(id, req.body);
    if (!result.succes) {
      return res.status(400).json({ error: result.message });
    }
    res.status(200).json({ message: "Informations personnelles mises à jour avec succès" });
  } catch (error) {
    console.error("Erreur updatePersonal:", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
  }
};




module.exports={getAlletudiants,createEtudiant,getEtudiantById,getEtudiantByNom,getEtudiantByNiveau,getEtudiantBySession,updateEtudiant,getSeancesEtudiants,updatePersonal}