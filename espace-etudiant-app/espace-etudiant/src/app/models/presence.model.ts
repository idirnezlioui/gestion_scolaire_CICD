export interface Presence {
  id_presence: number;
  num_etudiant: string;
  ref_module: number;
  date_seance: number;
  statut: 'present' | 'absent';
  observation?: string;
}
