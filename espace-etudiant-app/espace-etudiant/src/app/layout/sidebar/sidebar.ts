import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { initDrawers } from 'flowbite';

@Component({
   selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar implements AfterViewInit {
  ngAfterViewInit() {
    initDrawers();
  }
}
