import { ToastService } from '@/core/services/toast.service';
import { AdminSchoolsService } from '@/modules/admin/services';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Divider } from 'primeng/divider';
import { InputGroup } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { ICategoryFullTreeResponse } from '../../models/schools';

@Component({
  selector: 'app-admin-school-category-list-show',
  templateUrl: './admin-school-category-list-show.component.html',
  imports: [Divider, Chip, InputText, Button, FormsModule, InputGroup],
  standalone: true,
})
export class AdminSchoolCategoryListShowComponent {
  @Input() category!: ICategoryFullTreeResponse;
  @Output() submitted = new EventEmitter<void>();
  constructor(
    private schoolService: AdminSchoolsService,
    private toastService: ToastService,
  ) {}

  title = signal<string>('');
  loading = signal(false);

  addSubCategory() {
    this.loading.set(true);
    this.schoolService
      .addSubCategory({ title: this.title(), parentId: this.category.id })
      .subscribe({
        next: () => {
          this.toastService.success({ text: `زیردسته‌ی ${this.title()} با موفقیت اضافه شد` });
          this.submitted.emit();
          this.loading.set(false);
          this.title.set('');
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
