import { Component ,OnInit} from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import {Module} from "../../models/module.model";
import { StudentService } from '../../service/student.service';
import { ModulesService } from '../../service/modules.service';
import { NiveauService } from '../../service/niveau.service';
import { DomaineService } from '../../service/domaine.service';
import { Presence } from '../../models/presence.model';
import { PresenceService } from '../../service/presence.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Domaine } from '../../models/domaine.model';
import { Router } from '@angular/router';
import { EtudiantSeance } from '../../models/EtudiantSeance.model'
import { AuthService } from '../../service/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-presence-saisie',
  imports: [CommonModule,FormsModule,NavbarComponent],
  templateUrl: './presence-saisie.component.html',
  styleUrl: './presence-saisie.component.css'
})
export class PresenceSaisieComponent implements OnInit{

  niveaux: any[] = [];
  modules: Module[] = [];
  etudiants: Etudiant[] = [];
  domaines: Domaine[] = [];
  filteredEtudiants: EtudiantSeance[] = [];
  allEtudiants: Etudiant[] = []; 

  selectedNiveau: string = '';
  selectedModule: number | null = null;
  selectedDomaine: string = '';
  seancesCount: number[] = [];
  presenceData: Record<string, string> = {};
  selectedSeance: number = 0;
  userRole: string | null = null;

  constructor(private studentService: StudentService,private authService: AuthService,private domaineService:DomaineService,private niveauService:NiveauService, private modulesService: ModulesService,private presenceService:PresenceService
  ){}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userRole = user?.role || null;
    this.fetchNiveaux();
    this.fetchModules();
    this.fetchDomaine()

  }
  toNumber(value: any): number {
  return Number(value);
}

  fetchNiveaux() {
    this.niveauService.getNiveau().subscribe((data)=>{
      this.niveaux=data
    })
  }
  fetchModules() {
    this.modulesService.getAll().subscribe((data) => {
      this.modules = data;
    });
  }

  fetchDomaine() {
    this.domaineService.getDomaine().subscribe(data => this.domaines = data);
  }



  

 onFilterChange() {
  if (this.selectedNiveau && this.selectedDomaine) {
    this.studentService.getEtudiantsAvecSeances(this.selectedNiveau, this.selectedDomaine)
      .subscribe({
        next: data => {
          this.filteredEtudiants = data;

          let maxSeances = 0;
          data.forEach(e => {
            if (e.nombre_seance > maxSeances) {
              maxSeances = e.nombre_seance;
            }
          });
          this.seancesCount = Array.from({ length: maxSeances }, (_, i) => i + 1);

          // Charger toujours les présences existantes
          this.loadPresencesExistantes();

          // Charger la séance attendue pour chaque étudiant si rôle prof
          if (this.userRole === 'prof') {
            this.filteredEtudiants.forEach(etu => this.fetchSeanceAttendue(etu));
          }
        },
        error: () => alert("Erreur lors du chargement des étudiants avec séances")
      });
  } else {
    this.filteredEtudiants = [];
    this.seancesCount = [];
  }
}


private loadPresencesExistantes() {
  this.presenceService.getPresencesParNiveauDomaine(this.selectedNiveau, this.selectedDomaine)
    .subscribe({
      next: presences => {
        presences.forEach(p => {
          const key = `${p.num_etudiant}_${p.ref_module}_${p.numero_seance}`;
          this.presenceData[key] = p.etat;
          if (p.observation) {
            this.presenceData[key + '_obs'] = p.observation;
          }

          const etudiant = this.filteredEtudiants.find(e =>
            e.num_etudiant === p.num_etudiant && e.ref_module === p.ref_module
          );
          if (etudiant) {
            if (!etudiant.seancesRenseignees) {
              etudiant.seancesRenseignees = [];
            }
            etudiant.seancesRenseignees.push(p.numero_seance);
          }
        });
      },
      error: () => alert("Erreur lors du chargement des présences existantes")
    });
}


fetchSeanceAttendue(etudiant: EtudiantSeance) {
  if (this.userRole !== 'prof') return; // pas nécessaire pour les autres rôles

  this.presenceService.getSeanceAttendue(etudiant.num_etudiant!, etudiant.ref_module!).subscribe({
    next: data => {
      const key = `${etudiant.num_etudiant}_${etudiant.ref_module}`;
      this.presenceData[key + '_seanceAttendue'] = String(data.seance_attendue)  // stocke la séance attendue
    },
    error: () => console.error("Erreur récupération séance attendue pour étudiant", etudiant.num_etudiant),
  });
}



