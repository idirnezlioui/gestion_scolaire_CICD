import { DomaineService } from './../../service/domaine.service';
import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Domaine } from '../../models/domaine.model';
import {
  SpecialiteService,
  Specialite,
} from '../../service/specialite.service';
import { ToastrService } from 'ngx-toastr';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-domaines-form',
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './domaines-form.component.html',
  styleUrl: './domaines-form.component.css',
})
export class DomainesFormComponent implements OnInit {
  private DomaineService = inject(DomaineService);
  private specialiteService = inject(SpecialiteService);
  specialites: Specialite[] = [];
  selectedDomaineId: number | null = null;
  domaines: Domaine[] = [];
  isEdit = false;
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  @ViewChild('formRef') formRef!: ElementRef;

  formGroup = this.fb.group({
    sigle_specia: ['', [Validators.required]],
    intitule: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.DomaineService.getDomaine().subscribe((data) => {
      this.domaines = data;
    });

    this.specialiteService.getAll().subscribe((data) => {
      this.specialites = data;
    });
  }

  verificationChamps(champ: string): boolean {
    const control = this.formGroup.get(champ);
    return !!control && control.touched && control.invalid;
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    const formValue = this.formGroup.value as Domaine;

    if (this.isEdit && this.selectedDomaineId !== null) {
      this.DomaineService.updateDomaine(
        this.selectedDomaineId,
        formValue
      ).subscribe(() => {
        const index = this.domaines.findIndex(
          (d) => d.ref_domaine === this.selectedDomaineId
        );
        if (index !== -1) {
          this.domaines[index] = { ...this.domaines[index], ...formValue };
        }

        this.toastr.success('Domaine modifié avec succès !');
      });
    } else {
      this.DomaineService.addDomaine(formValue).subscribe((createdDomaine) => {
        this.DomaineService.getDomaine().subscribe((data) => {
          this.domaines = data;
        });

        this.toastr.success('Domaine ajouté avec succès !');
      });
    }
  }

  onEdit(domaine: Domaine): void {
    this.isEdit = true;
    this.formGroup.patchValue({
      intitule: domaine.intitule,
      sigle_specia: domaine.sigle_specia,
    });
    this.selectedDomaineId = domaine.ref_domaine;

    this.formRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  onDelete(ref_domaine: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce domaine ?')) {
      this.DomaineService.deleteDomaine(ref_domaine).subscribe(() => {
        this.domaines = this.domaines.filter(
          (d) => d.ref_domaine !== ref_domaine
        );
        this.formGroup.reset();
        this.isEdit = false;
        this.selectedDomaineId = null;
        this.toastr.error('Domaine supprimé');
      });
    }
  }
}
