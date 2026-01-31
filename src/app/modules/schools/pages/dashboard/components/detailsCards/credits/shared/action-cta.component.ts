import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { CreditsDecreaseFormDialogComponent } from './decrease-form-dialog.component';
import { CreditsEditFormDialogComponent } from './edit-form-dialog.component';
import { CreditsIncreaseFormDialogComponent } from './increase-form-dialog.component';

@Component({
  selector: 'credits-action-cta',
  templateUrl: './action-cta.component.html',
  imports: [
    Menu,
    Button,
    CreditsDecreaseFormDialogComponent,
    CreditsIncreaseFormDialogComponent,
    CreditsEditFormDialogComponent,
  ],
})
export class CreditsActionCtaComponent {
  @Input() schoolId!: string;
  @Input() label!: string;
  @Input() currentValue!: number;
  @Input() increaseSubmitUrl!: string;
  @Input() decreaseSubmitUrl!: string;
  @Input() editSubmitUrl!: string;
  @Input() type!: 'number' | 'price';

  @Output() onSubmitted = new EventEmitter<void>();

  visibleDecreaseForm = signal(false);
  visibleIncreaseForm = signal(false);
  visibleEditForm = signal(false);

  actions = computed(
    () =>
      [
        {
          label: `افزایش ${this.label}`,
          icon: 'pi pi-plus-circle',
          command: this.showIncreaseForm,
        },
        {
          label: `کاهش ${this.label}`,
          icon: 'pi pi-minus-circle',
          command: this.showDecreaseForm,
        },
        {
          label: `ویرایش ${this.label}`,
          icon: 'pi pi-pen-to-square',
          command: this.showEditForm,
        },
      ] as MenuItem[],
  );
  showDecreaseForm = () => {
    this.visibleDecreaseForm.set(true);
  };

  showIncreaseForm = () => {
    this.visibleIncreaseForm.set(true);
  };

  showEditForm = () => {
    this.visibleEditForm.set(true);
  };

  submitted() {
    this.onSubmitted.emit();
  }
}
