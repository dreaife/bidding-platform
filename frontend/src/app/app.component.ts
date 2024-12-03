import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="main-nav" *ngIf="authService.isAuthenticated()">
      <a routerLink="/projects">项目列表</a>
      <a routerLink="/projects/new">创建项目</a>
      <a routerLink="/admin">管理后台</a>
      <a href="javascript:void(0)" (click)="logout()">退出登录</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
