import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Session } from '../../models/session.model';
import { SessionService } from '../../service/session.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sessions-form',
  imports: [NavbarComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './sessions-form.component.html',
  styleUrl: './sessions-form.component.css'
})
export class SessionsFormComponent implements OnInit {

   formGroup!: FormGroup;
  sessions: Session[] = [];
  isEdit = false;
  currentId: number | null = null;
  typeOptions = ["octobre","fvérier"];
  private toaster=inject(ToastrService)

  constructor(private fb: FormBuilder, private sessionService: SessionService) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      date_deb: ['', Validators.required],
      date_fin: ['', Validators.required],
      annee: ['', Validators.required],
      type_session: ['', Validators.required],
    },{
      Validators:this.minThreeMonthsValidator
    }
  
  );

    this.loadSessions();
  }

  loadSessions() {
    this.sessionService.getSession().subscribe(data => {
      this.sessions = data;
    });
  }

  onSubmit() {
    if (this.isEdit && this.currentId !== null) {
      this.sessionService.updateSession(this.currentId, this.formGroup.value).subscribe(() => {
        this.toaster.success('Session modifié');
        this.loadSessions();
        this.resetForm();
      });
    } else {
      this.sessionService.createSession(this.formGroup.value).subscribe(() => {
        this.toaster.success('Session ajouté');
        this.loadSessions();
        this.resetForm();
      });
    }
  }

  onEdit(session: Session) {
    this.isEdit = true;
    this.currentId = session.id_session!;
    this.formGroup.patchValue(session);
  }

  onDelete(id: number) {
    this.sessionService.deleteSession(id).subscribe(() => {
      this.toaster.error('Session supprimé');
      this.loadSessions();
    });
  }

  resetForm() {
    this.isEdit = false;
    this.currentId = null;
    this.formGroup.reset();
  }

  minThreeMonthsValidator(formGroup: FormGroup) {
  const start = new Date(formGroup.get('date_deb')?.value);
  const end = new Date(formGroup.get('date_fin')?.value);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  return diffMonths >= 3 ? null : { validationDate: true };
}



  verificationChamps(champ: string) {
    const field = this.formGroup.get(champ);
    return field?.invalid && (field.dirty || field.touched);
  }
}
