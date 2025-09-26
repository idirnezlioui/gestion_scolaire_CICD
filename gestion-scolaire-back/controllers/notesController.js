const Notes = require('../modls/notes');

const getModulesByEtudiant = async (req, res) => {
  const { id } = req.params;
  try {
    const modules = await Notes.getModulesByEtudiant(id);
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des modules" });
  }
};

const getNotesByEtudiant=async(req,res)=>{
  const{id}=req.params

  try {
    const notes=await Notes.getNotesByEtudiant(id)
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({error:"rreur récupération notes"})
    
  }
}

const insertNotes=async(req,res)=>{
  const {ref_note, ref_module, num_etudiant, note } = req.body;

  try {
    await Notes.insertNotes({ ref_note, ref_module, num_etudiant, note })
     res.status(201).json({ message: 'Note insérée avec succès' });
  } catch (error) {
     res.status(500).json({ error: "Erreur lors de l'insertion de la note" });
  }
}

const updateNote=async(req,res)=>{
  const {ref_module, num_etudiant, note } = req.body;
  try {
    await Notes.updateNote({ ref_module, num_etudiant, note })
    res.status(200).json({ message: 'Note mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de la note" });
  }
}


module.exports = { getModulesByEtudiant,getNotesByEtudiant ,insertNotes,updateNote};
