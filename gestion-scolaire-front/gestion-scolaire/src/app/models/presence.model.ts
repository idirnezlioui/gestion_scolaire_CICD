export interface Presence {
  num_etudiant: number;
  ref_module: number;
  numero_seance: number;
  etat: 'present' | 'absent' | 'autre';
  observation?: string;
}
