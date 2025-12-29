import { ISchoolManagerInfo } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, inject } from '@angular/core';
import { SchoolDetailsCardsStore } from './store';

@Component({
  selector: 'app-school-login-info',
  imports: [AppCardComponent, KeyValueComponent],
  templateUrl: './school-login-info.component.html',
})
export class SchoolLoginInfoComponent {
  private detailsStore = inject(SchoolDetailsCardsStore);

  get manager() {
    return this.detailsStore.school()
      ? (this.detailsStore.school()!.managerInfo as ISchoolManagerInfo)
      : null;
  }
  get username() {
    return this.detailsStore.school() ? this.detailsStore.school()!.username : null;
  }

  get canEdit() {
    return this.detailsStore.canEditLoginInfo();
  }
}
