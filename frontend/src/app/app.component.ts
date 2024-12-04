import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showDropdown = false;
  currentUser: any = null;
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // 订阅用户状态变化
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('currentUser updated:', this.currentUser);
    });
  }

  ngOnInit() {
    // 获取当前用户信息
    this.loadCurrentUser();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get isClient(): boolean {
    return this.currentUser?.role === 'client';
  }

  loadCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
    console.log('currentUser:', this.currentUser);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
