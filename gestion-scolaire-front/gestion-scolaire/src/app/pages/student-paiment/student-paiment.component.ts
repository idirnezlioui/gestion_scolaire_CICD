import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { PaiementService } from '../../service/paiement.service';
import { StudentService } from '../../service/student.service';
import { Paiement } from '../../models/paiment.model';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentRecuComponent } from '../student-recu/student-recu.component';
import { CommonModule } from '@angular/common';

function premierPaiementValidator(
  premier: boolean
): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl) => {
    const val = control.value;
    if (premier && val < 1800) return { montantPremierPaiement: true };
    if (val <= 0) return { min: true };
    return null;
  };
}

function remiseValidator(
  isPremier: boolean
): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl) => {
    const val = control.value || 0;
    if (!isPremier && val > 0) return { remiseSeulePremiereFois: true };
    if (val < 0) return { remiseNegative: true };
    return null;
  };
}

@Component({
  selector: 'app-student-paiment',
  templateUrl: './student-paiment.component.html',
  styleUrls: ['./student-paiment.component.css'],
  standalone: true,
  imports: [
    NavbarComponent,
    StudentRecuComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class StudentPaimentComponent implements OnInit {
  formGroup!: FormGroup;
  etudiants: Etudiant[] = [];
  selectedStudent: Etudiant | null = null;
  showDropdown = false;
  searchId = '';
  searchterm = '';
  remiseActive = true;
  filterEtudiant: Etudiant[] = [];
  tarifformation = 0;
  totalPaiements = 0;
  totalRemises = 0;
  isPremierPaiement = true;
  historiquePaiements: Paiement[] = [];

  paiement: Paiement = {
    id_paiement: 0,
    montant_paye: 0,
    date_paiement: '',
    date_max_paiement: '',
    solde_restant: 0,
    statut_paiment: 'en attente',
    remise: 0,
    id_etudiant: '',
  };
of: any;

  constructor(
    private etudiantService: StudentService,
    private paiementService: PaiementService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.initForm();
  }

  loadStudents() {
    this.etudiantService.getEtudiants().subscribe((data) => {
      this.etudiants = data;
      this.filterEtudiant = [...this.etudiants];
    });
  }

  toggleDropdown() {
    this.showDropdown = this.filterEtudiant.length > 0;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  searchById() {
    this.filterEtudiant = this.searchId.trim()
      ? this.etudiants.filter((s) =>
          s.num_etudiant?.toString().includes(this.searchId.trim())
        )
      : [...this.etudiants];
    this.toggleDropdown();
  }

  searchByName() {
    this.filterEtudiant = this.searchterm.trim()
      ? this.etudiants.filter((s) =>
          `${s.nom?.toLowerCase()} ${s.prenom?.toLowerCase()}`.includes(
            this.searchterm.toLowerCase()
          )
        )
      : [...this.etudiants];
    this.toggleDropdown();
  }

  checkRemise(studentId: string) {
    this.paiementService
      .verifierRemise(studentId)
      .subscribe((result: boolean) => {
        this.remiseActive = !result;
      });
  }


  premierPaiementValidator(): (
    control: AbstractControl
  ) => ValidationErrors | null {
    return (control: AbstractControl) => {
      const val = control.value;
      if (this.isPremierPaiement && val < 1800)
        return { montantPremierPaiement: true };
      if (val <= 0) return { min: true };
      return null;
    };
  }

  selectStudent(student: Etudiant) {
  this.selectedStudent = student;
  this.paiement.id_etudiant = student.num_etudiant ?? '';
  this.paiement.date_paiement = this.formatDate(new Date());

  this.checkRemise(student.num_etudiant ?? '');

  this.paiementService.getTarifFormation(student.num_etudiant ?? '').subscribe((tarif) => {
      this.tarifformation = isNaN(tarif.tarif) ? 0 : tarif.tarif;

      this.paiementService.getPaiementsByEtudiant(student.num_etudiant ?? '').subscribe((paiements) => {
          this.isPremierPaiement = paiements.length === 0;

          // Historique affiché à droite
          this.historiquePaiements = paiements;

          // Total payé (hors paiement actuel)
          this.totalPaiements = paiements.reduce(
            (acc, cur) => acc + (cur.montant_paye || 0),
            0
          );

          // Appliquer la remise uniquement au 1er paiement
          this.totalRemises = paiements.length > 0 ? paiements[0].remise || 0 : 0;

          // Calculer le solde restant réel
          const solde = Math.max(
            0,
            this.tarifformation - (this.totalPaiements + this.totalRemises)
          );

          this.paiement.solde_restant = solde;
          this.formGroup?.get('solde_restant')?.setValue(solde, { emitEvent: false });

          console.log('➡️ Étudiant sélectionné :', student);
          console.log('➡️ Tarif formation :', this.tarifformation);
          console.log('➡️ Total paiements passés :', this.totalPaiements);
          console.log('➡️ Remise initiale :', this.totalRemises);
          console.log('➡️ ✅ Solde réel calculé :', solde);

          //  Important : réinitialiser le formulaire proprement
          this.initForm();

          // Injecter les vraies valeurs dans les champs
          this.formGroup.patchValue({
            montant_paye: '',
            remise: 0,
            date_max_paiement: '',
            solde_restant: this.paiement.solde_restant, // ✅ ici on injecte le bon solde
            statut_paiment: 'en attente',
          });

          // Met à jour la validation dynamique du 1er paiement
          this.formGroup.get('montant_paye')?.setValidators([
            Validators.required,
            this.premierPaiementValidator(),
          ]);
          this.formGroup.get('montant_paye')?.updateValueAndValidity();
        });
    });

  this.showDropdown = false;
}


  updateSoldeRestant(montant: number) {
  let montantNum = Number(montant || 0);
  if (isNaN(this.tarifformation)) this.tarifformation = 0;
  if (isNaN(this.totalPaiements)) this.totalPaiements = 0;
  if (isNaN(montantNum)) montantNum = 0;

  const remiseForm = Number(this.formGroup.get('remise')?.value || 0);
  const remise = this.isPremierPaiement ? remiseForm : 0;
  const montantTotal = this.totalPaiements + montantNum;

  const previewSolde = Math.max(0, this.tarifformation - montantTotal - remise);

  console.log('🧮 Calcul du solde restant...');
  console.log('Tarif formation:', this.tarifformation);
  console.log('Total déjà payé (hors paiement courant):', this.totalPaiements);
  console.log('Montant en cours de saisie:', montantNum);
  console.log('Remise formulaire:', remiseForm);
  console.log('Remise appliquée:', remise);
  console.log('Solde affiché = tarif - (payé + montant + remise) =', previewSolde);

  this.paiement.solde_restant = previewSolde;
  this.formGroup.get('solde_restant')?.setValue(previewSolde, { emitEvent: false });
}


  private initForm() {
  this.formGroup = this.fb.group({
    montant_paye: [
      '',
      [Validators.required, this.premierPaiementValidator()],
    ],

    date_paiement: new FormControl({
      value: this.formatDate(new Date()),
      disabled: true,
    }),
    date_max_paiement: ['', Validators.required],
    remise: [0, remiseValidator(this.isPremierPaiement)],
    solde_restant: [{ value: this.paiement.solde_restant ?? 0, disabled: true }],
    statut_paiment: ['en attente'],
  });

  this.formGroup
    .get('montant_paye')
    ?.valueChanges.subscribe((val: number) => {
      this.updateSoldeRestant(val);
    });

  this.formGroup.get('remise')?.valueChanges.subscribe(() => {
    this.updateSoldeRestant(this.formGroup.get('montant_paye')?.value || 0);
  });
}


  verificationChamp(nom: string): boolean {
    const control = this.formGroup.get(nom);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

submitPaiement() {
  if (!this.selectedStudent || !this.selectedStudent.num_etudiant) {
    alert("Veuillez d'abord sélectionner un étudiant.");
    return;
  }

  const formValues = this.formGroup.getRawValue();

  this.paiement.montant_paye = Number(formValues.montant_paye || 0);
  this.paiement.remise = Number(formValues.remise || 0);
  this.paiement.date_max_paiement = formValues.date_max_paiement;

  const remiseEffective = this.isPremierPaiement ? this.paiement.remise : 0;

  this.paiement.solde_restant =
    this.tarifformation -
    (this.totalPaiements + this.paiement.montant_paye + remiseEffective);

  const paiementToSend = { ...this.paiement };

  this.paiementService.ajouterunPaiement(paiementToSend).subscribe(
    () => {
      this.paiementService
  .getPaiementsByEtudiant(this.paiement.id_etudiant)
  .subscribe((paiements) => {
          const lastPaiement = paiements[paiements.length - 1];

          this.paiement = { ...lastPaiement };

          // ✅ Recharge toutes les données de l’étudiant sélectionné
          if (this.selectedStudent) {
            this.selectStudent(this.selectedStudent);
          }
        });
    },
    (error) => {
      console.error("Erreur lors de l'enregistrement du paiement", error);
      alert("Le paiement n'a pas été effectué.");
    }
  );
}


}
