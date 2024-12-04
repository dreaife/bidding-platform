import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-list',
  imports: [ RouterModule, CommonModule ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  userRole: string = '';
  loading = false;
  error = '';

  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService
  ) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit() {
    if (this.userRole === 'bidder') {
      this.loadOpenProjects();
    } else {
      this.loadAllProjects();
    }
  }

  loadOpenProjects() {
    this.loading = true;
    this.projectsService.getOpenProjects().subscribe({
      next: (data: any) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err: any) => console.error('加载项目失败:', err)
    });
  }

  loadAllProjects() {
    this.loading = true;
    this.projectsService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = '加载项目失败';
        this.loading = false;
        console.error('加载项目错误:', err);
      }
    });
  }
}
