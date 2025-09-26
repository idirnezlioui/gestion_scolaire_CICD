export interface Paiement {
    id_paiement:number
    montant_paye:number
    date_paiement: string
    date_max_paiement:string
    solde_restant?: number;  
  statut_paiment?: string; 
    remise:number
    id_etudiant: string;
}
 