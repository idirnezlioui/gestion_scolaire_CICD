const express =require("express")
const { gettAllProfmod ,createAffectations,getAffectationsByProf,deleteByModule,deleteByNiveau,addSingleAffectation,deleteSingle} = require("../controllers/pofmodulesController")
const router=express.Router()

router.get('/',gettAllProfmod)
router.post("/", createAffectations);
router.get('/:id', getAffectationsByProf);
router.delete('/module', deleteByModule);
router.delete('/niveau', deleteByNiveau);
router.post('/single', addSingleAffectation);
router.delete('/single',deleteSingle)




module.exports=router