import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-admin-mdm-educational-levels',
  templateUrl: './admin-mdm-educational-levels.component.html',
  imports: [CommonModule, TableModule],
})
export class AdminMdmEducationalLevelsComponent {}
