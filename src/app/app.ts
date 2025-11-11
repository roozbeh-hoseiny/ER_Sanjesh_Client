import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
  protected readonly title = signal('er_sanjesh_client.client');
  constructor(private http: HttpClient) {}
}
