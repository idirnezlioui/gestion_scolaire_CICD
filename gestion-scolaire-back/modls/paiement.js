const db = require("../config/db");

const Paiment = {
  // Récupérer tous les paiements
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT e.nom, e.prenom, p.montant_paye, p.date_paiement, p.date_max_paiement, p.solde_restant, p.statut_paiment, p.remise 
      FROM paiements AS p 
      LEFT JOIN etudiants AS e ON p.id_etudiant = e.num_etudiant;`
    );
    return rows;
  },

  // Récupérer le tarif de la formation
  // Récupérer le tarif de la formation
  getTarif: async (id_etudiant) => {
    try {
      const [rows] = await db.query(
        `SELECT n.tarifs 
       FROM etudiants AS e
       LEFT JOIN niveau AS n ON e.id_niveau = n.id_niveau
       WHERE e.num_etudiant = ?`,
        [id_etudiant]
      );

      if (rows.length > 0) {
        return rows[0].tarifs; // Retourner le tarif si trouvé
      } else {
        throw new Error("Aucun tarif trouvé pour cet étudiant.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du tarif :", error.message);
      throw new Error("Impossible de récupérer le tarif de la formation.");
    }
  },

  // Vérification si l'étudiant a déjà une remise
  verifierRemise: async (idEtudiant) => {
    const [rows] = await db.query(
      `SELECT remise FROM paiements WHERE id_etudiant = ? AND remise > 0 LIMIT 1`,
      [idEtudiant]
    );
    return rows.length > 0; // Retourne true si une remise existe
  },

  // Récupérer les paiements d'un étudiant par ID
  getPaiementsByEtudiant: async (id_etudiant) => {
    try {
      const [paiements] = await db.query(
        "SELECT * FROM paiements WHERE id_etudiant = ?",
        [id_etudiant]
      );
      return paiements;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des paiements de l'étudiant :",
        error
      );
      throw error;
    }
  },

  // Créer un nouveau paiement
  create: async (paiment) => {
    try {
      const {
        id_etudiant,
        montant_paye,
        date_paiement,
        date_max_paiement,
        remise,
      } = paiment;

      const datePaiement = new Date(date_paiement);
      const dateMaxPaiement = new Date(date_max_paiement);

      if (isNaN(datePaiement) || isNaN(dateMaxPaiement)) {
        throw new Error("Les dates fournies sont invalides.");
      }

      if (dateMaxPaiement <= datePaiement) {
        throw new Error(
          "La date du prochain paiement doit être après la date actuelle."
        );
      }

      const adejaRemise = await Paiment.verifierRemise(id_etudiant);
      if (adejaRemise && remise > 0) {
        throw new Error(
          "Cette remise ne peut pas être appliquée car l'étudiant a déjà une remise."
        );
      }

      const tarifformation = await Paiment.getTarif(id_etudiant);
      if (!tarifformation) {
        throw new Error("Impossible de récupérer le tarif de la formation.");
      }

      const paiements = await Paiment.getPaiementsByEtudiant(id_etudiant);
      const totalpaiments = paiements.length;

      if (totalpaiments === 0 && montant_paye < 1800) {
        throw new Error("Le premier paiement doit être d’au moins 1800€.");
      }

      const totalpayeAvant = paiements.reduce(
        (sum, p) => sum + parseInt(p.montant_paye || 0),
        0
      );
      const remiseActuelle = parseInt(remise || 0);
      const totalRemise =
        paiements.reduce((acc, cur) => {
          const remiseVal = parseInt(cur.remise || 0);
          return acc + (isNaN(remiseVal) ? 0 : remiseVal);
        }, 0) + remiseActuelle;

      const montantActuel = parseInt(montant_paye || 0);
      const tarif = parseInt(tarifformation || 0);
      const nouveauTotalPaye = totalpayeAvant + montantActuel;
      let soldeRestant = tarif - nouveauTotalPaye - totalRemise;
      if (soldeRestant < 0) soldeRestant = 0;

      //  Fix précision
      soldeRestant = Math.round(soldeRestant * 100) / 100;

      //  Blocage si déjà tout payé
      if (soldeRestant <= 0 && tarif - totalpayeAvant - totalRemise <= 0) {
        throw new Error(
          "Paiement refusé : la formation est déjà payée en totalité."
        );
      }

      if (soldeRestant < 0) soldeRestant = 0;

      let statutPaiment = "En attente";
      if (soldeRestant === 0) {
        statutPaiment = "Payé";
      } else if (nouveauTotalPaye > 0) {
        statutPaiment = "Partiel";
      }

      const [insertResult] = await db.query(
        `INSERT INTO paiements 
        (id_etudiant, montant_paye, date_paiement, date_max_paiement, solde_restant, statut_paiment, remise) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id_etudiant,
          montant_paye,
          date_paiement,
          date_max_paiement,
          soldeRestant,
          statutPaiment,
          remise,
        ]
      );

      return { success: true, id_paiement: insertResult.insertId };
    } catch (error) {
      console.log("Erreur lors de l'ajout du paiement :", error.message);
      throw error;
    }
  },

  getPaiementsSemaineProchaine: async () => {
  const [rows] = await db.query(`
    SELECT 
      e.nom, 
      e.prenom, 
      e.numero_telephone ,
      e.email,
      n.niveau, 
      d.intitule AS domaine, 
      s.type_session, 
      p.date_max_paiement
    FROM paiements AS p
    JOIN etudiants AS e ON e.num_etudiant = p.id_etudiant
    JOIN niveau AS n ON e.id_niveau = n.id_niveau
    JOIN domaines AS d ON e.id_domaine = d.ref_domaine
    JOIN sessions AS s ON e.id_session = s.id_session
    WHERE p.date_max_paiement BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    ORDER BY p.date_max_paiement ASC
  `);

  return rows;
}
};

module.exports = Paiment;
