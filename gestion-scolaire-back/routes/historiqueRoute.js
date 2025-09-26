const express = require("express");
const { getAjoutsEtudiants, getPaiementsEffectues } = require("../controllers/historiqueController");

const router = express.Router();

router.get("/ajout-etudiant", getAjoutsEtudiants);
router.get("/paiements", getPaiementsEffectues);

module.exports = router;
