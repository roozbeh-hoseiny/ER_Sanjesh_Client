import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { SchoolsCategoriesTreeSelectComponent } from '@/modules/admin/pages/schools/components';
import {
  ICategoryFullTreeMapped,
  ICategoryFullTreeResponse,
} from '@/modules/admin/pages/schools/models/schools';
import { UikitLabelComponent } from '@/uikit';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Message } from 'primeng/message';
import { filter } from 'rxjs';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'app-school-info-categories',
  templateUrl: './school-info-categories.component.html',
  imports: [
    SchoolsCategoriesTreeSelectComponent,
    ReactiveFormsModule,
    CommonModule,
    Chip,
    ButtonDirective,
    Message,
    UikitLabelComponent,
  ],
  host: {
    class: 'w-full block',
  },
})
export class SchoolInfoCategoriesComponent implements OnInit {
  @Input() editable: boolean = false;
  @Input() categories!: ICategoryFullTreeResponse[];

  @Output() onUpdate = new EventEmitter<void>();

  categoryControl = new FormControl<Maybe<ICategoryFullTreeMapped>>(null);

  selectedCategories = signal<number[]>([]);
  loading = signal<boolean>(false);
  detachScheduleLoading = signal<number[]>([]);

  constructor(
    private toastService: ToastService,
    private schoolStore: SchoolDetailsCardsStore,
  ) {}

  ngOnInit() {
    this.categoryControl.valueChanges.pipe(filter((value) => !!value)).subscribe((value) => {
      this.loading.set(true);
      this.attachCategory(value);
      this.categoryControl.setValue(null);
    });

    this.selectedCategories.set(this.categories.map((category) => category.id));
  }

  attachCategory = (category: ICategoryFullTreeMapped) => {
    this.loading.set(true);
    this.schoolStore.attachCategory(category).subscribe({
      next: () => {
        this.selectedCategories.update((prev) => {
          if (!prev.includes(category.id)) {
            return [...prev, category.id];
          }
          return prev;
        });

        this.onChange();
      },
      error: () => {
        this.toastService.error({ text: 'خطا در اضافه کردن دسته‌بندی.' });
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  };

  detach = (categoryId: number) => {
    this.detachScheduleLoading.update((prev) => [...prev, categoryId]);
    this.schoolStore.detachCategory(categoryId).subscribe({
      next: () => {
        this.selectedCategories.update((prev) => prev.filter((id) => id !== categoryId));
        this.onChange();
      },
      error: () => {
        this.toastService.error({ text: 'خطا در حذف کردن دسته‌بندی.' });
      },
      complete: () => {
        this.detachScheduleLoading.update((prev) => prev.filter((id) => id !== categoryId));
      },
    });
  };

  onChange = () => {
    this.onUpdate.emit();
  };
}
