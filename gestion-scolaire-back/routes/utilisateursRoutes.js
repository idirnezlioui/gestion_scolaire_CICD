const express = require("express")

const{getAllutilisateurs,createUtilisateur,updateUtilisateur, deleteUtilisateur }=require("../controllers/utilisateursController")

const router=express.Router()

router.get('/',getAllutilisateurs)
router.post('/',createUtilisateur)
router.put('/:id', updateUtilisateur);
router.delete('/:id', deleteUtilisateur);

module.exports=router
