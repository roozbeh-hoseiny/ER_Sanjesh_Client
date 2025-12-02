import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { SchoolAgentByNameFormComponent } from './by-name-form.component';
import { SchoolAgentByUniqueIdFormComponent } from './by-unique-id-form.component';

@Component({
  selector: 'school-agent-assign-card',
  templateUrl: './assign.component.html',
  imports: [
    Dialog,
    SchoolAgentByUniqueIdFormComponent,
    ButtonDirective,
    SchoolAgentByNameFormComponent,
  ],
})
export class SchoolAgentAssignCardComponent {
  @Output() onAssign = new EventEmitter<void>();
  constructor() {}

  isOpenedDialogForm = signal(false);
  formType = signal<'uniqueId' | 'name' | null>(null);

  openByUniqueId() {
    this.formType.set('uniqueId');
    this.isOpenedDialogForm.set(true);
  }

  openByName() {
    this.formType.set('name');
    this.isOpenedDialogForm.set(true);
  }

  closeForm() {
    this.isOpenedDialogForm.set(false);
    this.formType.set(null);
  }

  onSubmitForm() {
    this.closeForm();
    this.onAssign.emit();
  }
}
