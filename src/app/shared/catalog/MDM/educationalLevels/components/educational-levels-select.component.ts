import { Maybe } from '@/core';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IEducationalLevelsResponse } from '../models';
import { EducationalLevelsService } from '../services';

@Component({
  selector: 'catalog-educational-levels-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, UikitFieldComponent],
  templateUrl: './educational-levels-select.component.html',
})
export class EducationalLevelsSelectComponent implements OnInit {
  @Input() control!: FormControl<Maybe<number>>;
  @Input() disabled: boolean = false;
  @Output() onLevelChange = new EventEmitter<Maybe<number>>();

  constructor(private educationLevelsService: EducationalLevelsService) {}

  educationalLevels = signal<IEducationalLevelsResponse[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading.set(true);

    this.educationLevelsService.getAll().subscribe({
      next: (levels) => {
        this.educationalLevels.set(levels);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
