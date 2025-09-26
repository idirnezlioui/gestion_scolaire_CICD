export interface Module {
  ref_module?: number;
  intitule: string;
  nbr_heures: number;
  nbr_seances: number;
  type: string;
  domaine: string;       // domaine affiché dans la table
  ref_domaine: number;
}