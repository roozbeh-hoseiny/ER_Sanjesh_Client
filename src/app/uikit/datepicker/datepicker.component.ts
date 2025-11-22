import { Maybe } from '@/core';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import flatpickr from 'flatpickr-wrap';
import { BaseOptions } from 'flatpickr-wrap/dist/types/options';
import { InputTextModule } from 'primeng/inputtext';
import { UikitFieldComponent } from '../uikit-field.component';

@Component({
  selector: 'uikit-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, UikitFieldComponent],
  templateUrl: './datepicker.component.html',
})
export class UikitFlatpickrJalaliComponent implements OnInit {
  @Input() control?: FormControl<Maybe<string>>;
  @Input() placeholder = 'انتخاب تاریخ';
  @Input() label = 'تاریخ';
  @Input() disabled = false;
  @Input() name: string = 'datepicker';
  @Input() options: Partial<BaseOptions> = {};

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('wrapper', { static: true }) wrapperRef!: ElementRef<HTMLElement>;

  private fpInstance: any | null = null;

  ngOnInit(): void {
    this.fpInstance = flatpickr(this.wrapperRef.nativeElement, {
      ...this.options,
      altInputClass: 'p-inputtext w-full',
      onChange: (selectedDates: Date[], dateStr: string) => {
        this.valueChange.emit(dateStr);
        if (this.control) this.control.setValue(dateStr);
      },
    });
  }
}
