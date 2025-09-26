import { Niveau } from './../../models/niveau.model';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NiveauService } from '../../service/niveau.service';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-niveaux-form',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,NavbarComponent],
  templateUrl: './niveaux-form.component.html',
  styleUrl: './niveaux-form.component.css'
})
export class NiveauxFormComponent implements OnInit{
  private niveauService =inject(NiveauService)
  private fb=inject(FormBuilder)
  private toaster=inject(ToastrService)

  niveaux:Niveau[]=[]
  isEdit=false

  formGroup=this.fb.nonNullable.group({
    id_niveau: this.fb.control<number | null>(null),
    niveau: this.fb.control('', Validators.required),
    tarifs: this.fb.control(0, [Validators.required, Validators.min(0)]),
  })

  sanitizeFormValue(): Niveau {
  const raw = this.formGroup.value;

  return {
    niveau: raw.niveau ?? '',
    tarifs: raw.tarifs ?? 0,
    ...(raw.id_niveau ? { id_niveau: raw.id_niveau } : {}),
  };
}

  ngOnInit(): void {
    this.load();
  }
  load(){
    this.niveauService.getNiveau().subscribe((data)=>(this.niveaux=data))
  }

   verificationChamp(champ: string): boolean {
    const control = this.formGroup.get(champ);
    return !!control && control.touched && control.invalid;
  }
    onSubmit(): void {

      
    if (this.formGroup.invalid) return;

    const value = this.sanitizeFormValue();

    if (this.isEdit && value.id_niveau) {
      this.niveauService.updateNiveau(value.id_niveau, value).subscribe(() => {
        const index = this.niveaux.findIndex((n) => n.id_niveau === value.id_niveau);
        if (index > -1) this.niveaux[index] = value;
        this.toaster.success('Niveau modifié');
        this.formGroup.reset();
        this.isEdit = false;
      });
    } else {
      this.niveauService.addNiveau(value).subscribe((created) => {
        this.niveaux.push(created);
        this.toaster.success('Niveau ajouté');
        this.formGroup.reset();
      });
    }
  }

  onEdit(n: Niveau) {
    this.formGroup.patchValue(n);
    this.isEdit = true;
  }

  onDelete(id: number) {
    if (!confirm('Confirmer la suppression ?')) return;
    this.niveauService.deleteNiveau(id).subscribe(() => {
      this.niveaux = this.niveaux.filter((n) => n.id_niveau !== id);
      this.toaster.error('Niveau supprimé');
    });
  }

  cancel() {
    this.formGroup.reset();
    this.isEdit = false;
  }
}
