import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('er_sanjesh_client.client');
  private apiUrl = '/weatherforecast'; // your backend URL
  forecasts: WeatherForecast[] = [];
 constructor(private http: HttpClient) {
    this.getWeather().subscribe({
      next: data => this.forecasts = data,
      error: err => console.error('Error fetching weather data:', err)
    });
  }
  getWeather(): Observable<WeatherForecast[]> {
    return this.http.get<WeatherForecast[]>(this.apiUrl);
  }
}

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
