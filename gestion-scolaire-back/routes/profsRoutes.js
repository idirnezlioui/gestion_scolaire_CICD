const express=require("express")

const router=express.Router()

const{gettAllProfs,createProf,updateProf,deleteProf,getProfById}=require("../controllers/profsController")

router.get('/',gettAllProfs)
router.post('/', createProf);
router.put('/:id', updateProf);
router.delete('/:id', deleteProf);
router.get('/:id', getProfById);


module.exports=router