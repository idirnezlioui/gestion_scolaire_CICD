//configuration 
const express =require('express')
const mysql=require("mysql2")
const dotenv=require("dotenv")
const cors=require("cors")
const passport = require("passport");
require("./config/passport")(passport);

// Charger les variables d'environnement
dotenv.config()

console.log("JWT_SECRET =", process.env.JWT_SECRET);

// Initialisation de l'application
const app=express()
const port =process.env.PORT || 3000

// Middleware pour gérer le JSON
app.use(express.json())
// Middleware pour gérer form-data (type: text uniquement)
app.use(express.urlencoded({ extended: true }));
// Middleware CORS pour autoriser plusieurs frontaux
const allowedOrigins = ["http://localhost:4200", "http://localhost:4300"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});



//connexion a la base de données
const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,

})

db.connect((err)=>{
    if(err){
        console.error("Erreur de connexion a la base de données ",err)
        process.exit(1)
    }
    console.log("Connecté a la base de données ")

})

//definire une route pour le test 

app.get("/",(req,res)=>{
    res.send("API Fonctionnelel !")
})




// Importer les routes
const utilisateurRoutes=require("./routes/utilisateursRoutes")
const etudiantRoute=require("./routes/etudiantRoutes")
const domaineRoute=require("./routes/domaineRoutes")
const niveauRoute=require("./routes/niveauRoutes")
const sessionRoute=require("./routes/sessionRoute")
const paiementRoute=require("./routes/paiementRoutes")
const specialiteRoute=require("./routes/specialiteRoute")
const moduleRoute=require("./routes/moduleRoutes")
const noteRoute=require("./routes/notesRoutes")
const profRoute=require("./routes/profsRoutes")
const profModuleNiveux=require('./routes/profmodulesRoutes')
const sendMail=require("./routes/mailRoutes")
const authRoute = require("./routes/authRoute")
const historique=require("./routes/historiqueRoute")
const presence=require("./routes/presenceRoutes")
const etudiantAuthRoute = require("./routes/etudiantAuthRoute");
const documentRoutes = require('./routes/doucumentsRoute');
// Utiliser les routes
app.use('/api/utilisateurs',utilisateurRoutes)
app.use("/api/etudiants",etudiantRoute)
app.use("/api/domaines",domaineRoute)
app.use("/api/niveaux",niveauRoute)
app.use("/api/sessions",sessionRoute)
app.use("/api/paiement",paiementRoute)
app.use("/api/specialite",specialiteRoute)
app.use("/api/modules",moduleRoute)
app.use("/api/notes",noteRoute)
app.use("/api/profs",profRoute)
app.use("/api/prof_modules_niveaux",profModuleNiveux)
app.use("/api/mail",sendMail)
app.use("/api/auth", authRoute);
app.use("/api/historique",historique)
app.use('/api/presence', presence);
app.use("/api/etudiant-auth", etudiantAuthRoute);
app.use('/api/documents', documentRoutes);


//démarage du serveure

app.listen(port , '0.0.0.0',()=>{
    console.log(`Serveur démarré sur  http://localhost:${port}`)
})
