import { Component, OnInit } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { StudentService } from '../../service/student.service';
import { Router } from '@angular/router';
import { DomaineService } from '../../service/domaine.service';
import { NiveauService } from '../../service/niveau.service';
import { SessionService } from '../../service/session.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-student-list',
  imports: [NavbarComponent , CommonModule,  FormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  domaines: any[] = [];
  niveaux: any[] = [];
  sessions: any[] = [];
  isProf=false

selectedDomaine: string = '';
selectedNiveau: string = '';
selectedSession: string = '';


allEtudiants: Etudiant[] = []; // Toutes les données reçues

  //liste des etudiant
  etudinats:Etudiant[]=[]
  constructor(private etudiantService :StudentService,private auth:AuthService,private domaineService:DomaineService,private niveauService:NiveauService,private sessionService:SessionService ,private router:Router){}
  ngOnInit(): void {
  this.etudiantService.getEtudiants().subscribe(data => {
    this.allEtudiants = data;
    this.etudinats = [...data];
    this.isProf=this.auth.isProf()
  });

  this.domaineService.getDomaine().subscribe(data => this.domaines = data);
  this.niveauService.getNiveau().subscribe(data => this.niveaux = data);
  this.sessionService.getSession().subscribe(data => this.sessions = data);
}

applyFilters(): void {
  this.etudinats = this.allEtudiants.filter(e => {
    return (!this.selectedDomaine || e.domaine === this.selectedDomaine) &&
           (!this.selectedNiveau || e.niveau === this.selectedNiveau) &&
           (!this.selectedSession || e.type_session === this.selectedSession);
  });
}


  goToPaiement(student: any) {
  this.router.navigate(['/paiement', student.num_etudiant]);
}


editStudent(id:string | null) {
    if (!id) return;
  this.router.navigate(['/students/form', id]); 
}

 imprimerAttestation(studentMin: any) {
  // 1) Saisie à la volée (pas de variables)
  const saisie = window.prompt(
    "Texte à afficher dans l’attestation :",
    "À la fin de l’année scolaire, si le candidat réussit toutes les évaluations et l’examen final, ..."
  );
  if (saisie === null) return; // utilisateur a annulé

  // 2) Charger les infos complètes (si besoin de date/lieu, etc.)
  this.etudiantService.getEtudiantById(studentMin.num_etudiant)
    .subscribe(({ etudiant }) => {
      const s = { ...studentMin, ...etudiant };

      // helpers dates robustes
      const parseDate = (d?: string | null) => {
        if (!d) return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) { const [y,m,day]=d.split('-').map(Number); return new Date(y, m-1, day); }
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) { const [day,m,y]=d.split('/').map(Number); return new Date(y, m-1, day); }
        const dt = new Date(d); return isNaN(+dt) ? null : dt;
      };
      const fmt = (d?: string | null) => { const dt = parseDate(d); return dt ? dt.toLocaleDateString('fr-FR') : '—'; };

      const debut = fmt(s.date_inse);
      let fin = '—';
      const d0 = parseDate(s.date_inse);
      if (d0) { const df = new Date(d0); df.setFullYear(df.getFullYear()+1);df.setDate(df.getDate() - 1);  fin = df.toLocaleDateString('fr-FR'); }

      // 3) Convertir le texte saisi pour l’affichage
      const escapeHTML = (t: string) =>
        t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      const paragrapheHTML = escapeHTML(saisie).replace(/\n/g,"<br>");

      const aujourdhui = new Date().toLocaleDateString('fr-FR');

      // 4) Gabarit (le paragraphe est UNIQUEMENT le texte saisi)
      const contenu = `
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>Attestation d'inscription</title>
<style>
  @page { size: A4; margin: 16mm 18mm 28mm 18mm; }
  html, body { padding:0; margin:0; }
  body { font-family:"Times New Roman", serif; font-size:12pt; color:#000; line-height:1.5; }
  .title{ text-align:center; font-size:18pt; font-weight:bold; text-transform:uppercase; text-decoration:underline; margin:10mm 0 12mm; }
  .label{ font-weight:bold; }
  /* Écran (facultatif) */
.value{
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Impression : on force une "underline" avec une bordure */
@media print {
  .value{
    text-decoration: none;     /* évite un double soulignement */
    display: inline-block;     /* nécessaire pour la bordure */
    border-bottom: 1px solid #000;
    padding-bottom: 1px;       /* espace entre texte et ligne */
    line-height: 1.2;
  }
}

  .row2{ display:table; width:100%; margin:2mm 0; }
  .row2>div{ display:table-cell; width:50%; vertical-align:top; }
  .row1{ margin:2mm 0; }
  .intro{ margin-bottom:5mm; }
  .formation{ margin-top:4mm; }
  .para{ margin-top:7mm; text-align:justify; } .small{ font-size:11pt; }
  .footer{ display:flex; justify-content:space-between; align-items:flex-end; margin-top:8mm; }
  .left-note{ max-width:70%; }
  .signature-block{ width:40%; text-align:right; }
  .place-date{ font-weight:bold; }
  .sign-title{ font-weight:bold; }
</style>
</head>
<body>

  <div class="title">ATTESTATION D’INSCRIPTION</div>

  <div class="intro">
    Nous soussignés, <strong>INSTITUT GOLDENCOLLAR</strong>, Établissement d’Enseignement Supérieur Privé, attestons que :<br><br>
  </div>

  <div class="row1"><span class="label">Civilité :</span> <span class="value">${s.civilite || '—'}</span></div>

  <div class="row2">
    <div><span class="label">Nom :</span> <span class="value">${s.nom || '—'}</span></div>
    <div><span class="label">Prénom :</span> <span class="value">${s.prenom || '—'}</span></div>
  </div>

  <div class="row1"><span class="label">Domicilié au :</span> <span class="value">${s.adresse_postale || '—'}</span></div>

  <div class="row2">
    <div><span class="label">${s.civilite === 'FEMME' ? 'Née le :' : 'Né le :'}</span> <span class="value">${fmt(s.date_naiss)}</span></div>
    <div><span class="label">à :</span> <span class="value">${s.lieu_naiss || '—'}</span></div>
  </div>

  <div class="row1"><span class="label">Nationalité :</span> <span class="value">${s.nationalite || '—'}</span></div>

  <div class="formation">
    Est inscrite au sein de notre établissement en cursus de formation :<br>
    <div class="row1"><span class="label">Spécialité :</span> <span class="value">${s.domaine || '—'}</span></div>
    <div class="row1"><span class="label">Niveau de formation :</span> <span class="value">${s.niveau || '—'}</span></div>
    <div class="row1"><span class="label">Numéro d’étudiante :</span> <span class="value">${s.num_etudiant || '—'}</span></div>
    <div class="row1"><span class="label">Pour une durée de :</span> <span class="value">1 an</span></div>
    <div class="row2">
      <div><span class="label">Du :</span> <span class="value">${debut}</span></div>
      <div><span class="label">au :</span> <span class="value">${fin}</span></div>
    </div>
  </div>

  <div class="para small">
    ${paragrapheHTML}
  </div>

  <div class="footer">
    <div class="left-note">Pour servir et faire valoir ce que de droit.</div>
    <div class="signature-block">
      <div class="place-date">Fait à Paris, le ${aujourdhui}</div>
      <div class="sign-title">Directeur de l’établissement</div>
    </div>
  </div>

</body>
</html>`;

      const win = window.open('', '_blank'); if (!win) return;
      win.document.open(); win.document.write(contenu); win.document.close();
      win.onload = () => win.print();
    });
}

       
   

 
  
  


