import { Maybe } from '@/core';
import { ToastService } from '@/core/services/toast.service';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import {
  IAssignExistStudentToSchoolRequestResponse,
  ICheckExistStudentRequestResponse,
  IStudentRequestResponse,
} from '../../models';
import { ICheckExistStudentInfo } from '../../models/types';
import { AssignStudentFormComponent } from './assign-student-form.component';
import { StudentCheckExistFormDialogComponent } from './check-exist-form-dialog.component';
import { SignupStudentFormDialogComponent } from './signup-form-dialog.component';

@Component({
  selector: 'app-check-and-create-student-steps',
  templateUrl: './check-and-create-student-steps.component.html',
  imports: [
    StudentCheckExistFormDialogComponent,
    SignupStudentFormDialogComponent,
    AssignStudentFormComponent,
  ],
})
export class CheckAndCreateStudentStepsComponent {
  // @Input() checkExistService!: (
  //   payload: ICheckExistStudentRequestPayload,
  // ) => Observable<ICheckExistStudentRequestResponse>;

  // @Input() assignService!: (
  //   payload: IAssignExistStudentToSchoolRequestPayload,
  // ) => Subscribable<IAssignExistStudentToSchoolRequestResponse>;

  // @Input() signupService!: (payload: IStudentRequestPayload) => Observable<IStudentRequestResponse>;
  @Input() checkExistServiceApiRoute!: string;
  @Input() assignServiceApiRoute!: string;
  @Input() signupServiceApiRoute!: string;

  @Output() onCreate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter();

  activeStep = signal<'checkExist' | 'signup' | 'assign'>('checkExist');
  fondedStudent = signal<Maybe<ICheckExistStudentInfo>>(null);
  nationalCodeInputValue = signal<Maybe<string>>(null);

  visibleExistForm = signal(true);
  visibleSignupForm = signal(false);
  visibleAssignForm = signal(false);

  constructor(private readonly toastService: ToastService) {
    this.updateActiveStep('checkExist');
  }

  onCheckExist(response: ICheckExistStudentRequestResponse) {
    if (response.exists) {
      this.toastService.warn({
        title: 'دانش‌آموزی با این کد ملی یافت شد',
        text: 'برای افزودن دانش‌آموز به مدرسه فرم را تکمیل کنید',
      });
      this.updateActiveStep('assign');
      this.fondedStudent.set(response.studentInfo);
    } else {
      this.toastService.warn({
        title: 'دانش‌آموزی با این کد ملی یافت نشد',
        text: 'برای افزودن دانش‌آموز فرم را تکمیل کنید',
      });

      this.updateActiveStep('signup');
      this.nationalCodeInputValue.set(response.studentInfo.nationalCode);
    }
  }

  onSignup(response: IStudentRequestResponse) {
    this.onCreate.emit(response);
    this.close();
  }

  onAssign(response: IAssignExistStudentToSchoolRequestResponse) {
    this.onCreate.emit(response);
    this.close();
  }

  updateActiveStep(step: 'checkExist' | 'signup' | 'assign') {
    this.activeStep.set(step);
    this.updateVisibleFormStatus();
  }

  updateVisibleFormStatus() {
    this.visibleExistForm.set(this.activeStep() === 'checkExist');
    this.visibleSignupForm.set(this.activeStep() === 'signup');
    this.visibleAssignForm.set(this.activeStep() === 'assign');
  }

  close() {
    this.onClose.emit();
  }
}
