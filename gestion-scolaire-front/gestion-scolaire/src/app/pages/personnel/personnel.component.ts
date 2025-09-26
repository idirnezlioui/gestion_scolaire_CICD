import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Utilisateur } from '../../models/utilisateur.model';
import { UtilisateurService } from '../../service/utilisateur.service';
import { NavbarComponent } from "../../components/navbar/navbar.component";


@Component({
  selector: 'app-personnel',
  imports: [ReactiveFormsModule, NavbarComponent,FormsModule],
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.css'
})
export class PersonnelComponent  implements OnInit {

   form: FormGroup;
  utilisateurs: Utilisateur[] = [];
  editId: number | null = null;
  allUtilisateurs:Utilisateur[]=[]
  selectedRol:string=""
  

  constructor(private fb: FormBuilder, private service: UtilisateurService) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      mot_pass: ['', [Validators.required, Validators.minLength(6)]],
      diplome: ['', Validators.required],
      role: ['user', Validators.required]
    });
  }

  

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs() {
    this.service.getAll().subscribe(data => {
    this.utilisateurs = data;
  this.allUtilisateurs = data; // <-- nécessaire pour le filtre
});
  }

  submit() {
    const utilisateur = this.form.value as Utilisateur;
    if (this.editId) {
      this.service.update(this.editId, utilisateur).subscribe(() => {
        this.editId = null;
        this.form.reset({ role: 'user' });
        this.loadUtilisateurs();
      });
    } else {
      this.service.create(utilisateur).subscribe(() => {
        this.form.reset({ role: 'user' });
        this.loadUtilisateurs();
      });
    }
    if (this.form.invalid) {
    alert("Veuillez corriger les erreurs dans le formulaire.");
    return;
  }
  }

  edit(user: Utilisateur) {
    this.form.patchValue(user);
    this.editId = user.id_utilisateur!;
  }

  remove(id: number) {
    if (confirm("Voulez-vous supprimer cet utilisateur ?")) {
      this.service.delete(id).subscribe(() => this.loadUtilisateurs());
    }
  }

  applyFilter(): void {
  this.utilisateurs = this.allUtilisateurs.filter(e =>
    !this.selectedRol || e.role === this.selectedRol
  );
}
isInvalid(controlName: string): boolean {
  const control = this.form.get(controlName);
  return !!control && control.invalid && (control.dirty || control.touched);
}
}