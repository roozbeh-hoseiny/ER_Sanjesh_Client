import { Maybe } from '@/core';
import {
  IAdminAgentRequestPayload,
  IAdminAgentResponse,
} from '@/modules/admin/pages/agents/models';
import { UikitFieldComponent } from '@/uikit';
import { UikitSearchFieldComponent } from '@/uikit/searchField/search-field.component';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'app-school-agent-form',
  templateUrl: './agent-form.component.html',
  imports: [ReactiveFormsModule, ButtonDirective, UikitFieldComponent, UikitSearchFieldComponent],
})
export class SchoolAgentFormComponent {
  @Output() closeForm = new EventEmitter();
  @Output() submitForm = new EventEmitter<IAdminAgentRequestPayload>();

  private store = inject(SchoolDetailsCardsStore);

  submitLoading = signal(false);
  searchedItem = signal<Maybe<IAdminAgentResponse>>(null);

  get schoolId() {
    return this.store.school() ? this.store.school()?.id : null;
  }

  setSearchResult(item: Maybe<IAdminAgentResponse>) {
    this.searchedItem.set(item);
  }

  submit() {
    if (!this.searchedItem() && !this.schoolId) return;
    this.submitLoading.set(true);
    this.store
      .attachAgent({
        agentId: this.searchedItem()!.id,
        id: this.schoolId!,
      })
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.searchedItem.set(null);
          this.submitForm.emit();
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }

  searchForAgent(id: string) {
    return this.store.searchForAgent(id);
  }
  foundedMessage(agent: Maybe<IAdminAgentResponse>) {
    return agent ? `کارگزار با نام ${agent.fullname} یافت شد.` : '';
  }

  close() {
    this.closeForm.emit();
  }
}
