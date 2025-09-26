const db = require("../config/db")
const bcrypt=require("bcrypt")
const Etudiant = {
  getAll: async () => {
    const [rows] = await db.query(`
           SELECT e.num_etudiant,e.nom,e.prenom,e.civilite,DATE_FORMAT(e.date_naiss, '%Y-%m-%d') AS date_naiss,
      e.lieu_naiss,e.nationalite,e.email ,e.numero_telephone ,e.adresse_postale,n.niveau,d.intitule AS domaine,s.type_session ,DATE_FORMAT(e.date_inse, '%d/%m/%Y') AS date_inse FROM etudiants as e LEFT JOIN niveau as n on e.id_niveau=n.id_niveau LEFT JOIN domaines as d on e.id_domaine=d.ref_domaine LEFT JOIN sessions as s on e.id_session=s.id_session;
        `);
    return rows
  },

  //Recupere un etudiant par sont id 
  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT e.num_etudiant, e.nom, e.prenom,e.civilite, e.date_naiss, e.lieu_naiss, e.nationalite,
       e.email, e.numero_telephone,e.adresse_postale,  
       n.niveau, s.type_session,
       d.intitule AS intitule_domaine,
       DATE_FORMAT(e.date_inse, '%Y-%m-%d') as date_inse
         FROM etudiants AS e
           LEFT JOIN sessions AS s ON e.id_session = s.id_session
           LEFT JOIN niveau AS n ON e.id_niveau = n.id_niveau
           LEFT JOIN domaines AS d ON e.id_domaine = d.ref_domaine
           WHERE e.num_etudiant = ?`,
           [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },


  //recupere un etudiant par nom 
  getByNom: async (nom) => {
    const [rows] = await db.query("SELECT e.num_etudiant, e.nom, e.prenom, e.date_naiss, n.niveau, s.type_session FROM etudiants AS e left join niveau as n on e.id_niveau=n.id_niveau LEFT JOIN sessions AS s ON e.id_session = s.id_session WHERE e.nom LIKE ?;",
      [`%${nom}%`])
    return rows
  },

  //recuper un etudiants par niveau 
  getByNiveau: async (niveau) => {
    const [rows] = await db.query("SELECT e.num_etudiant, e.nom, e.prenom, e.date_naiss, e.niveau, FROM etudiants AS e LEFT JOIN niveu AS n ON e.id_niveu = n.id_niveau WHERE e.niveau = ?;",
      [niveau])
    return rows
  },

  //recupere un etudiant par type de session 

  getBySession: async (type_session) => {
    const [rows] = await db.query("SELECT e.date_inse,e.sigle_specia,e.num_etudiant, e.nom,e.prenom,e.date_naiss,e.niveau,s.annee,s.type_session from etudiants as e JOIN sessions as s ON e.id_session=s.id_session where type_session=? ;", [type_session])
    return rows
  },

  //insertion de l'etudiant 
  create: async (etudiant, id_utilisateur) => {
  const {
    num_etudiant, nom, prenom, civilite,
    date_naiss, lieu_naiss, nationalite,
    email, numero_telephone, adresse_postale,
    niveau,              // libellé venant du front
    type_session,        // libellé venant du front
    intitule_domaine,    // libellé venant du front
    date_inse,
    mot_de_passe
  } = etudiant;

  // 1) validations simples
  if (!['HOMME', 'FEMME'].includes(civilite || 'HOMME')) {
    return { succes: false, message: "civilite doit être 'HOMME' ou 'FEMME'" };
  }
  if (!mot_de_passe) {
    return { succes: false, message: "mot_de_passe est requis" };
  }

  // 2) résolutions d'IDs
  const [dom]    = await db.query("SELECT ref_domaine AS id FROM domaines WHERE intitule = ?", [intitule_domaine]);
  const [niv]    = await db.query("SELECT id_niveau  AS id FROM niveau    WHERE niveau   = ?", [niveau]);
  const [sess]   = await db.query("SELECT id_session AS id FROM sessions  WHERE type_session = ?", [type_session]);
  if (!dom.length)  throw new Error("Domaine introuvable");
  if (!niv.length)  throw new Error("Niveau introuvable");
  if (!sess.length) throw new Error("Session introuvable");

  const id_domaine = dom[0].id;
  const id_niveau  = niv[0].id;
  const id_session = sess[0].id;

  // 3) hash du mot de passe
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

  // 4) INSERT qui colle à la table
  await db.query(
    `INSERT INTO etudiants (
       num_etudiant, nom, prenom, civilite,
       date_naiss, lieu_naiss, nationalite,
       email, numero_telephone, adresse_postale,
       id_domaine, id_niveau, id_session,
       date_inse, id_utilisateur, mot_de_passe
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      num_etudiant, nom, prenom, (civilite || 'HOMME'),
      date_naiss, lieu_naiss, nationalite,
      email, numero_telephone, (adresse_postale || null),
      id_domaine, id_niveau, id_session,
      date_inse, id_utilisateur, hashedPassword
    ]
  );

  return { succes: true, message: "Étudiant ajouté avec succès" };
},



  update: async (id, etudiant) => {
    const {
      nom,
      prenom,
      civilite,
      date_naiss,
      lieu_naiss,
      nationalite,
      niveau,
      date_inse,
      type_session,
      intitule_domaine,
      email,
      numero_telephone,
      adresse_postale
    } = etudiant;

    if (civilite && !['HOMME','FEMME'].includes(civilite)) {
     return { succes: false, message: "civilite doit être 'HOMME' ou 'FEMME'" };
    }

    try {
      // récupérer les IDs liés
      const [domaineResult] = await db.query(
        "SELECT ref_domaine FROM domaines WHERE intitule = ?",
        [intitule_domaine]
      );
      if (domaineResult.length === 0) throw new Error("Domaine introuvable");

      const [niveauResult] = await db.query(
        "SELECT id_niveau FROM niveau WHERE niveau = ?",
        [niveau]
      );
      if (niveauResult.length === 0) throw new Error("Niveau introuvable");

      const [sessionResult] = await db.query(
        "SELECT id_session FROM sessions WHERE type_session = ?",
        [type_session]
      );
      if (sessionResult.length === 0) throw new Error("Session introuvable");

      const id_domaine = domaineResult[0].ref_domaine;
      const id_niveau = niveauResult[0].id_niveau;
      const id_session = sessionResult[0].id_session;

      // mise à jour
      await db.query(
        `UPDATE etudiants 
       SET nom=?, prenom=?,civilite=?, date_naiss=?, lieu_naiss=?, nationalite=?, email=?, numero_telephone=?,adresse_postale=?, 
           id_domaine=?, id_niveau=?, id_session=?, date_inse=? 
       WHERE num_etudiant=?`,
        [
          nom,
          prenom,
          civilite || 'HOMME',
          date_naiss,
          lieu_naiss,
          nationalite,
          email,
          numero_telephone,
          adresse_postale || null,
          id_domaine,
          id_niveau,
          id_session,
          date_inse,
          id,
        ]
      );

      return { succes: true, message: "Étudiant mis à jour avec succès" };
    } catch (error) {
      console.error("Erreur update :", error.message);
      return { succes: false, message: error.message };
    }
  },
  getSeancesByNiveauEtDomaine: async (niveau, domaine) => {
    // 1) Récupération des étudiants avec modules et nombre de séances
    const [rows] = await db.query(`
    SELECT 
      e.num_etudiant,               
      e.nom, 
      e.prenom, 
      d.intitule AS domaine,
      m.nbr_seances AS nombre_seance,
      m.ref_module,
      m.intitule
    FROM etudiants e
    JOIN niveau n ON e.id_niveau = n.id_niveau
    JOIN domaines d ON e.id_domaine = d.ref_domaine
    JOIN modules m ON m.ref_domaine = d.ref_domaine
    WHERE n.niveau = ? AND d.intitule = ?
    GROUP BY e.num_etudiant, e.nom, e.prenom, d.intitule, m.ref_module
    ORDER BY d.intitule, e.nom
  `, [niveau, domaine]);

    if (rows.length === 0) return [];

    // 2) Récupération des séances déjà renseignées
    const etudiantIds = rows.map(r => r.num_etudiant);
    const moduleIds = rows.map(r => r.ref_module);

    const [seances] = await db.query(`
    SELECT num_etudiant, ref_module, date_seance
    FROM presence
    WHERE num_etudiant IN (?) AND ref_module IN (?)
  `, [etudiantIds, moduleIds]);

    // 3) Création d'une table de correspondance étudiant+module → séances
    const seancesMap = {};
    seances.forEach(s => {
      const key = `${s.num_etudiant}_${s.ref_module}`;
      if (!seancesMap[key]) seancesMap[key] = [];
      seancesMap[key].push(s.date_seance);
    });

    // 4) Ajout des séances renseignées à chaque étudiant
    const result = rows.map(e => {
      const key = `${e.num_etudiant}_${e.ref_module}`;
      return {
        ...e,
        seancesRenseignees: seancesMap[key] || [],
      };
    });

    return result;
  },
