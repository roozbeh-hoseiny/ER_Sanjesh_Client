import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'admin-schools',
  standalone: true,
  templateUrl: './admin-schools.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminSchoolsComponent {}
