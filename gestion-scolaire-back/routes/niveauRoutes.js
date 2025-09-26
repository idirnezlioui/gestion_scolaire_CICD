const express=require ("express")

const router=express.Router()

const {gettAllNiveau,createNiveau,updateNiveau,deleteNiveau}=require("../controllers/niveauController")
router.get('/',gettAllNiveau)
router.post('/',createNiveau)
router.delete("/:id",deleteNiveau);
router.put("/:id",updateNiveau);
module.exports=router
