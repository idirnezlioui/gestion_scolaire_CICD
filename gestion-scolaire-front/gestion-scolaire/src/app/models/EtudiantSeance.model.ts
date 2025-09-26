export interface EtudiantSeance {
  num_etudiant: number | null; 
  nom: string;
  prenom: string;
  domaine: string;
  nombre_seance: number;
  ref_module?: number;
  intitule:string
  seancesRenseignees?: number[];
}
