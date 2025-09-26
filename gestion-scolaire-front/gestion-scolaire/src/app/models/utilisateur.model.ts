export interface Utilisateur {
  id_utilisateur?: number;
  nom: string;
  prenom: string;
  mail: string;
  mot_pass: string;
  diplome: string;
  role: 'admin' | 'user' | 'secretaire';
}
