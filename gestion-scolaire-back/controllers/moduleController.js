const Module =require("../modls/module")

const getAllmodule=async(req,res)=>{
    try {
        const modules = await Module.getAll();
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la recuperation des Modules"})
    }
}

const createModule = async (req, res) => {
    try {
      await Module.create(req.body);
      res.status(201).json({ message: "Module ajouté avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de l'ajout du module" });
    }
  };
  

  const updateModule = async (req, res) => {
    try {
      await Module.update(req.params.ref_module, req.body);
      res.status(200).json({ message: "Module modifié avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du module" });
    }
  };

  const deleteModule = async (req, res) => {
    try {
      await Module.delete(req.params.ref_module);
      res.status(200).json({ message: "Module supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression du module" });
    }
  };

module.exports={getAllmodule,createModule,updateModule,deleteModule}