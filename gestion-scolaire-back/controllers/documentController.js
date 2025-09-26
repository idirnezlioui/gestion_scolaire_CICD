const Documents = require('../modls/documents');

// Ajouter un document (upload)
const insertDocument = async (req, res) => {
  const { num_etudiant } = req.body;
  const fichier = req.file?.buffer;
  const nom_document = req.file?.originalname;

  if (!fichier || !num_etudiant) {
    return res.status(400).json({ error: "Fichier ou étudiant manquant." });
  }

  try {
    await Documents.upsert({ num_etudiant, fichier, nom_document }); // <— UPSERT
    res.status(201).json({ message: 'Document créé/mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'upsert du document." });
  }
};

// Télécharger un document
const downloadDocument = async (req, res) => {
  const { num_etudiant, nom_document } = req.params;

  try {
    const doc = await Documents.getdocByEtudiantAndNom(num_etudiant, nom_document);

    if (!doc || !doc.fichier) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nom_document}"`);
    res.send(doc.fichier);
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    res.status(500).json({ error: 'Erreur serveur lors du téléchargement' });
  }
};

const getDocumentNames = async (req, res) => {
  const { num_etudiant } = req.params;

  try {
    const docs = await Documents.getAllNamesByStudent(num_etudiant);
    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}




module.exports = {
  insertDocument,
  downloadDocument,getDocumentNames
};
