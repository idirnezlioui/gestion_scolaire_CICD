const Session=require("../modls/session")

const gettAllSession=async(req,res)=>{
    try {
        const session=await Session.getAll()
        res.status(200).json(session)
    } catch (error) {
        res.status(500).json({error:"Erreure lors de la recupération des sessions"})
        
    }
}

const createSession =async(req,res)=>{
    try {
        const newSession=await Session.create(req.body)
         res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de la session" });
    }
}

const updateSession =async(req,res)=>{
    try {
        const {id }=req.params
        const{date_deb, date_fin, annee, type_session}=req.body
        const updated=await Session.update(id, date_deb, date_fin, annee, type_session)
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de la session" });
    }
}

const deleteSession=async (req,res)=>{
    try {
        const {id}=req.params
        await Session.delete(id)
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de la session" });
    }
}

module.exports={gettAllSession,updateSession,createSession,deleteSession}