import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  imports: [CommonModule, Button],
})
export class StudentDashboardComponent {}