getKey(etudiantId: number, moduleId: number, seance: number): string {
  return `${etudiantId}_${moduleId}_${seance}`;
}


  

  isAutreSelected(etudiantId: number, moduleId: number, seance: number): boolean {
  if (etudiantId == null) return false;
  const key = `${etudiantId}_${moduleId}_${seance}`;
  return this.presenceData[key] === 'autre';
}


  onEtatChange(etudiantId: number, moduleId: number, seance: number, etat: string) {
  const key = `${etudiantId}_${moduleId}_${seance}`;
  this.presenceData[key] = etat;
}
  onSubmit() {
  if (!this.selectedSeance) {
    alert('Veuillez sélectionner la séance à renseigner.');
    return;
  }

  const presences: Presence[] = [];

  for (const etu of this.filteredEtudiants) {
    const seance = this.selectedSeance; 
    const key = `${etu.num_etudiant}_${etu.ref_module}_${seance}`;
    const etat = this.presenceData[key];

   if (this.userRole === 'prof') {
  const seanceAttendueKey = `${etu.num_etudiant}_${etu.ref_module}_seanceAttendue`;
  const seanceAttendue = this.presenceData[seanceAttendueKey];

  //revoire cette condition 

 /* if (seanceAttendue) {
    const seanceAttendueNum = Number(seanceAttendue);
    const selectedSeanceNum = Number(this.selectedSeance);
    console.log("la seance attendue est ",seanceAttendue)
    console.log("la seance selectione  est ",selectedSeanceNum)

    if (selectedSeanceNum !== seanceAttendueNum) {
      alert(`Vous ne pouvez renseigner que la séance ${seanceAttendue} pour l'étudiant ${etu.nom} ${etu.prenom} (${etu.intitule}).`);
      return;
    }
  }*/
}



    const obsInput = (document.querySelector(
      `input[name='obs_${key}']`
    ) as HTMLInputElement)?.value;

    if (etat) {
      presences.push({
        num_etudiant: etu.num_etudiant!,
        ref_module: etu.ref_module!,
        numero_seance: seance,
        etat: etat as 'present' | 'absent',
        observation: obsInput?.trim() || undefined,
      });
    }
  }

  if (presences.length === 0) {
    alert("Aucune donnée de présence n'a été renseignée pour la séance sélectionnée.");
    return;
  }

  this.presenceService.enregistrerPresences(presences).subscribe({
  next: () => {
    alert('Présences enregistrées avec succès');
    location.reload();
  },
  error: () => alert("Erreur lors de l'enregistrement"),
});

}



compterEtat(etudiantId: number, etatCherche: string, moduleId: number): number {
  return this.seancesCount.reduce((total, seance) => {
    const key = `${etudiantId}_${moduleId}_${seance}`;
    return this.presenceData[key] === etatCherche ? total + 1 : total;
  }, 0);
}

getObservations(etudiantId: number, moduleId: number): string {
  const observations: string[] = [];
  this.seancesCount.forEach(seance => {
     const obsKey = `${etudiantId}_${moduleId}_${seance}_obs`;
    const obs = this.presenceData[obsKey];
    if (obs) {
      observations.push(`Séance ${seance}: ${obs}`);
    }
  
  });
  return observations.join('; ');
}



imprimerPresence() {
  const today = new Date();
  const dateString = today.toLocaleDateString();
  const niveau = this.selectedNiveau || "Tous niveaux";
  const domaine = this.selectedDomaine || "Tous domaines";

  const contenu = `
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #333;
          background-color: #f9f9f9;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 28px;
        }

        .header p {
          font-size: 14px;
          color: #555;
        }

        .info-block {
          text-align: center;
          margin-bottom: 30px;
          font-size: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 14px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
        }

        th {
          background-color: #2c3e50;
          color: white;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Feuille de Présence</h1>
        <p>Générée le ${dateString}</p>
      </div>

      <div class="info-block">
        <strong>Niveau :</strong> ${niveau} &nbsp; | &nbsp;
        <strong>Domaine :</strong> ${domaine}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Module</th>
            <th>Présences</th>
            <th>Absences</th>
            <th>Observations</th>
          </tr>
        </thead>
        <tbody>
  ${
    this.filteredEtudiants.length > 0
      ? this.filteredEtudiants.map(etu => {
          const nbPresences = this.compterEtat(etu.num_etudiant!, 'present', etu.ref_module!);
          const nbAbsences = this.compterEtat(etu.num_etudiant!, 'absent', etu.ref_module!);
          const observations = this.getObservations(etu.num_etudiant!, etu.ref_module!);

          return `
            <tr>
              <td>${etu.nom}</td>
              <td>${etu.prenom}</td>
              <td>${etu.intitule}</td>
              <td>${nbPresences}</td>
              <td>${nbAbsences}</td>
              <td>${observations}</td>
            </tr>
          `;
        }).join('')
      : `<tr><td colspan="6">Aucun étudiant trouvé</td></tr>`
  }
</tbody>

      </table>

      <div class="footer">
        Projet de gestion scolaire – ${today.getFullYear()}
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

exporterCSV() {
  const lignes: string[] = [];

  // En-têtes du CSV
  const headers = ['Nom', 'Prénom', 'Module', 'Présences', 'Absences', 'Observations'];
  lignes.push(headers.join(';')); // utiliser ; pour compatibilité Excel

  // Données des étudiants
  this.filteredEtudiants.forEach(etu => {
    const nbPresences = this.compterEtat(etu.num_etudiant!, 'present', etu.ref_module!);
    const nbAbsences = this.compterEtat(etu.num_etudiant!, 'absent', etu.ref_module!);
    const observations = this.getObservations(etu.num_etudiant!, etu.ref_module!);

    const ligne = [
      etu.nom,
      etu.prenom,
      etu.intitule,
      nbPresences.toString(),
      nbAbsences.toString(),
      observations.replace(/;/g, ',') // éviter de casser le CSV avec des ; dans les obs
    ];

    lignes.push(ligne.join(';'));
  });

  const contenuCSV = lignes.join('\n');
  const blob = new Blob([contenuCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Feuille_Presence_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}


}



