import { IAdminAgentRequestPayload } from '@/modules/admin/pages/agents/models';
import { ISchoolContactInfo } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Message } from 'primeng/message';
import { SchoolDetailsCardsStore } from '../store';
import { SchoolAgentFormComponent } from './agent-form.component';

@Component({
  selector: 'app-school-agent',
  imports: [AppCardComponent, KeyValueComponent, SchoolAgentFormComponent, Message],
  templateUrl: './agent.component.html',
})
export class SchoolAgentComponent {
  @Output() onSubmit = new EventEmitter<IAdminAgentRequestPayload>();

  private detailsStore = inject(SchoolDetailsCardsStore);

  get agent() {
    return this.detailsStore.school()
      ? (this.detailsStore.school()!.agentInfo as ISchoolContactInfo)
      : null;
  }
  get schoolId() {
    return this.detailsStore.school() ? this.detailsStore.school()?.id : null;
  }

  get canEdit() {
    return this.detailsStore.canEditAgent();
  }

  editMode = signal<boolean>(false);

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  onSubmitForm() {
    this.onSubmit.emit();
  }
}
