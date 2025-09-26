import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModulesService } from '../../service/modules.service';
import { DomaineService } from '../../service/domaine.service';
import { Module } from '../../models/module.model';
import { Domaine } from '../../models/domaine.model';

@Component({
  selector: 'app-modules-form',
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './modules-form.component.html',
  styleUrl: './modules-form.component.css'
})
export class ModulesFormComponent implements OnInit {
  private moduleservice = inject(ModulesService);
  private domaineService = inject(DomaineService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  modules: Module[] = [];
  domaines: Domaine[] = [];
  isEdit = false;

  formGroup = this.fb.nonNullable.group({
    ref_module: this.fb.control<number | null>(null),
    intitule: this.fb.control('', Validators.required),
    nbr_heures: this.fb.control(0, Validators.required),
    nbr_seances: this.fb.control(0, Validators.required),
    type: this.fb.control('', Validators.required),
    domaine: this.fb.control('', Validators.required) // champ du select (contient ref_domaine)
  });

  ngOnInit(): void {
    this.moduleservice.getAll().subscribe((data) => {
      this.modules = data;
    });

    this.domaineService.getDomaine().subscribe((data) => {
      this.domaines = data;
    });
  }

  verificationChamps(champ: string): boolean {
    const control = this.formGroup.get(champ);
    return !!control && control.touched && control.invalid;
  }

  onSubmit(): void {
  if (this.formGroup.invalid) return;

  const formValue = this.formGroup.value;

  const ref_domaine = Number(formValue.domaine);
  const domaineTrouve = this.domaines.find(d => d.ref_domaine === ref_domaine);

  const moduleToSend: Module = {
  ref_module: formValue.ref_module ?? undefined,
  intitule: formValue.intitule!,
  nbr_heures: formValue.nbr_heures!,
  nbr_seances: formValue.nbr_seances!,
  type: formValue.type!,
  ref_domaine: ref_domaine,
  domaine: domaineTrouve ? domaineTrouve.intitule : '' // Ajout obligatoire
};
  console.log("Form value envoyé au backend :", this.formGroup.value);

  const moduleAffichable: Module = {
    ...moduleToSend,
    domaine: domaineTrouve ? domaineTrouve.intitule : ''
  };

  if (this.isEdit && formValue.ref_module) {
    this.moduleservice.updateModule(formValue.ref_module, moduleToSend).subscribe(() => {
      const index = this.modules.findIndex(m => m.ref_module === formValue.ref_module);
      if (index > -1) this.modules[index] = moduleAffichable;
      this.toastr.success("Module modifié avec succès !");
      this.formGroup.reset();
      this.isEdit = false;
    });
  } else {
    this.moduleservice.addModule(moduleToSend).subscribe((result) => {
      this.modules.push({ ...moduleAffichable, ref_module: result.ref_module });
      this.toastr.success("Module ajouté !");
      this.formGroup.reset();
    });
  }
}


  onEdit(m: Module): void {
    this.isEdit = true;
    const domaineRef = this.domaines.find(d => d.intitule === m.domaine)?.ref_domaine || '';
    this.formGroup.patchValue({ ...m, domaine: String(domaineRef) });
  }

  onDelete(ref_module: number): void {
    if (!confirm("Voulez-vous vraiment supprimer ce module ?")) return;

    this.moduleservice.deleteModule(ref_module).subscribe(() => {
      this.modules = this.modules.filter(m => m.ref_module !== ref_module);
      this.toastr.error("Module supprimé.");
    });
  }
}
