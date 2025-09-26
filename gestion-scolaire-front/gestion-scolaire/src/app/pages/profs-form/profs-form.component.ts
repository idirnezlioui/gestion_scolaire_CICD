import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NavbarComponent } from './../../components/navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { ProfsService } from '../../service/profs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profs-form',
  imports: [NavbarComponent, ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './profs-form.component.html',
  styleUrl: './profs-form.component.css',
})
export class ProfsFormComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profService: ProfsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero_telephone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      domaine_enseignement: ['', Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.profService.getProfById(+id).subscribe((prof) => {
        console.log('Prof reçu pour modification :', prof);

        // Appliquer les valeurs dans le formulaire
        this.formGroup.patchValue({
          nom: prof.nom,
          prenom: prof.prenom,
          email: prof.email,
          numero_telephone: prof.numero_telephone,
          domaine_enseignement: prof.domaine_enseignement,
        });

        // Optionnel : afficher dans la console tout le form
        console.log('Form après patchValue :', this.formGroup.value);
      });
    }
  }

  submit(event: Event): void {
    event.preventDefault();

    if (this.formGroup.invalid) return;

    const id = this.route.snapshot.paramMap.get('id');
    const formData = this.formGroup.value;

    if (id) {
      //  Mise à jour (PUT)
      this.profService.updateProfs(+id, formData).subscribe({
        next: () => {
          this.toastr.success('Professeur mis à jour !');
          this.router.navigate(['/profs/liste']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Erreur lors de la mise à jour");
        },
      });
    } else {
      //  (POST)
      this.profService.addProfs(formData).subscribe({
        next: () => {
          this.toastr.success('Professeur ajouté !');
          this.formGroup.reset();
          this.router.navigate(['/profs/liste']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.success('Professeur ajouté !');
        },
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
