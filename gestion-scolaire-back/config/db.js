const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();//charges tous les infos depuis le fichier .env


const db = mysql.createPool({
  //Un pool de connexions est un ensemble de connexions MySQL réutilisables. Cela améliore les performances, car une nouvelle connexion n'est pas recréée à chaque requête.
  host: process.env.DB_HOST || 'mysql',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


module.exports=db.promise();