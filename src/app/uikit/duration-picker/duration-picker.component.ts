import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'uikit-duration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule, UikitFieldComponent],
  templateUrl: './duration-picker.component.html',
})
export class UikitDurationPickerComponent implements OnInit {
  @Input() label = 'مدت زمان';
  @Input() name = 'duration';
  @Input() control!: FormControl<string | null>;

  hoursCtrl = new FormControl<string | null>('0');
  minutesCtrl = new FormControl<string | null>('0');

  hoursOptions: string[] = Array.from({ length: 24 }, (_, i) => String(i));
  minutesOptions: string[] = ['0', '5', '10', '15', '20', '30', '45'];

  filteredHours: string[] = [];
  filteredMinutes: string[] = [];

  ngOnInit(): void {
    // initialize from parent control if present
    if (this.control) {
      const total = Number(this.control.value) || 0;
      const h = Math.floor(total / 60);
      const m = total % 60;
      this.hoursCtrl.setValue(String(h));
      this.minutesCtrl.setValue(String(m));

      this.hoursCtrl.valueChanges.subscribe(() => this.syncToParent());
      this.minutesCtrl.valueChanges.subscribe(() => this.syncToParent());

      this.control.valueChanges.subscribe((v) => this.syncFromParent(v));
    } else {
      this.hoursCtrl.valueChanges.subscribe(() => this.syncToParent());
      this.minutesCtrl.valueChanges.subscribe(() => this.syncToParent());
    }
  }

  private toNumberSafe(s: string | null | undefined) {
    if (s == null || s === '') return 0;
    const n = Number(s);
    return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
  }

  syncToParent() {
    if (!this.control) return;
    const h = this.toNumberSafe(this.hoursCtrl.value);
    const m = this.toNumberSafe(this.minutesCtrl.value);
    const total = h * 60 + m;
    // write numeric minutes into parent control only when changed
    const current = this.control.value;
    if (String(current) !== String(total)) {
      this.control.setValue(String(total), { emitEvent: false });
    }
  }

  syncFromParent(v: any) {
    const total = Number(v) || 0;
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (String(h) !== this.hoursCtrl.value)
      this.hoursCtrl.setValue(String(h), { emitEvent: false });
    if (String(m) !== this.minutesCtrl.value)
      this.minutesCtrl.setValue(String(m), { emitEvent: false });
  }

  filterHours(event: { query: string }) {
    const q = (event.query || '').toString();
    this.filteredHours = this.hoursOptions.filter((x) => x.startsWith(q));
  }

  filterMinutes(event: { query: string }) {
    const q = (event.query || '').toString();
    this.filteredMinutes = this.minutesOptions.filter((x) => x.startsWith(q));
  }
}
