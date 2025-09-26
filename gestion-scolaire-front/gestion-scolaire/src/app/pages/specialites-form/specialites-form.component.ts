import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SpecialiteService,
  Specialite,
} from '../../service/specialite.service';
@Component({
  selector: 'app-specialites-form',
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './specialites-form.component.html',
  styleUrl: './specialites-form.component.css',
})
export class SpecialitesFormComponent implements OnInit {
  private specialiteService = inject(SpecialiteService);

  specialites: Specialite[] = [];
  isEdit = false;
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  //pour le update je stock l'encien sigle si l'intitule et carrement modifiet donc meme le sigle qui est une cléprimaire vas change 

  private oldSigle: string | null = null;



  formGroup = this.fb.group({
    sigle_specia: ['', [Validators.required]],
    intitule: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.specialiteService.getAll().subscribe((data) => {
      this.specialites = data;
    });

    this.formGroup.get('intitule')?.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        const sigle = this.genererSigle(value);
        this.formGroup
          .get('sigle_specia')
          ?.setValue(sigle, { emitEvent: false });
      }
    });
  }

  //fonction pour genere automatiqeument le sigle

  genererSigle(intitule: string): string {
  if (!intitule) return '';

  // Liste des mots à ignorer
  const motsIgnorés = ['et', 'de', 'des', 'du', 'la', 'le', 'l’', 'l\'', 'd’', 'd\'', 'à', 'en', 'dans', 'sur', 'au'];

  const mots = intitule
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(mot => !motsIgnorés.includes(mot.toLowerCase()) && mot.length > 0);

  if (mots.length === 1) {
    return mots[0].slice(0, 4);
  } else {
    return mots
      .map(mot => mot.charAt(0).toUpperCase())
      .join('');
  }
}


  verificationChamps(champ: string): boolean {
    const control = this.formGroup.get(champ);
    return !!control && control.touched && control.invalid;
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    const formValue =this.formGroup.value as Specialite

    if (this.isEdit && this.oldSigle) {
      this.specialiteService.updateSpecialite(this.oldSigle,formValue).subscribe((update)=>{
        const index=this.specialites.findIndex(s=>s.sigle_specia === this.oldSigle)
        if (index !== -1)this.specialites[index]=update 
          this.formGroup.reset()
          this.isEdit=false
          this.oldSigle=null
        this.toastr.info('Spécialité modifiée avec succès !', 'Modification')
        
      })
    } else {
      this.specialiteService.addSpecialite(formValue).subscribe((result) => {
        this.specialites.push(result);
        this.formGroup.reset();
        this.isEdit = false;
        this.toastr.success('Spécialité ajoutée avec succès !', 'Ajout');
      });
      
    }


    
  }

  onEdit(specialite: any): void {
    this.isEdit = true;
    this.oldSigle=specialite.sigle_specia
    this.formGroup.patchValue(specialite);
  }
  onDelete(sigle: string): void {
    this.specialiteService.deleteSpecialite(sigle).subscribe(()=>{
    this.specialites=this.specialites.filter(s=>s.sigle_specia !== sigle)
    this.formGroup.reset();
    this.isEdit = false;
    this.toastr.error('Spécialité supprimée.', 'Suppression');
    })
    
  }
}
