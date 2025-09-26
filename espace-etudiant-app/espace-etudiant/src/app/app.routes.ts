
import { Routes } from '@angular/router';

import { Login } from './auth//login/login';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { Profile } from './profile/profile/profile';
import { Planning } from './planning/planning/planning';
import { Certificats } from './certificats/certificats/certificats';
import { Assistance } from './assistance/assistance/assistance';
import { Accueil } from './accueil/accueil';
import { Certificat } from './certificat/certificat';
import { Attestation } from './attestation/attestation';
import { Notes } from './notes/notes';

export const routes: Routes = [
    
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'accueil', component:Accueil},
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'profile', component: Profile },
  { path: 'planning', component: Planning },
  { path: 'certificats', component: Certificats },
  { path: 'assistance', component: Assistance },
  { path: 'certificat', component: Certificat },
  {path: 'atestsation', component: Attestation },
  {path: 'notes', component: Notes },
  
];

export class AppRoutingModule {}
