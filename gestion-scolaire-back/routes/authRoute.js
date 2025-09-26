const express = require("express");

const router=express.Router()
const passport=require("passport")

const authController=require("../controllers/authController")

const authMiddleware = passport.authenticate("jwt", { session: false });

const adminOnly=(req,res,next)=>{
    if (req.user.role !== "admin") {
  return res.status(403).json({ message: "Accès refusé" });
}
next();
}

router.post("/login", authController.login);
router.post("/utilisateurs", authMiddleware, adminOnly, authController.registerUser);
router.post("/admin", authMiddleware, adminOnly, authController.registerAdmin);
module.exports = router;