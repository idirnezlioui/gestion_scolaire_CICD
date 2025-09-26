// routes/mailRoutes.js
const express = require('express');
const router = express.Router();
const { envoyerAlertePaiement } = require('../controllers/mailController');

router.post('/alerte-paiement', envoyerAlertePaiement);

module.exports = router;
