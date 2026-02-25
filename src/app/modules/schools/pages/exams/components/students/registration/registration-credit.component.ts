import { ToastService } from '@/core/services/toast.service';
import { SchoolExamsService } from '@/modules/schools/services/exams.service';
import { KeyValueComponent } from '@/shared/components';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Divider } from 'primeng/divider';
import { finalize } from 'rxjs';
import { SchoolExamStore } from '../../../dataStore';

@Component({
  selector: 'school-exam-registration-credit',
  templateUrl: './registration-credit.component.html',
  imports: [KeyValueComponent, Divider, FormFooterActionsComponent],
})
export class SchoolExamRegistrationCreditComponent {
  private readonly store = inject(SchoolExamStore);
  private readonly toastService = inject(ToastService);
  private readonly service = inject(SchoolExamsService);

  @Input() selectedStudentIds!: string[];
  @Output() onRegister = new EventEmitter<boolean>();
  @Output() onRegistrationSuccess = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  registerByCreditLoading = signal(false);

  private readonly examId = computed(() => this.store.examId);
  readonly examInfo = computed(() => this.store.info());

  onSubmit() {
    this.onRegister.emit(true);
    this.registerByCreditLoading.set(true);
    this.service
      .registerByCredit({
        studentIds: this.selectedStudentIds,
        examId: this.examId() as string,
      })
      .pipe(
        finalize(() => {
          this.onRegister.emit(false);
          this.registerByCreditLoading.set(false);
        }),
      )
      .subscribe(() => {
        this.toastService.success({
          text: 'ثبت نام با موفقیت انجام شد.',
        });
        this.onRegistrationSuccess.emit();
      });
  }

  cancel() {
    this.onCancel.emit();
  }
}
