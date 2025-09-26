const express = require('express');
const router = express.Router();
const { getModulesByEtudiant,getNotesByEtudiant,insertNotes,updateNote } = require('../controllers/notesController');

router.get('/etudiants/:id/modules', getModulesByEtudiant);
router.get('/etudiants/:id/notes', getNotesByEtudiant);
router.post('/', insertNotes);
router.put('/', updateNote);

module.exports = router;