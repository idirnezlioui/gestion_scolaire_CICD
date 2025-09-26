import { NiveauxFormComponent } from './pages/niveaux-form/niveaux-form.component';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { StudentFormComponent } from './pages/student-form/student-form.component';
import { StudentFicheComponent } from './pages/student-fiche/student-fiche.component';
import { StudentPaimentComponent } from './pages/student-paiment/student-paiment.component';
import { SpecialitesFormComponent } from './pages/specialites-form/specialites-form.component';
import { DomainesFormComponent } from './pages/domaines-form/domaines-form.component';
import { ModulesFormComponent } from './pages/modules-form/modules-form.component';
import { SessionsFormComponent } from './pages/sessions-form/sessions-form.component';
import { NotesFormComponent } from './pages/notes-form/notes-form.component';
import { ProfsFormComponent } from './pages/profs-form/profs-form.component';
import { ProfsListComponent } from './pages/profs-list/profs-list.component';
import { ProfsAffectationComponent } from './pages/profs-affectation/profs-affectation.component';
import { AlertePaiementComponent } from './pages/alerte-paiement/alerte-paiement.component';
import { LoginComponent } from './pages/login/login.component';
import { PersonnelComponent } from './pages/personnel/personnel.component';
import { HistoriqueEtudiantComponent } from './pages/historique-etudiant/historique-etudiant.component';
import { HistoriquePaiementsComponent } from './pages/historique-paiements/historique-paiements.component';
import { PresenceSaisieComponent } from './pages/presence-saisie/presence-saisie.component';

export const routes: Routes = [
  //la route par defaut
 {
  path: '',
  redirectTo: 'login',
  pathMatch: 'full',
},
  {
    path: 'students',
    component: StudentListComponent,
  },
  { path: 'students/form', component: StudentFormComponent },
  { path: 'students/form/:id', component: StudentFormComponent },
  {
    path: 'students/fiche',
    component: StudentFicheComponent,
  },
  {
    path: 'student/paiment',
    component: StudentPaimentComponent,
  },
  {
  path: 'paiement/:id',
  component: StudentPaimentComponent
},
  {
    path: 'specialite/add',
    component: SpecialitesFormComponent,
  },
  {
    path: 'specialite/delete',
    component: SpecialitesFormComponent,
  },
  {
    path: 'domaines/form',
    component: DomainesFormComponent,
  },
  {
    path: 'domaines/delete',
    component: DomainesFormComponent,
  },
  {
    path: 'modules/form',
    component: ModulesFormComponent,
  },
  {
    path: 'modules/delete',
    component: ModulesFormComponent,
  },
  {
    path: 'niveaux/form',
    component: NiveauxFormComponent,
  },
  {
    path: 'session/form',
    component: SessionsFormComponent,
  },
  {
    path: 'notes/form',
    component: NotesFormComponent,
  },
  {
    path: 'profs/form',
    component: ProfsFormComponent,
  },
  {
    path: 'profs/liste',
    component: ProfsListComponent,
  },
  { path: 'profs/edit/:id', component: ProfsFormComponent },
   {
    path: 'profs/affectation',
    component: ProfsAffectationComponent,
  },
  {
    path:'alertes/paiement',
    component:AlertePaiementComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'utilisateurs',
    component:PersonnelComponent
  },
  {
    path:'historique/ajout-etudiant',
    component:HistoriqueEtudiantComponent
  }
  ,
  {
    path:'historique/paiements',
    component:HistoriquePaiementsComponent
  },
  {
    path:'presence',
    component:PresenceSaisieComponent
  }
];
