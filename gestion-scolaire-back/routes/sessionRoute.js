const express=require("express")

const router=express.Router()

const{gettAllSession,createSession,updateSession,deleteSession}=require("../controllers/sessionController")
router.get('/',gettAllSession)
router.post('/',createSession)
router.delete("/:id",deleteSession);
router.put("/:id",updateSession);

module.exports=router