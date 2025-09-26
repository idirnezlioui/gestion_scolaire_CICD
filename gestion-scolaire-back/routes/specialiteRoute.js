const express=require("express")

const router=express.Router()

const{getAllspecialite,creatSpecialitte, updateSpecialite, deleteSpecialite}=require("../controllers/specialiteControllers")

router.get('/',getAllspecialite)
router.post('/',creatSpecialitte)
router.put('/:sigle',updateSpecialite)
router.delete('/:sigle',deleteSpecialite)

module.exports=router