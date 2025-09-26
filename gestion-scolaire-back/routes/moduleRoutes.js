const express=require("express")

const router=express.Router()
const {getAllmodule,createModule,updateModule,deleteModule}=require("../controllers/moduleController")
router.get("/",getAllmodule)
router.post("/",createModule)
router.put("/:ref_module", updateModule);
router.delete("/:ref_module", deleteModule);

module.exports=router