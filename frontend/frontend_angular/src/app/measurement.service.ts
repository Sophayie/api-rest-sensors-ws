import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MeasurementService {
  private apiUrl = 'http://localhost:3000/api/measurements';

  constructor(private http: HttpClient) { }

  getLatestMeasurement(sensorId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/latest/sensorId/${sensorId}`, { headers });
  }
  envoyerMesure(sensorId: string, value: number): Observable<any> {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      sensorId,
      value,
      takenAt: new Date().toISOString(),
      deviceId: 'rpi-007', // Ou récupéré dynamiquement
      userId: payload.userId
    };

    return this.http.post('http://localhost:3000/api/measurements', body, { headers });
  }
}
