const express=require("express")

const Paiment = require("../modls/paiement");
const router=express.Router()
const{gettAllPaiement,createPaiement,getPaiementsSemaineProchaine}=require("../controllers/paiementController")
router.get('/',gettAllPaiement)
router.post('/ajouter',createPaiement)

router.get('/verifier-remise/:id', async (req, res) => {
    try {
        const idEtudiant = req.params.id;
        const aDejaRemise = await Paiment.verifierRemise(idEtudiant);
        res.status(200).json(aDejaRemise);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la vérification de la remise" });
    }
});

//recupere le tarif de la formation depuii la bd
router.get('/tarif-formation/:id',async(req,res)=>{
    try {
        const id_etudiant = req.params.id; 
        const tarif=await Paiment.getTarif(id_etudiant)
        res.status(200).json({tarif})
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération du tarif de la formation." });
    }
})

router.get('/solde-restant/:id', async (req, res) => {
    try {
        const paiements = await Paiment.getPaiementsByEtudiant(req.params.id);
        res.json(paiements);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error });
    }
});

router.get('/alertes/paiement-prochain', getPaiementsSemaineProchaine);


module.exports=router