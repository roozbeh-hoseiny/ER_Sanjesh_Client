import { AppCardComponent, CheckVerifiedInfoComponent } from '@/shared/components';
import { KeyValueComponent } from '@/shared/components/key-value.component/key-value.component';
import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { TeacherDetailsCardsStore } from '../dataStore/store';

@Component({
  selector: 'app-teacher-info',
  imports: [AppCardComponent, KeyValueComponent, CheckVerifiedInfoComponent],
  templateUrl: './teacher-info.component.html',
})
export class TeacherInfoComponent {
  private detailsStore = inject(TeacherDetailsCardsStore);

  @Output() onSubmitted = new EventEmitter<void>();

  editMode = signal<boolean>(false);

  info = computed(() => this.detailsStore.info()!);
  // canEditFields = computed(() => this.detailsStore.canEditFields());

  showInlineConfirmation = computed(() => this.detailsStore.showValidateInlineConfirmation());

  onEdit() {
    this.editMode.update((prev) => !prev);
  }

  closeForm() {
    this.editMode.set(false);
  }

  toggleVerifyMobile(status: boolean) {
    const observable = this.detailsStore[status ? 'validateMobile' : 'invalidateMobile'](
      this.info().id,
    );
    if (observable && typeof (observable as any).subscribe === 'function') {
      (observable as { subscribe: Function }).subscribe(() => {
        this.onSubmitted.emit();
      });
    }
  }

  toggleVerifyEmail(status: boolean) {
    const observable = this.detailsStore[status ? 'validateEmail' : 'invalidateEmail'](
      this.info().id,
    );
    if (observable && typeof (observable as any).subscribe === 'function') {
      (observable as { subscribe: Function }).subscribe(() => {
        this.onSubmitted.emit();
      });
    }
  }

  submitForm() {
    this.onSubmitted.emit();
    this.closeForm();
  }
}