imprimerCertificat(student: any) {
  const contenu = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          margin: 0;
          padding: 0;
          font-size: 15px;
          color: #000;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .container {
          width: 80%;
        }

        .title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-decoration: underline;
          margin-bottom: 30px;
        }

        .content {
          line-height: 1.8;
        }

        .label {
          font-weight: bold;
        }

        .signature {
          margin-top: 60px;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="title">CERTIFICAT DE SCOLARITÉ</div>

        <div class="content">
          Nous, soussignés, <strong>Institut GoldenCollar</strong>, certifions que :<br><br>

          <span class="label">Identifiant :</span> ${student.num_etudiant}<br>
          <span class="label">Nom :</span> ${student.nom}<br>
          <span class="label">Prénom :</span> ${student.prenom}<br>
          <span class="label">Nationalité :</span> ${student.nationalite}<br>
          <span class="label">Spécialité :</span> ${student.domaine || '---'}<br>
          <span class="label">Niveau :</span> ${student.niveau || '---'}<br>
          <span class="label">Session :</span> ${student.type_session || '---'}<br>
          <span class="label">Date d'inscription :</span> ${student.date_inse || '---'}<br><br>

          L'étudiant(e) susmentionné(e) est inscrit(e) régulièrement au sein de notre établissement pour l’année académique en cours.<br><br>

          Pour servir et faire valoir ce que de droit.
        </div>

        <div class="signature">
          Fait à Paris, le ${new Date().toLocaleDateString()}<br><br>
          <strong>Le Directeur</strong>
        </div>
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
