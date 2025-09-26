const Specialite =require ("../modls/specialite")

const getAllspecialite=async(req,res)=>{
    try {
        const specialite=await Specialite.getAll()
        res.status(200).json(specialite)
    } catch (error) {
        res.status(500).json({error:"erreure lors de la recuperation des Specialites"})
    }
} 

const creatSpecialitte= async(req,res)=>{
    try {
        const result=await Specialite.create(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({error:"erreure lors de l'insertion des Specialites"})
    }
}

const updateSpecialite=async(req,res)=>{
    try {
        const {sigle}=req.params
        const data=await Specialite.update(sigle,req.body)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error:"Erreur modification spécialité"})
        
    }
}

const deleteSpecialite=async(req,res)=>{
    try {
        const{sigle}=req.params
        await Specialite.delete(sigle)
        res.status(204).send()
    } catch (error) {
        res.status(500).json({error:"Erreur suppression spécialité"})
    }
}

module.exports={getAllspecialite,creatSpecialitte,updateSpecialite,deleteSpecialite}