import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { LessonsSelectComponent } from '@/shared/catalog';
import { FormFooterActionsComponent } from '@/shared/components/formFooterActions/form-footer-actions.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { debounceTime, filter } from 'rxjs';
import { ISchoolTeacherRawResponse } from '../../models';
import { SchoolTeacherListStore } from './dataStore';

@Component({
  selector: 'assign-teacher-form-dialog',
  templateUrl: './assign-teacher-dialog.component.html',
  imports: [
    Dialog,
    ReactiveFormsModule,
    LessonsSelectComponent,
    FormFooterActionsComponent,
    UikitFieldComponent,
    InputText,
    SkeletonModule,
    InputGroupAddon,
    InputGroup,
    ProgressSpinner,
    Message,
  ],
})
export class AssignTeacherDialogComponent {
  @Input() schoolId?: string;
  @Input() teacherId?: string;
  @Input() selectedLessonIds: number[] = [];

  private fb = inject(FormBuilder);

  constructor(
    private toastService: ToastService,
    private store: SchoolTeacherListStore,
  ) {
    effect(() => {
      const v = this.visibleSignal();
      this.visibleChange.emit(v);
      if (!v) {
        this.form.reset();
        this.form.controls.teacherId.setValue(this.teacherId || '');
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
  searchedLoading = signal(false);
  searchedTeacher = signal<Maybe<ISchoolTeacherRawResponse>>(null);
  teacherNotFound = signal(false);

  form = this.fb.group({
    teacherId: [this.teacherId || ''],
    lessonId: [null, [Validators.required]],
  });

  ngOnInit() {
    this.form.controls.teacherId.setValue(this.teacherId || '');
    if (!this.teacherId) {
      this.form.controls.teacherId.valueChanges.subscribe(() => {
        this.searchedTeacher.set(null);
        this.teacherNotFound.set(false);
      });

      this.form.controls.teacherId.valueChanges
        .pipe(
          debounceTime(300),
          filter((val) => !!val && val.length === 6),
        )
        .subscribe(() => {
          this.getTeacher();
        });
    }
  }

  getTeacher() {
    this.searchedLoading.set(true);
    this.store.getTeacher(this.form.controls.teacherId.value!).subscribe({
      next: (teacher) => {
        this.searchedTeacher.set(teacher);
        this.searchedLoading.set(false);
      },
      error: () => {
        this.searchedLoading.set(false);
        this.teacherNotFound.set(true);
      },
    });
  }

  submit = () => {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    if (!this.searchedTeacher() && !this.teacherId) {
      return this.toastService.error({ text: 'لطفا دبیر را جستجو و انتخاب کنید' });
    }

    this.submitLoading.set(true);
    const payload = {
      lessonId: this.form.value.lessonId!,
      teacherId: this.form.value.teacherId!,
    };

    const selectedTeacherId = this.searchedTeacher()?.id || this.teacherId;

    this.store
      .attachTeacher({
        schoolId: this.schoolId!,
        id: selectedTeacherId!,
        lessonId: this.form.value.lessonId!,
      })
      .subscribe({
        next: () => {
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
