import {
  IAdminAgentRequestPayload,
  IAdminAgentResponse,
} from '@/modules/admin/pages/agents/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Message } from 'primeng/message';
import { SchoolDetailsCardsStore } from '../store';
import { SchoolAgentFormComponent } from './agent-form.component';

@Component({
  selector: 'app-school-agent',
  imports: [
    AppCardComponent,
    KeyValueComponent,
    SchoolAgentFormComponent,
    Message,
    ButtonDirective,
  ],
  templateUrl: './agent.component.html',
})
export class SchoolAgentComponent {
  @Output() onSubmit = new EventEmitter<IAdminAgentRequestPayload>();

  private detailsStore = inject(SchoolDetailsCardsStore);

  onRemoveLoading = signal<boolean>(false);

  get agent() {
    return this.detailsStore.school()
      ? (this.detailsStore.school()!.agentInfo as IAdminAgentResponse)
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

  removeAgent() {
    this.onRemoveLoading.set(true);
    this.detailsStore.detachAgent(this.agent?.id!).subscribe(() => {
      this.onSubmit.emit();
      this.onRemoveLoading.set(false);
    });
  }

  onSubmitForm() {
    this.closeForm();
    this.onSubmit.emit();
  }
}
