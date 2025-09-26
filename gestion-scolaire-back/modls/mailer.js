const nodemailer=require("nodemailer")

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"idirnezlioui4@gmail.com",
        pass:'mdps'
    }
})

const sendAlertmail=async(destinataire, sujet, contenu)=>{
   const mailOptions = {
    from: 'idirnezlioui4@gmail.com',
    to: destinataire,
    subject: sujet,
    html: contenu,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendAlertmail };