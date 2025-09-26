import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TeacherSearchComponent } from '../../components/teacher-search/teacher-search.component';
import { ProfsService } from '../../service/profs.service';
import { ModulesService } from '../../service/modules.service';
import { NiveauService } from '../../service/niveau.service';
import { ProfAffectationService } from '../../service/prof-affectation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profs-affectation',
  standalone: true,
  imports: [NavbarComponent, TeacherSearchComponent, FormsModule],
  templateUrl: './profs-affectation.component.html',
  styleUrl: './profs-affectation.component.css',
})
export class ProfsAffectationComponent implements OnInit {
  selectedProf: any = null;
  modules: any[] = [];
  niveaux: any[] = [];
  selctedModule: any[] = [];
  selectedNiveaux: any[] = [];


  affectationsActuelles: { ref_module: number; id_niveau: number }[] = [];

  constructor(
    private toastr: ToastrService,
    private modulesService: ModulesService,
    private niveauService: NiveauService,
    private affectationService: ProfAffectationService
  ) {}

  ngOnInit(): void {
    this.modulesService.getAll().subscribe({
      next: (mods) => {
        console.log('Modules récupérés :', mods);
        this.modules = mods;
      },
      error: (err) => console.error('Erreur modules', err),
    });

    this.niveauService.getNiveau().subscribe({
      next: (nivs) => {
        console.log('Niveaux récupérés :', nivs);
        this.niveaux = nivs;
      },
      error: (err) => console.error('Erreur niveaux', err),
    });
  }

  onProfSelected(prof: any) {
    this.selectedProf = prof;
    // charger les affectations existantes
    this.affectationService
      .getAffectationsByProf(prof.id_prof)
      .subscribe((data) => {
        this.selctedModule = data.map(
          (a: { ref_module: number }) => a.ref_module
        );
        this.selectedNiveaux = data.map(
          (a: { id_niveau: number }) => a.id_niveau
        );
      });

    this.affectationService
      .getAffectationsByProf(prof.id_prof)
      .subscribe((data) => {
        this.selctedModule = data.map((a) => a.ref_module);
        this.selectedNiveaux = data.map((a) => a.id_niveau);
        this.affectationsActuelles = data;
      });
  }

  toggleModule(ref_module: number) {
    const index = this.selctedModule.indexOf(ref_module);
    const action = index > -1 ? 'remove' : 'add';

    if (action === 'add') {
      this.selctedModule.push(ref_module);

      this.selectedNiveaux.forEach((id_niveau) => {
        this.affectationService
          .addSingle({
            id_prof: this.selectedProf.id_prof,
            ref_module,
            id_niveau,
          })
          .subscribe();
      });
    } else {
      this.selctedModule.splice(index, 1);

      this.affectationService
        .deleteByModule({
          id_prof: this.selectedProf.id_prof,
          ref_module,
        })
        .subscribe();
    }
  }

  toggleNiveau(id_niveau: number) {
    const index = this.selectedNiveaux.indexOf(id_niveau);
    const action = index > -1 ? 'remove' : 'add';

    if (action === 'add') {
      this.selectedNiveaux.push(id_niveau);

      this.selctedModule.forEach((ref_module) => {
        this.affectationService
          .addSingle({
            id_prof: this.selectedProf.id_prof,
            ref_module,
            id_niveau,
          })
          .subscribe();
      });
    } else {
      this.selectedNiveaux.splice(index, 1);

      this.affectationService
        .deleteByNiveau({
          id_prof: this.selectedProf.id_prof,
          id_niveau,
        })
        .subscribe();
    }
  }

  submitAffectation(): void {
    if (!this.selectedProf) return;

    const total = this.selctedModule.length * this.selectedNiveaux.length;
    let done = 0;

    this.selctedModule.forEach((ref_module) => {
      this.selectedNiveaux.forEach((id_niveau) => {
        this.affectationService
          .addSingle({
            id_prof: this.selectedProf.id_prof,
            ref_module,
            id_niveau,
          })
          .subscribe({
            next: () => {
              done++;
              if (done === total) {
                this.toastr.success('Affectation enregistrée avec succès');
                this.rechargerAffectations();
              }
            },
            error: (err) => {
              console.error(" Erreur lors de l'envoi :", err);
                this.toastr.error("Erreur lors de l'enregistrement");
            },
          });
      });
    });
  }

  rechargerAffectations() {
    if (!this.selectedProf) return;

    this.affectationService
      .getAffectationsByProf(this.selectedProf.id_prof)
      .subscribe((data) => {
        this.affectationsActuelles = data;
        this.selctedModule = data.map((a) => a.ref_module);
        this.selectedNiveaux = data.map((a) => a.id_niveau);
      });
  }

  getModuleLabel(ref_module: number): string {
    return (
      this.modules.find((m) => m.ref_module === ref_module)?.intitule || '...'
    );
  }

  getNiveauLabel(id_niveau: number): string {
    return this.niveaux.find((n) => n.id_niveau === id_niveau)?.niveau || '...';
  }

  retirerAffectation(aff: { ref_module: number, id_niveau: number }) {
  this.affectationService.deleteSingle({
    id_prof: this.selectedProf.id_prof,
    ref_module: aff.ref_module,
    id_niveau: aff.id_niveau
  }).subscribe(() => {
    this.affectationsActuelles = this.affectationsActuelles.filter(a =>
      !(a.ref_module === aff.ref_module && a.id_niveau === aff.id_niveau)
    );
  });
}
imprimerFicheProf() {
  const prof = this.selectedProf;
  const affectations = this.affectationsActuelles;

  const contenu = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          margin: 0;
          color: #2c3e50;
        }

        .header p {
          font-size: 14px;
          color: #555;
        }

        .info-block {
          margin-bottom: 30px;
        }

        .info-block h2 {
          color: #2e6da4;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }

        .info-block p {
          margin: 8px 0;
          font-size: 15px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 14px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: left;
        }

        th {
          background-color: #f2f2f2;
          color: #2c3e50;
        }

        tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .footer {
          text-align: center;
          margin-top: 60px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Fiche Enseignant</h1>
        <p>Imprimée le ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="info-block">
        <h2>Informations personnelles</h2>
        <p><strong>Nom :</strong> ${prof.nom}</p>
        <p><strong>Prénom :</strong> ${prof.prenom}</p>
        <p><strong>Email :</strong> ${prof.email}</p>
        <p><strong>Téléphone :</strong> ${prof.numero_telephone}</p>
        <p><strong>Domaine :</strong> ${prof.domaine_enseignement}</p>
      </div>

      <div class="info-block">
        <h2>Modules & Niveaux enseignés</h2>
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th>Niveau</th>
            </tr>
          </thead>
          <tbody>
            ${
              affectations.length > 0
                ? affectations.map(a => `
                  <tr>
                    <td>${this.getModuleLabel(a.ref_module)}</td>
                    <td>${this.getNiveauLabel(a.id_niveau)}</td>
                  </tr>
                `).join('')
                : `<tr><td colspan="2">Aucune affectation trouvée</td></tr>`
            }
          </tbody>
        </table>
      </div>

      <div class="footer">
        Projet de gestion scolaire – ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `;

  const fenetre = window.open('', '_blank');
  if (fenetre) {
    fenetre.document.open();
    fenetre.document.write(contenu);
    fenetre.document.close();
    fenetre.print();
  }
}


}
