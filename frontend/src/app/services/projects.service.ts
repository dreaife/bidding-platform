import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createProject(project: any): Observable<any> {
    return this.http.post(this.apiUrl, project);
  }

  getOpenProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/open`);
  }

  closeProject(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {});
  }
}
