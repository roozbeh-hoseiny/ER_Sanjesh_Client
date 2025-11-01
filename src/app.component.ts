import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ToastModule],
  template: `
    <div>
      <p-toast position="bottom-right" />
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
