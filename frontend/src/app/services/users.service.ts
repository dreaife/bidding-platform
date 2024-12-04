import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): any {
    return fetch(this.apiUrl);
  }

  getUserById(userId: number): any {
    return fetch(`${this.apiUrl}/${userId}`);
  }

  createUser(user: any): any {
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  }

  updateUser(userId: number, user: any): any {
    return fetch(`${this.apiUrl}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  }

  deleteUser(userId: number): any {
    return fetch(`${this.apiUrl}/${userId}`, {
      method: 'DELETE'
    });
  }

  getCurrentUser(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile`, {
      userId,
    });
  }

  getUserProjects(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/projects`, {
      userId,
    });
  }

  getUserBids(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/bids`, {
      userId,
    });
  }
  
  updateProfile(userId: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, user, {
      params: { userId: userId.toString() }
    });
  }
}
