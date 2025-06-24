import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  /**
   *  Inscription libre (sans token)
   */
  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData); // pas de headers → public
  }

  /**
   *  Création d’un utilisateur (par admin connecté)
   */
  createUser(userData: any): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log('Token utilisé pour créer utilisateur :', token);

    return this.http.post(this.apiUrl, userData, { headers });
  }

  /**
   * Supprimer un utilisateur (admin connecté)
   */
  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Connexion utilisateur
   */
  loginUser(credentials: { email: string, motdepasse: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  registerAsAdminFromPublic(userData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, userData); // pas de token
}
getAllUsers(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  console.log(' Appel de GET /api/users avec token :', token);

  return this.http.get<any[]>(this.apiUrl, { headers }); 
}
updateUser(id: string, userData: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  return this.http.patch(`${this.apiUrl}/${id}`, userData, { headers });
}
getUserById(id: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
}
}
