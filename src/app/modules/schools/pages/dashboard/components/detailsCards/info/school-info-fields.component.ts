import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { FieldsSelectComponent, IFieldOfStudiesResponse } from '@/shared/catalog';
import { KeyValueComponent } from '@/shared/components';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { filter } from 'rxjs';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'app-school-info-fields',
  templateUrl: './school-info-fields.component.html',
  imports: [
    KeyValueComponent,
    ReactiveFormsModule,
    CommonModule,
    ButtonDirective,
    FieldsSelectComponent,
    Tag,
  ],
  host: {
    class: 'w-full block',
  },
})
export class SchoolInfoFieldsComponent implements OnInit {
  @Input() editable: boolean = false;
  @Input() fields!: IFieldOfStudiesResponse[];

  @Output() onUpdate = new EventEmitter<void>();

  fieldControl = new FormControl<Maybe<IFieldOfStudiesResponse>>(null);

  selectedFields = signal<number[]>([]);
  loading = signal<boolean>(false);
  detachScheduleLoading = signal<number[]>([]);

  constructor(
    private toastService: ToastService,
    private schoolStore: SchoolDetailsCardsStore,
  ) {}

  ngOnInit() {
    this.fieldControl.valueChanges.pipe(filter((value) => !!value)).subscribe((value) => {
      this.loading.set(true);
      this.attach(value);
      this.fieldControl.setValue(null);
    });

    this.selectedFields.set(this.fields.map((field) => field.id));
  }

  attach = (field: IFieldOfStudiesResponse) => {
    console.log('start');

    this.loading.set(true);
    this.schoolStore.attachField(field).subscribe({
      next: () => {
        this.selectedFields.update((prev) => {
          if (!prev.includes(field.id)) {
            return [...prev, field.id];
          }
          return prev;
        });
        console.log('end');

        this.onChange();
      },
      error: () => {
        this.toastService.error({ text: 'خطا در اضافه کردن رشته‌ی تحصیلی.' });
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  };

  detach = (fieldId: number) => {
    this.detachScheduleLoading.update((prev) => [...prev, fieldId]);
    this.schoolStore.detachCategory(fieldId).subscribe({
      next: () => {
        this.selectedFields.update((prev) => prev.filter((id) => id !== fieldId));
        this.onChange();
      },
      error: () => {
        this.toastService.error({ text: 'خطا در حذف کردن رشته‌ی تحصیلی.' });
      },
      complete: () => {
        this.detachScheduleLoading.update((prev) => prev.filter((id) => id !== fieldId));
      },
    });
  };

  onChange = () => {
    this.onUpdate.emit();
  };
}
