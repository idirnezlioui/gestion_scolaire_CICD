// models/note.model.ts
export interface RawNote {
  ref_note: number;
  ref_module: number;
  num_etudiant: number;
  note: number;
  intitule: string; 
}

export interface Note extends RawNote {
  session: 'Normale' | 'Rattrapage';
  observation: 'Validé' | 'Non validé' | 'En attente';
}
