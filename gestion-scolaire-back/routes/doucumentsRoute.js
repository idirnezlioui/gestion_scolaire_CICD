const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { insertDocument, downloadDocument,getDocumentNames } = require('../controllers/documentController');

// POST /api/documents
router.post('/', upload.single('file'), insertDocument);

// GET /api/documents/:num_etudiant/:nom_document
router.get('/:num_etudiant/:nom_document', downloadDocument);
// Récupération des noms de documents
router.get('/:num_etudiant', getDocumentNames);

module.exports = router;
