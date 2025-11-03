import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IEducationalLevelsResponse } from '../models';
import { EducationalLevelsService } from '../services';

@Component({
  selector: 'educational-levels-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, UikitFieldComponent],
  templateUrl: './educational-levels-select.component.html',
})
export class EducationalLevelsSelectComponent implements OnInit {
  @Input() formControlName!: FormControl<Maybe<number>>;
  @Output() onLevelChange = new EventEmitter<Maybe<number>>();

  private educationLevelsService = inject(EducationalLevelsService);

  educationalLevels = signal<IEducationalLevelsResponse[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading.update(() => true);

    this.educationLevelsService.getAll().subscribe({
      next: (levels) => {
        this.educationalLevels.update(() => levels);
      },
      complete: () => {
        this.loading.update(() => false);
      },
    });
  }

  onLevelSelect = (level: any) => {
    this.onLevelChange.emit(level.id);
  };
}
