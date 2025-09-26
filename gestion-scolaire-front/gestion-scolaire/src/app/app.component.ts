import { Component } from '@angular/core';
import {  } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { StudentListComponent } from "./pages/student-list/student-list.component";
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:true
})
export class AppComponent {
  title = 'gestion-scolaire';
}
