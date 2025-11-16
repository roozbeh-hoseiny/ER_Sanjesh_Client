import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { IAdminSchoolRawResponse } from '@/modules/admin/pages/schools/models/schools';
import { IAttachLessonRequestPayload } from '@/modules/teachers/models';
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
import { TeacherDetailsCardsStore } from '../dataStore';

@Component({
  selector: 'attach-school-lesson-form-dialog',
  templateUrl: './attach-lesson-form.component.html',
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
  searchedSchoolLoading = signal(false);
  searchedSchool = signal<Maybe<IAdminSchoolRawResponse>>(null);
  schoolNotFound = signal(false);

  form = this.fb.group({
    schoolId: [this.schoolId || ''],
    lessonId: [null, [Validators.required]],
  });

  ngOnInit() {
    this.form.controls.schoolId.setValue(this.schoolId || '');
    if (!this.schoolId) {
      this.form.controls.schoolId.valueChanges.subscribe(() => {
        this.searchedSchool.set(null);
        this.schoolNotFound.set(false);
      });

      this.form.controls.schoolId.valueChanges
        .pipe(
          debounceTime(300),
          filter((val) => !!val && val.length === 6),
        )
        .subscribe(() => {
          console.log('first');

          this.getSchool();
        });
    }
    console.log(this.form.controls.schoolId);
  }

  getSchool() {
    this.searchedSchoolLoading.set(true);
    this.store.getSchool(this.form.controls.schoolId.value!).subscribe({
      next: (school) => {
        this.searchedSchool.set(school);
        this.searchedSchoolLoading.set(false);
      },
      error: () => {
        this.searchedSchoolLoading.set(false);
        this.schoolNotFound.set(true);
      },
    });
  }

  submit = () => {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    if (!this.searchedSchool()) {
      return this.toastService.error({ text: 'لطفا مدرسه را جستجو و انتخاب کنید' });
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