getSeancesByNiveauEtDomaine: async (niveau, domaine) => {
  // 1) Étudiants + modules
  const [rows] = await db.query(
    `SELECT
       e.num_etudiant,
       e.nom,
       e.prenom,
       d.intitule AS domaine,
       m.nbr_seances AS nombre_seance,
       m.ref_module,
       m.intitule
     FROM etudiants e
     JOIN niveau   n ON e.id_niveau   = n.id_niveau
     JOIN domaines d ON e.id_domaine  = d.ref_domaine
     JOIN modules  m ON m.ref_domaine = d.ref_domaine
     WHERE n.niveau = ? AND d.intitule = ?
     GROUP BY
       e.num_etudiant, e.nom, e.prenom,
       d.intitule,
       m.ref_module,
       m.nbr_seances,
       m.intitule
     ORDER BY d.intitule, e.nom`,
    [niveau, domaine]
  );

  if (rows.length === 0) return [];

  // 2) récupérer les séances renseignées pour ces étudiants/modules
  const etudiantIds = rows.map(r => r.num_etudiant);
  const moduleIds   = rows.map(r => r.ref_module);

  const [seances] = await db.query(
    `SELECT num_etudiant, ref_module, date_seance
     FROM presence
     WHERE num_etudiant IN (?) AND ref_module IN (?)`,
    [etudiantIds, moduleIds]
  );

  // 3) assembler les séances par (étudiant, module)
  const seancesMap = {};
  seances.forEach(s => {
    const key = `${s.num_etudiant}_${s.ref_module}`;
    if (!seancesMap[key]) seancesMap[key] = [];
    seancesMap[key].push(s.date_seance);
  });

  // 4) enrichir le résultat
  const result = rows.map(e => {
    const key = `${e.num_etudiant}_${e.ref_module}`;
    return { ...e, seancesRenseignees: seancesMap[key] || [] };
  });

  return result;
},

//l'autre application des etudiants
// modls/etudiant.js
updatePersonal: async (id, data) => {
  const allow = ['email', 'numero_telephone', 'date_naiss', 'lieu_naiss', 'nationalite'];
  const fields = [];
  const values = [];

  allow.forEach(k => {
    if (data[k] !== undefined) {
      fields.push(`${k} = ?`);
      values.push(data[k]);
    }
  });

  if (!fields.length) return { succes: false, message: "Aucun champ valide à mettre à jour" };

  values.push(id);

  await db.query(
    `UPDATE etudiants SET ${fields.join(', ')} WHERE num_etudiant = ?`,
    values
  );
  return { succes: true };
},




}

module.exports = Etudiant
