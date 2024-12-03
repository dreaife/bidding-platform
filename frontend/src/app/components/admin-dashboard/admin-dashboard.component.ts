import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  projects: any[] = [];
  bids: any[] = [];
  activeTab = 'users'; // 控制显示哪个标签页

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('加载用户失败:', err)
    });

    this.adminService.getAllProjects().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('加载项目失败:', err)
    });

    this.adminService.getAllBids().subscribe({
      next: (data) => this.bids = data,
      error: (err) => console.error('加载投标失败:', err)
    });
  }

  deleteUser(id: number) {
    if (confirm('确定要删除此用户吗？')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => this.users = this.users.filter(user => user.id !== id),
        error: (err) => console.error('删除用户失败:', err)
      });
    }
  }

  deleteProject(id: number) {
    if (confirm('确定要删除此项目吗？')) {
      this.adminService.deleteProject(id).subscribe({
        next: () => this.projects = this.projects.filter(project => project.id !== id),
        error: (err) => console.error('删除项目失败:', err)
      });
    }
  }

  deleteBid(id: number) {
    if (confirm('确定要删除此投标吗？')) {
      this.adminService.deleteBid(id).subscribe({
        next: () => this.bids = this.bids.filter(bid => bid.id !== id),
        error: (err) => console.error('删除投标失败:', err)
      });
    }
  }
}
