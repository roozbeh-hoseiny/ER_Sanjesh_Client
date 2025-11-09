import { Component, Input } from '@angular/core';
import { Dialog } from 'primeng/dialog';

import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { SchoolsTeachersService } from '@/modules/schools/services/schools-teachers.service';
import { effect, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { filter } from 'rxjs';
import { ISchoolTeacherResponse } from '../../models';

@Component({
  selector: 'app-assign-teacher-dialog',
  templateUrl: './assign-teacher-dialog.component.html',
  imports: [Dialog, InputText, ReactiveFormsModule, MultiSelect],
})
export class AssignTeacherDialogComponent {
  private visibleSignal = signal(false);
  searchLoading = signal(false);
  submitLoading = signal(false);
  code = new FormControl<string>('');
  selectedCities = new FormControl<string[]>([]);

  groupedCities = [
    {
      label: 'Germany',
      value: 'de',
      items: [
        { label: 'Berlin', value: 'Berlin' },
        { label: 'Frankfurt', value: 'Frankfurt' },
        { label: 'Hamburg', value: 'Hamburg' },
        { label: 'Munich', value: 'Munich' },
      ],
    },
    {
      label: 'USA',
      value: 'us',
      items: [
        { label: 'Chicago', value: 'Chicago' },
        { label: 'Los Angeles', value: 'Los Angeles' },
        { label: 'New York', value: 'New York' },
        { label: 'San Francisco', value: 'San Francisco' },
      ],
    },
    {
      label: 'Japan',
      value: 'jp',
      items: [
        { label: 'Kyoto', value: 'Kyoto' },
        { label: 'Osaka', value: 'Osaka' },
        { label: 'Tokyo', value: 'Tokyo' },
        { label: 'Yokohama', value: 'Yokohama' },
      ],
    },
  ];

  teacher = signal<Maybe<ISchoolTeacherResponse>>(null);

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
    private schoolTeacherService: SchoolsTeachersService,
    private toastService: ToastService,
  ) {
    effect(() => {
      this.visibleChange.emit(this.visibleSignal());
    });

    this.code.valueChanges.pipe(filter((value) => value?.length === 6)).subscribe(() => {
      this.search();
    });
  }

  search() {
    this.searchLoading.set(true);
    this.teacher.set(null);
    this.schoolTeacherService.findByUniqueId(this.code.value || '').subscribe({
      next: (data) => {
        this.teacher.set(data);
        this.searchLoading.set(false);
      },
      error: () => {
        this.searchLoading.set(false);
        this.toastService.warn({ text: 'متاسفانه مشکلی پیش آمده' });
      },
    });
  }

  close() {
    this.visibleSignal.set(false);
  }

  submit() {
    this.submitLoading.set(true);
    // this.authService
    //   .verifyManagerMobile({
    //     otp: this.code(),
    //   })
    //   .subscribe({
    //     next: () => {
    //       this.submitLoading.set(false);
    //       this.toastService.success({ text: 'شماره تلفن مدیریت با موفقیت تایید شد.' });
    //       this.onSubmit.emit();
    //       this.close();
    //     },
    //     error: () => {
    //       this.submitLoading.set(false);
    //     },
    //   });
  }
}
