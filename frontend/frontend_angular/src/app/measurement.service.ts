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

  envoyerCommande(sensorId: string, value: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      deviceId: 'rpi-007',  // Ou récupéré dynamiquement 
      sensorId,
      value
    };

    return this.http.post('http://localhost:3000/api/commands', body, { headers });
  }

  getMesuresParCapteur(sensorId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/sensorId/${sensorId}`, { headers });
  }

  getAllMeasurements(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>('http://localhost:3000/api/measurements', { headers });
  }
  updateMeasurement(id: string, champsModifies: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch(`${this.apiUrl}/${id}`, champsModifies, { headers });
  }

  replaceMeasurement(id: string, nouvelleMesure: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/${id}`, nouvelleMesure, { headers });
  }

}


