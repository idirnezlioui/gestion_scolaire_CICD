const express = require("express");
const router = express.Router();
const { loginEtudiant } = require("../controllers/etudiantAuthController");

router.post("/login", loginEtudiant);

module.exports = router;
