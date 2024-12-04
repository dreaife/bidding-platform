import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // 这里可以添加token验证逻辑
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  async login(email: string, password: string) {
    try {
      const response = await this.http.post<{token: any, user: any}>(`${this.apiUrl}/login`, {
        email,
        password
      }).toPromise();
      
      if (response?.token) {
        localStorage.setItem('token', response.token?.AccessToken);
        localStorage.setItem('role', response.user?.role);
        console.log('登录成功:', response.user);
        console.log('token:', response.token);
        this.isAuthenticatedSubject.next(true);
      }
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }

  async register(email: string, password: string, username: string) {
    try {
      const response = await this.http.post<{message: string}>(`${this.apiUrl}/register`, {
        email,
        password,
        name: username,
        role: 'bidder'
      }).toPromise();
      return response;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth']);
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && localStorage.getItem('role') === 'admin';
  }

  async confirmSignUp(email: string, code: string) {
    try {
      const response = await this.http.post<{message: string}>(`${this.apiUrl}/confirm`, {
        email,
        code
      }).toPromise();
      return response;
    } catch (error) {
      console.error('确认失败:', error);
      throw error;
    }
  }
}
