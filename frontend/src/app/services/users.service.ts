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
    return this.http.get(this.apiUrl);
  }

  getUserById(userId: number): any {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  createUser(user: any): any {
    return this.http.post(this.apiUrl, user, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  updateUser(userId: number, user: any): any {
    return this.http.put(`${this.apiUrl}/${userId}`, user, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  deleteUser(userId: number): any {
    return this.http.delete(`${this.apiUrl}/${userId}`);
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
