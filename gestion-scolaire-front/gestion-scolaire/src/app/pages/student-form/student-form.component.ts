import { StudentService } from './../../service/student.service';
import { SessionService } from './../../service/session.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentFicheComponent } from '../student-fiche/student-fiche.component';
import { DomaineService } from '../../service/domaine.service';
import { Domaine } from '../../models/domaine.model';
import { NiveauService } from '../../service/niveau.service';
import { Niveau } from '../../models/niveau.model';
import { Session } from '../../models/session.model';
import { Etudiant } from '../../models/etudiant.model';
import { ToastrService } from 'ngx-toastr';

import { NATIONALITES } from '../../utils/nationalites';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatRadioModule,
    NavbarComponent,
    ReactiveFormsModule,
    StudentFicheComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css',
})
export class StudentFormComponent implements OnInit {
  //stock les infos a temps reel

  etudiantPreview: Partial<Etudiant> = {};

  private fb = inject(FormBuilder); // au lieu de faire a chaque fois new

  private domaineService = inject(DomaineService);
  domaines: Domaine[] = [];

  private niveauService = inject(NiveauService);
  niveau: Niveau[] = [];

  private sessionService = inject(SessionService);
  session: Session[] = [];

  //declare la formGroupe pour gére toutes les input du formulaire
  formGroup = this.fb.group({
    num_etudiant: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    nom: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s'-]+$/),
      ],
    ],
    prenom: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s'-]+$/),
      ],
    ],
    civilite: ['HOMME', [Validators.required]], 
    nationalite: ['', [Validators.required]],
    niveau: ['', [Validators.required]],
    intitule_domaine: ['', [Validators.required]],
    type_session: ['', [Validators.required]],
    lieu_naiss: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s'-]+$/),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    numero_telephone: ['', [Validators.required]], // 👈 à ajouter
    adresse_postale: [''],   
    date_inse: ['', [Validators.required]],
    date_naiss: ['', [Validators.required]],
    mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
    confirmer_mot_de_passe: ['', [Validators.required]],
  });

  constructor(
    private studentService: StudentService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    const formValue = this.formGroup.value;
    const id = this.route.snapshot.paramMap.get('id');
    const utilisateur = JSON.parse(localStorage.getItem('user') || '{}');
    const id_utilisateur = utilisateur.id_utilisateur;

    if (id) {
      // mode modification
      this.studentService.updateEtudiant(+id, formValue).subscribe({
        next: () => {
          this.toastr.success('Étudiant modifié avec succès !');
        },
        error: () => {
          this.toastr.error('Erreur lors de la modification');
        },
      });
    } else {
      // mode création
      this.studentService
        .creatEtudiant({ ...formValue, id_utilisateur })
        .subscribe({
          next: () => {
            this.toastr.success('Étudiant ajouté avec succès !');
            this.formGroup.reset();
            this.etudiantPreview = {};
          },
          error: () => {
            this.toastr.error("Erreur lors de l'ajout de l'étudiant");
          },
        });
    }
    if (
      this.formGroup.value.mot_de_passe !==
      this.formGroup.value.confirmer_mot_de_passe
    ) {
      this.toastr.error('Les mots de passe ne correspondent pas.');
      return;
    }
  }
  verificationChamp(nom: string) {
    const formControl = this.formGroup.get(nom);
    return formControl?.invalid && (formControl?.dirty || formControl?.touched);
  }

  nationalite: string[] = NATIONALITES;

  ngOnInit(): void {
    this.fetchDomaine();
    this.fetchNiveau();
    this.fetchSession();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.studentService.getEtudiantById(+id).subscribe({
          next: (response) => {
            // Correction : conversion de numero_telephone en string pour le formulaire
            const etudiant = {
              ...response.etudiant,
              numero_telephone:
                response.etudiant.numero_telephone !== null &&
                response.etudiant.numero_telephone !== undefined
                  ? String(response.etudiant.numero_telephone)
                  : '',
              adresse_postale: response.etudiant.adresse_postale ?? '',
     	      civilite: response.etudiant.civilite ?? 'HOMME',    
            };

            this.formGroup.patchValue(etudiant);
            this.etudiantPreview = etudiant;
          },
          error: () => {
            this.toastr.error("Erreur lors du chargement de l'étudiant");
          },
        });
      }
    });

    this.formGroup.valueChanges.subscribe((values) => {
      this.etudiantPreview = { ...values };
      const civilite = (values.civilite ?? 'HOMME') as 'HOMME' | 'FEMME';
      this.etudiantPreview = { ...(values as any), civilite };
    });
  }

  fetchNiveau() {
    this.niveauService.getNiveau().subscribe({
      next: (data) => {
        this.niveau = data;
      },
      error: (err) => {
        console.error('Erreur lor de la recuperation des niveaux ', err);
      },
    });
  }

  fetchDomaine() {
    this.domaineService.getDomaine().subscribe({
      next: (data) => {
        this.domaines = data;
      },
      error: (err) => {
        console.error('Erreure lors de la récuperation des domaines ', err);
      },
    });
  }
  fetchSession() {
    this.sessionService.getSession().subscribe({
      next: (data) => {
        this.session = data;
      },
      error: (err) => {
        console.error('erreure lors de la récupération des sessions');
      },
    });
  }
}
