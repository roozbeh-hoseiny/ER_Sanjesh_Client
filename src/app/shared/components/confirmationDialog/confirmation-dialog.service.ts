import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
} from '@angular/core';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  private componentRef: ComponentRef<ConfirmationDialogComponent> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
  ) {}

  confirm(options: {
    message: string;
    header?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    variant?: 'confirm' | 'reject' | 'info';
    accept?: () => void;
    reject?: () => void;
  }) {
    // Create the component dynamically
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      ConfirmationDialogComponent,
    );
    this.componentRef = factory.create(this.injector);

    // Set inputs
    this.componentRef.instance.message = options.message;
    if (options.header) this.componentRef.instance.header = options.header;
    if (options.acceptLabel) this.componentRef.instance.acceptLabel = options.acceptLabel;
    if (options.rejectLabel) this.componentRef.instance.rejectLabel = options.rejectLabel;
    if (options.variant) this.componentRef.instance.variant = options.variant;

    // Subscribe to outputs and close after
    if (options.accept) {
      this.componentRef.instance.onAccept.subscribe(() => {
        options.accept!();
        this.close();
      });
    } else {
      this.componentRef.instance.onAccept.subscribe(() => this.close());
    }
    if (options.reject) {
      this.componentRef.instance.onReject.subscribe(() => {
        options.reject!();
        this.close();
      });
    } else {
      this.componentRef.instance.onReject.subscribe(() => this.close());
    }

    // Attach to the app
    this.appRef.attachView(this.componentRef.hostView);

    // Append to body
    document.body.appendChild(this.componentRef.location.nativeElement);

    // Trigger change detection and show
    this.componentRef.changeDetectorRef.detectChanges();
    this.componentRef.instance.show();
  }

  close() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
