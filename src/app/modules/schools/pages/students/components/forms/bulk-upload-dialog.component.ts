import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { SchoolStudentListStore } from '../studentList';

@Component({
  selector: 'students-bulk-upload-dialog',
  templateUrl: './bulk-upload-dialog.component.html',
  imports: [Dialog, FileUploadModule, Message],
})
export class StudentsBulkUploadDialogComponent {
  constructor(private studentStore: SchoolStudentListStore) {}

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

  onSelectedFile($event: FileSelectEvent) {
    const file = $event.files?.[0];
    if (!file) {
      return;
    }
    const payload = new FormData();
    payload.append('file', file, file.name);
    this.studentStore.addBulk(payload);
  }
}
