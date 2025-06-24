import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private baseUrl = '/api/sensors'; // à adapter si ton backend est ailleurs

  constructor(private http: HttpClient) {}

  // 🔍Récupérer les capteurs d’un utilisateur
  getSensorsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/userId/${userId}`);
  }

  // Créer un nouveau capteur
  createSensor(sensor: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, sensor);
  }

  // Supprimer un capteur
  deleteSensor(sensorId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${sensorId}`);
  }

  // Modifier un capteur (partiellement)
  updateSensor(sensorId: string, updates: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${sensorId}`, updates);
  }
}
