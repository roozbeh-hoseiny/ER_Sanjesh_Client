import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'students-bulk-upload-dialog',
  templateUrl: './bulk-upload-dialog.component.html',
  imports: [Dialog, FileUploadModule],
})
export class StudentsBulkUploadDialogComponent {
  constructor() {}

  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
  }
  get visible() {
    return this.visibleSignal();
  }
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<void>();

  private visibleSignal = signal(false);
  submitLoading = signal(false);

  onClose() {
    this.visibleSignal.set(false);
  }
}
