import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { UikitFieldComponent } from '@/uikit/uikit-field.component';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-school-person-form',
  templateUrl: './school-person-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, UikitFieldComponent, GenderSelectComponent, InputText],
})
export class SchoolPersonFormComponent {
  @Input() firstNameControl!: FormControl;
  @Input() lastNameControl!: FormControl;
  @Input() mobileControl!: FormControl;
  @Input() emailControl!: FormControl;
  @Input() genderControl!: FormControl;
}
