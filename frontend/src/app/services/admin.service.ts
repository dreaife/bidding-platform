import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getAllProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects`);
  }

  getAllBids(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bids`);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, user);
  }

  updateProject(id: number, project: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${id}`, project);
  }

  updateBid(id: number, bid: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bids/${id}`, bid);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`);
  }

  deleteBid(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bids/${id}`);
  }
}
