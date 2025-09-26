const express=require("express")

const router=express.Router()
const{gettAlldomaine,createDomaine,updateDomaine,deleteDomaine }=require("../controllers/domaineController")
router.get('/',gettAlldomaine)

// Route pour créer un domaine
router.post("/", createDomaine);
router.put("/:id", updateDomaine);
router.delete("/:id", deleteDomaine);
module.exports=router