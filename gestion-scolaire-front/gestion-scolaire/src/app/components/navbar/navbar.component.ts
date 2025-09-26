import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit{
  isAdmin = false;
  isProf=false
  menuOpen = false;

  constructor(private router: Router,private auth:AuthService) {}
  
 ngOnInit(): void {
  this.isAdmin = this.auth.isAdmin();
  this.isProf=this.auth.isProf()
}
  

  navigaTo(link: string) {
    this.router.navigate([link]);
  }

  optionsEtudiants = [
    { label: 'Étudiant inscrit', link: '/students/form' },
    { label: 'Étudiant en attente', link: '/students' },
    { label: 'Ajouter étudiant', link: '/students/form' },
    { label: 'Modification', link: '/' },
  ];
  selectedOptionEt = this.optionsEtudiants[0].link;

  optionsEnseignants = [
    { label: 'Ajouter Enseignant', link: '/profs/form' },
    { label: 'Gestion des affectations', link: '/profs/affectation' },
    { label: 'Liste , Modifier un Enseignant', link: '/profs/liste' },
  ];
  selectedOptionEs = this.optionsEnseignants[0].link;

  optionsPaiement = [
    { label: 'Consulter état de paiement', link: '/' },
    { label: 'Effectuer un paiement', link: '/student/paiment' },
  ];
  selectedOptionPm = this.optionsPaiement[0].link;

  optionsDocuments = [
    { label: 'Imprimer un reçu de paiement', link: '/' },
    { label: 'Certificat de scolarité', link: '/' },
    { label: "Attestation d'inscription", link: '/' },
  ];
  selectedOptionDc = this.optionsDocuments[0].link;
  aproposOptions = [
    {
      label: 'Spécialités',
      children: [
        { label: 'Ajouter / Modifier', link: '/specialite/add' },
        { label: 'Supprimer', link: '/specialite/delete' },
      ],
    },
    {
      label: 'Domaines',
      children: [
        { label: 'Ajouter / Modifier', link: '/domaines/form' },
        { label: 'Supprimer', link: '/domaines/delete' },
      ],
    },
    {
      label: 'Niveaux',
      children: [
        { label: 'Ajouter / Modifier', link: '/niveaux/form' },
        { label: 'Supprimer', link: '/niveaux/delete' },
      ],
    },

    {
      label: 'Modules',
      children: [
        { label: 'Ajouter / Modifier', link: '/modules/form' },
        { label: 'Supprimer', link: '/modules/delete' },
      ],
    },

      {
      label: 'Sessions',
      children: [
        { label: 'Ajouter / Modifier', link: '/session/form' },
        { label: 'Supprimer', link: '/session/delete' },
      ],
    },
  ];

  optionsNotes = [
    { label: 'ajouter notes', link: '/notes/form' },
    { label: 'imprimer relevé', link: '/notes/form' },
  ];
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  ngAfterViewInit() {
  const submenuItems = document.querySelectorAll('.dropdown-submenu');

  submenuItems.forEach((item: any) => {
    item.addEventListener('mouseenter', () => {
      const submenuList = item.querySelector('.dropdown-submenu-list');
      if (submenuList) {
        const rect = submenuList.getBoundingClientRect();
        const willOverflow = rect.left + submenuList.offsetWidth > window.innerWidth;

        if (willOverflow) {
          item.classList.add('adjust-left');
        } else {
          item.classList.remove('adjust-left');
        }
      }
    });
  });
}

  isConnected(): boolean {
  return !!this.auth.getUser(); // true si utilisateur connecté
}
logout() {
  this.auth.logout();
}

}
