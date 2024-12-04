import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: `app.component.html`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  get userRole(): string {
    return this.authService.getUserRole();
  }

  get isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  get isClient(): boolean {
    return this.userRole === 'client';
  }

  get isBidder(): boolean {
    return this.userRole === 'bidder';
  }
}
