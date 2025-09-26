// models/etudiant.model.ts
export interface Etudiant {
  num_etudiant: number;
  nom: string;
  prenom: string;
  email: string;
  numero_telephone: string;
  niveau: string;
  domaine: string;
  type_session: string;
  nationalite: string;
  date_inse: string;

  // Ajout pour dashboard :
  photo?: string;
  documents?: number;
  notifications?: number;
  presences?: number;
  absences?: number;
  pourcentage?: number;

    // Champs supplémentaires pour le certificat
  date_naissance?: string;
  lieu_naissance?: string;
  adresse?: string;
  specialite?: string;
  duree?: string;
  date_debut?: string;
  date_fin?: string;
  date_certificat?: string;
  lieu_certificat?: string;
  moyenne?: number;
  dateMaj?: string;

   // champs renvoyés par le backend:
  date_naiss?: string;      
  lieu_naiss?: string;      
  intitule_domaine?: string;

}
