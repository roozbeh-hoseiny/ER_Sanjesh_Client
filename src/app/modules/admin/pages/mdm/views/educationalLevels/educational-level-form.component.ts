import { ToastService } from '@/core/services/toast.service';
import { AdminMDMService } from '@/modules/admin/services';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-educational-level-form-dialog',
  templateUrl: './educational-level-form.component.html',
  imports: [Dialog, UikitFieldComponent, FormsModule, FormFooterActionsComponent],
})
export class EducationalLevelFormDialogComponent {
  private visibleSignal = signal(false);

  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
  }

  get visible() {
    return this.visibleSignal();
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<void>();

  submitLoading = signal(false);
  title = signal('');

  constructor(
    private mdmService: AdminMDMService,
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
    this.mdmService.addEducationalLevel({ title: this.title(), level: '0' }).subscribe({
      next: () => {
        this.toastService.success({ text: `پایه تحصیلی ${this.title()} با موفقیت اضافه شد.` });
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
