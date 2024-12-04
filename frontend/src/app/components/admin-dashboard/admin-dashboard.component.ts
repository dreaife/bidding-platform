import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  projects: any[] = [];
  bids: any[] = [];
  activeTab = 'users';
  
  editingUser: any = null;
  editingProject: any = null;
  editingBid: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.users.sort((a: any, b: any) => a.user_id - b.user_id);
        console.log(this.users);
      },
      error: (err) => console.error('加载用户失败:', err)
    });

    this.adminService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.projects.sort((a: any, b: any) => a.project_id - b.project_id);
        console.log(this.projects);
      },
      error: (err) => console.error('加载项目失败:', err)
    });

    this.adminService.getAllBids().subscribe({
      next: (data) => {
        this.bids = data;
        this.bids.sort((a: any, b: any) => a.bid_id - b.bid_id);
        console.log(this.bids);
      },
      error: (err) => console.error('加载投标失败:', err)
    });
  }

  deleteUser(id: number) {
    if (confirm('确定要删除此用户吗？')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.loadAllData();
        },
        error: (err) => console.error('删除用户失败:', err)
      });
    }
  }

  deleteProject(id: number) {
    if (confirm('确定要删除此项目吗？')) {
      this.adminService.deleteProject(id).subscribe({
        next: () => {
          this.loadAllData();
        },
        error: (err) => console.error('删除项目失败:', err)
      });
    }
  }

  deleteBid(id: number) {
    if (confirm('确定要删除此投标吗？')) {
      this.adminService.deleteBid(id).subscribe({
        next: () => {
          this.loadAllData();
        },
        error: (err) => console.error('删除投标失败:', err)
      });
    }
  }

  editUser(user: any) {
    this.editingUser = { ...user };
  }

  saveUser() {
    if (this.editingUser) {
      this.adminService.updateUser(this.editingUser.user_id, this.editingUser).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.user_id === this.editingUser.user_id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.editingUser = null;
          this.loadAllData();
        },
        error: (err) => console.error('更新用户失败:', err)
      });
    }
  }

  editProject(project: any) {
    this.editingProject = { ...project };
  }

  saveProject() {
    if (this.editingProject) {
      this.adminService.updateProject(this.editingProject.project_id, this.editingProject).subscribe({
        next: (updatedProject) => {
          const index = this.projects.findIndex(p => p.project_id === this.editingProject.project_id);
          if (index !== -1) {
            this.projects[index] = updatedProject;
          }
          this.editingProject = null;
          this.loadAllData();
        },
        error: (err) => console.error('更新项目失败:', err)
      });
    }
  }

  editBid(bid: any) {
    this.editingBid = { ...bid };
  }

  saveBid() {
    if (this.editingBid) {
      this.adminService.updateBid(this.editingBid.bid_id, this.editingBid).subscribe({
        next: (updatedBid) => {
          const index = this.bids.findIndex(b => b.bid_id === this.editingBid.bid_id);
          if (index !== -1) {
            this.bids[index] = updatedBid;
          }
          this.editingBid = null;
          this.loadAllData();
        },
        error: (err) => console.error('更新投标失败:', err)
      });
    }
  }

  cancelEdit() {
    this.editingUser = null;
    this.editingProject = null;
    this.editingBid = null;
  }

  getProjectTitle(projectId: number) {
    return this.projects.find(project => project.project_id === projectId)?.title;
  }

  getUserName(userId: number) {
    return this.users.find(user => user.user_id === userId)?.username;
  }
}
