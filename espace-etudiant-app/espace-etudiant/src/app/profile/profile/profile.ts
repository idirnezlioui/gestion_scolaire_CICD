import { Component, OnInit } from '@angular/core';
import { Sidebar } from "../../layout/sidebar/sidebar";
import { DatePipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { EtudiantService } from '../../services/etudiantService';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [Sidebar, DatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  form: FormGroup = new FormGroup({});
  readOnly = true;
  etuId!: number;

  constructor(private fb: FormBuilder, private etuSrv: EtudiantService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decoded: any = token ? jwtDecode(token) : null;
    this.etuId = decoded?.id;

    this.form = this.fb.group({
      nom: [{ value: '', disabled: true }, Validators.required],
      prenom: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      numero_telephone: [{ value: '', disabled: true }, Validators.required],
      date_naiss: [{ value: '', disabled: true }],
      lieu_naiss: [{ value: '', disabled: true }],
      nationalite: [{ value: '', disabled: true }],
      niveau: [{ value: '', disabled: true }],
      domaine: [{ value: '', disabled: true }],
      type_session: [{ value: '', disabled: true }],
    });

    // 1) Pré-remplir depuis le cache si dispo (instantané après refresh)
    if (this.etuSrv.current) {
      this.patchFrom(this.etuSrv.current);
    }

    // 2) Charger depuis l’API puis re‑patcher (source de vérité)
    this.etuSrv.getEtudiantById(this.etuId).subscribe({
      next: ({ etudiant }) => this.patchFrom(etudiant),
      error: (err) => console.error('GET /etudiants/:id KO', err)
    });
  }

  private toIsoDate(v: any) {
    const d = new Date(v);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  }

  private patchFrom(e: any) {
    this.form.patchValue({
      nom: e.nom,
      prenom: e.prenom,
      email: e.email,
      numero_telephone: e.numero_telephone,
      date_naiss: this.toIsoDate(e.date_naiss),
      lieu_naiss: e.lieu_naiss,
      nationalite: e.nationalite,
      niveau: e.niveau,
      domaine: e.intitule_domaine ?? e.domaine,
      type_session: e.type_session,
    });
  }

  toggleEdit() {
    this.readOnly = !this.readOnly;
    const editable = ['email', 'numero_telephone', 'date_naiss', 'lieu_naiss', 'nationalite'];
    editable.forEach(c => this.readOnly ? this.form.get(c)!.disable() : this.form.get(c)!.enable());
  }

  save() {
    if (this.form.invalid) return;
    const { email, numero_telephone, date_naiss, lieu_naiss, nationalite } = this.form.getRawValue();
    this.etuSrv.updatePersonal(this.etuId, { email, numero_telephone, date_naiss, lieu_naiss, nationalite })
      .subscribe({
        next: () => { this.toggleEdit(); alert('Profil mis à jour'); },
        error: () => alert('Erreur de mise à jour')
      });
  }
}
