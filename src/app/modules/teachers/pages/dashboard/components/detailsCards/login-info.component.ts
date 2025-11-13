import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, computed } from '@angular/core';
import { TeacherDetailsCardsStore } from './dataStore/store';

@Component({
  selector: 'app-teacher-login-info',
  imports: [AppCardComponent, KeyValueComponent],
  templateUrl: './login-info.component.html',
})
export class TeacherLoginInfoComponent {
  constructor(private detailsStore: TeacherDetailsCardsStore) {}

  info = computed(() => this.detailsStore.info());

  get canEdit() {
    return this.detailsStore.canEditLoginInfo();
  }
}
