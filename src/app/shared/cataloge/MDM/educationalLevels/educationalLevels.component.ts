import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { EducationLevelsService, EducationalLevel } from './educationLevels.service';
import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';

@Component({
  selector: 'educational-levels',
  standalone: true,
  imports: [CommonModule, FormsModule, Select],
  templateUrl: './educationalLevels.component.html',
})
export class EducationalLevelsComponent implements OnInit {
  private educationLevelsService = inject(EducationLevelsService);
  private breadcrumbService = inject(BreadcrumbService);

  educationalLevels = signal<EducationalLevel[]>([]);
  selectedLevel = signal<EducationalLevel | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngBeforeMount(): void {}

  ngOnInit(): void {
    this.loadEducationalLevels();
  }

  loadEducationalLevels(): void {
    this.loading.update(() => true);
    this.error.update(() => null);

    this.educationLevelsService.getAll().subscribe({
      next: (levels) => {
        this.educationalLevels.update(() => levels);
      },
      error: (err) => {
        this.error.update(() => '');
      },
      complete: () => {
        this.loading.update(() => false);
      },
    });
  }

  onLevelChange(event: any): void {
    console.log('Selected level:', this.selectedLevel);
  }
}
