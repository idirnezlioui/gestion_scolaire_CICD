// controllers/mailController.js
const { sendAlerteMail } = require('../modls/mailer');

const envoyerAlertePaiement = async (req, res) => {
  const { nom, prenom, email, datePaiement } = req.body;

  try {
    await sendAlerteMail(
      email,
      "🔔 Rappel de paiement",
      `<p>Bonjour ${prenom} ${nom},<br><br>Votre prochain paiement est prévu pour le <strong>${datePaiement}</strong>.</p>`
    );

    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
  }
};

module.exports = { envoyerAlertePaiement };
