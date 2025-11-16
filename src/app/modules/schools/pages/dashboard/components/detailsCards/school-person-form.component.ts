import { GenderSelectComponent } from '@/shared/catalog/gender/gender-select.component';
import { InputComponent } from '@/shared/components';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-school-person-form',
  templateUrl: './school-person-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, GenderSelectComponent, InputComponent],
})
export class SchoolPersonFormComponent {
  @Input() firstNameControl!: FormControl;
  @Input() lastNameControl!: FormControl;
  @Input() mobileControl!: FormControl;
  @Input() emailControl!: FormControl;
  @Input() genderControl!: FormControl;
}
