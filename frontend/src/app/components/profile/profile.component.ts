import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  userProjects: any[] = [];
  userBids: any[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.loading = true;
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser?.role === 'client') {
      this.loadUserProjects();
    } else if (this.currentUser?.role === 'bidder') {
      this.loadUserBids();
    } else {
      this.loading = false;
    }
  }

  async loadUserProjects() {
    try {
      const projects: any[] = await firstValueFrom(this.usersService.getUserProjects(this.currentUser.user_id));
      this.userProjects = projects;
      this.loading = false;
    } catch (err) {
      console.error('加载项目失败:', err);
      this.loading = false;
    }
  }

  async loadUserBids() {
    try {
      const bids: any[] = await firstValueFrom(this.usersService.getUserBids(this.currentUser.user_id));
      this.userBids = bids;
      this.loading = false;
    } catch (err) {
      console.error('加载投标失败:', err);
      this.loading = false;
    }
  }
}
