import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [Sidebar, FormsModule , DatePipe],
  templateUrl: './planning.html',
  styleUrls: ['./planning.css']
})
export class Planning {
  currentDate = new Date();
  selectedView: 'Semaine' | 'Jour' = 'Semaine';
  hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  events = [
    {
      id: 1,
      title: 'Mathématiques',
      date: '2025-07-21T09:00:00',
      type: 'cours',
      classe: '3A',
      salle: 'A101',
      start: '09:00',
      end: '10:30',
    },
    {
      id: 2,
      title: 'Examen Physique',
      date: '2025-07-21T14:00:00',
      type: 'examen',
      classe: '2B',
      salle: 'B203',
      start: '14:00',
      end: '16:00',
    },

    {
      id: 3,
      title: 'Dev Web',
      date: '2025-07-22T13:00:00',
      type: 'cours',
      classe: 'info dev',
      salle: 'informatique ',
      start: '13:00',
      end: '17:00',
    },
  ];

  getEventsForToday() {
    return this.events.filter(e => {
      const today = new Date().toDateString();
      return new Date(e.date).toDateString() === today;
    });
  }

  getDaysOfWeek() {
  const start = new Date(this.currentDate);
  start.setDate(start.getDate() - start.getDay() + 1); // lundi
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
}

  getEventsForSlot(day: Date, hour: number) {
  const dayString = day.toDateString();
  return this.events.filter(e => {
    const eventDate = new Date(e.date);
    const eventHour = parseInt(e.start.split(':')[0], 10);
    return eventDate.toDateString() === dayString && eventHour === hour;
  });
}

getCoursCount(): number {
  return this.events.filter(e => e.type === 'cours').length;
}

getExamensCount(): number {
  return this.events.filter(e => e.type === 'examen').length;
}

getReunionsCount(): number {
  return this.events.filter(e => e.type === 'réunion').length;
}


}
