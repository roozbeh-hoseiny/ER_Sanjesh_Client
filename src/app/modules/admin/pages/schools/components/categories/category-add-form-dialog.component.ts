import { ToastService } from '@/core/services/toast.service';
import { AdminSchoolsService } from '@/modules/admin/services';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-category-add-form-dialog',
  templateUrl: './category-add-form-dialog.component.html',
  imports: [Dialog, FormsModule, UikitFieldComponent, FormFooterActionsComponent, InputText],
})
export class CategoryAddFormDialogComponent {
  private visibleSignal = signal(false);

  submitLoading = signal(false);
  title = signal('');

  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
  }

  get visible() {
    return this.visibleSignal();
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<void>();

  constructor(
    private schoolService: AdminSchoolsService,
    private toastService: ToastService,
  ) {
    effect(() => {
      this.visibleChange.emit(this.visibleSignal());
    });
  }

  close() {
    this.visibleSignal.set(false);
  }

  submit() {
    this.submitLoading.set(true);
    this.schoolService.addCategory({ title: this.title(), ordinal: 0 }).subscribe({
      next: () => {
        this.toastService.success({ text: `دسته‌بندی ${this.title()} با موفقیت اضافه شد.` });
        this.title.set('');
        this.submitLoading.set(false);
        this.onSubmit.emit();
        this.close();
      },
      error: () => {
        this.submitLoading.set(false);
      },
    });
  }
}
