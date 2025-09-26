export interface AjoutEtudiant {
  id_utilisateur: number;
  nom_utilisateur: string;
  prenom_utilisateur: string;
  num_etudiant: number;
  nom_etudiant: string;
  prenom_etudiant: string;
  date_ajout_etudiant: string;
}

export interface PaiementEffectue {
  id_utilisateur: number;
  nom_utilisateur: string;
  num_etudiant: number;
  nom_etudiant: string;
  date_paiement: string;
}
