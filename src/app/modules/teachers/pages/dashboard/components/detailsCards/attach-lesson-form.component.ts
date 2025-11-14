import { ToastService } from '@/core/services/toast.service';
import { IAttachLessonRequestPayload } from '@/modules/teachers/models';
import { LessonsSelectComponent } from '@/shared/catalog';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { TeacherDetailsCardsStore } from './dataStore';

@Component({
  selector: 'attach-school-lesson-form-dialog',
  templateUrl: './attach-lesson-form.component.html',
  imports: [Dialog, ReactiveFormsModule, LessonsSelectComponent, FormFooterActionsComponent],
})
export class AttachSchoolLessonFormDialogComponent {
  @Input() teacherId!: string;
  @Input() schoolId?: string;
  @Input() selectedLessonIds: number[] = [];

  private fb = inject(FormBuilder);

  constructor(
    private toastService: ToastService,
    private store: TeacherDetailsCardsStore,
  ) {
    effect(() => {
      const v = this.visibleSignal();
      this.visibleChange.emit(v);
      if (!v) {
        this.form.reset();
        this.form.controls.schoolId.setValue(this.schoolId || '');
      }
    });
  }

  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
  }
  get visible() {
    return this.visibleSignal();
  }
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<void>();

  private visibleSignal = signal(false);
  submitLoading = signal(false);

  form = this.fb.group({
    schoolId: [this.schoolId || ''],
    lessonId: [null, [Validators.required]],
  });

  ngOnInit() {
    console.log(this.schoolId);

    this.form.controls.schoolId.setValue(this.schoolId || '');
    console.log(this.form.controls.schoolId);
  }

  submit = () => {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.submitLoading.set(true);
    const payload = {
      id: this.teacherId,
      lessonId: this.form.value.lessonId!,
      schoolId: this.form.value.schoolId!,
    } as IAttachLessonRequestPayload;

    this.store.attachLesson(payload).subscribe({
      next: () => {
        this.toastService.success({ text: 'درس مورد نظر با موفقیت اضافه شد' });
        this.submitLoading.set(false);
        this.close();
        this.onSubmit.emit();
      },
      error: () => {
        this.submitLoading.set(false);
      },
    });
  };

  close = () => {
    this.visibleChange.emit(false);
  };
}
