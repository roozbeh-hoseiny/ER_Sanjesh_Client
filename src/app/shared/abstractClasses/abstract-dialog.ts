import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'abstract-dialog',
  template: '',
})
export abstract class AbstractDialog {
  @Input()
  set visible(v: boolean) {
    this.visibleSignal.set(!!v);
    this.visibleChange.emit(!!v);
  }
  get visible() {
    return this.visibleSignal();
  }
  private visibleSignal = signal(false);

  @Output() visibleChange = new EventEmitter<boolean>();
}
