import { IManagerInfo } from '@/modules/schools/models';
import { AppCardComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-school-login-info',
  imports: [AppCardComponent, KeyValueComponent],
  templateUrl: './school-login-info.component.html',
})
export class SchoolManagerComponent {
  @Input() manager!: IManagerInfo;
}
