const db=require("../config/db") //faire la connexion a la bd 
const bcrypt=require("bcryptjs")

const Utilisateur={
    findBymail:async(email)=>{
        const [rows]=await db.query("SELECT * FROM utilisateurs WHERE mail = ? LIMIT 1", [email])
        return rows [0] || null

    },

    getAll:async()=>{
        const [rows]=await db.query("select * from utilisateurs")
        return rows
    },
    create:async(utilisateur)=>{
        const {nom,prenom,mail,mot_pass,diplome,role = 'user' }=utilisateur

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mot_pass, salt);
        const [result]=await db.query("INSERT INTO `utilisateurs`( `nom`, `prenom`, `mail`, `mot_pass`, `diplome`,`role`) VALUES (?,?,?,?,?,?)",[nom,prenom,mail,hashedPassword,diplome,role])
        return result
    },

    update: async (id, utilisateur) => {
  const { nom, prenom, mail, mot_pass, diplome, role } = utilisateur;

   const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(mot_pass, salt);
  const [result] = await db.query(
    "UPDATE utilisateurs SET nom = ?, prenom = ?, mail = ?, mot_pass = ?, diplome = ?, role = ? WHERE id_utilisateur = ?",
    [nom, prenom, mail, hashedPassword, diplome, role, id]
  );
  return result;
},

remove: async (id) => {
  const [result] = await db.query("DELETE FROM utilisateurs WHERE id_utilisateur = ?", [id]);
  return result;
},

}

module.exports= Utilisateur