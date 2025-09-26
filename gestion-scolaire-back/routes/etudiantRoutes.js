const express=require("express")

const router=express.Router()
const{getAlletudiants, getEtudiantById, getEtudiantByNom, getEtudiantByNiveau,updateEtudiant, getEtudiantBySession,createEtudiant,getSeancesEtudiants,updatePersonal}=require("../controllers/etudiantsController")
const verifyToken=require("../middlewares/authMiddleware")
router.get('/',getAlletudiants)
router.get('/:id',getEtudiantById)
router.get("/nom/:nom",getEtudiantByNom)
router.get("/niveau/:niveau",getEtudiantByNiveau)
router.get("/session/:type_session",getEtudiantBySession)
router.post('/', verifyToken, createEtudiant);
router.put('/:id',updateEtudiant);
router.get("/seances/:niveau/:domaine", getSeancesEtudiants);

router.put('/:id/personal', verifyToken, updatePersonal);



module.exports=router