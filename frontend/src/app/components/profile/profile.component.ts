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
    // console.log('ProfileComponent ngOnInit');
    this.loadUserData();
  }

  async loadUserData() {
    try {
      this.loading = true;
      this.currentUser = this.authService.getCurrentUser();
      
      console.log('loadUserData:', {
        currentUser: this.currentUser,
        role: this.currentUser?.role,
        loading: this.loading
      });
      
      if (this.currentUser?.role === 'client') {
        await this.loadUserProjects();
      } else if (this.currentUser?.role === 'bidder') {
        await this.loadUserBids();
      }
    } finally {
      // 确保在所有操作完成后设置 loading 为 false
      this.loading = false;
      console.log('loadUserData completed:', {
        loading: this.loading
      });
    }
  }

  async loadUserProjects() {
    try {
      console.log('开始加载项目');
      const projects = await firstValueFrom(
        this.usersService.getUserProjects(this.currentUser.user_id)
      );
      this.userProjects = projects;
      console.log('项目加载完成:', projects);
      this.loading = false;
      console.log('loading:', this.loading);
    } catch (err) {
      console.error('加载项目失败:', err);
      this.userProjects = [];
    }
  }

  async loadUserBids() {
    try {
      console.log('开始加载投标');
      const bids = await firstValueFrom(
        this.usersService.getUserBids(this.currentUser.user_id)
      );
      this.userBids = bids;
      console.log('投标加载完成:', bids);
      this.loading = false;
      console.log('loading:', this.loading);
    } catch (err) {
      console.error('加载投标失败:', err);
      this.userBids = [];
    }
  }
}
