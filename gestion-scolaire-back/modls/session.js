const db=require("../config/db")

const Session={
    getAll:async()=>{
        const[rows]=await db.query("SELECT * FROM sessions as s ")
        return rows
    },

      create: async (sessions) => {
        const { date_deb, date_fin,annee,type_session} = sessions;
        const [result] = await db.query(
          "INSERT INTO sessions (date_deb , date_fin,annee,type_session) VALUES (?, ?,?,?)",
          [date_deb, date_fin,annee,type_session]
        );
        return { id_session: result.insertId, ...sessions };
      } ,
      //mettre a jour
        update: async (id_session, date_deb, date_fin,annee,type_session) => {
          await db.query(
            "UPDATE sessions SET date_deb = ?, date_fin = ?,annee=?,type_session=? WHERE id_session = ?",
            [date_deb, date_fin, annee,type_session,id_session]
          );
          return { id_session, date_deb, date_fin, annee, type_session};
        },

        //supprimer
        
          delete: async (id_session) => {
            await db.query("DELETE FROM sessions WHERE id_session = ?", [id_session]);
          },


}

module.exports=Session