import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor() { }

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
}
