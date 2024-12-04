import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { BidsService } from '../../services/bids.service';
import { CommonModule } from '@angular/common';
import { BidFormComponent } from '../bid-form/bid-form.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-detail',
  imports: [ CommonModule, BidFormComponent ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: any = null;
  bids: any[] = [];
  loading = false;
  error = '';
  userRole: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private bidsService: BidsService,
    private authService: AuthService
  ) {
    this.userRole = this.authService.getUserRole();
  }

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(+projectId);
      this.loadBids(+projectId);
    }
  }

  loadProject(id: number) {
    this.loading = true;
    this.projectsService.getProjectById(id).subscribe({
      next: (data) => {
        this.project = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = '加载项目详情失败';
        this.loading = false;
        console.error('加载项目详情错误:', err);
      }
    });
  }

  loadBids(projectId: number) {
    this.bidsService.getBidsByProjectId(projectId).subscribe({
      next: (data) => {
        this.bids = data;
      },
      error: (err) => {
        console.error('加载投标列表错误:', err);
      }
    });
  }

  acceptBid(bidId: number) {
    console.log('接受投标:', bidId);
    console.log('项目ID:', this.project.project_id);
    console.log('项目状态:', this.project.status);
    console.log('投标ID:', bidId);
    this.bidsService.acceptBid(bidId).subscribe({
      next: () => {
        this.projectsService.closeProject(this.project.project_id).subscribe({
          next: () => {
            this.loadProject(this.project.project_id);
            this.loadBids(this.project.project_id);
          },
          error: (err) => console.error('更新项目状态失败:', err)
        });
      },
      error: (err) => console.error('接受投标错误:', err)
    });
  }

  rejectBid(bidId: number) {
    console.log('拒绝投标:', bidId);
    this.bidsService.rejectBid(bidId).subscribe({
      next: () => this.loadBids(this.project.project_id),
      error: (err) => console.error('拒绝投标错误:', err)
    });
  }

  get sortedBids() {
    return [...this.bids].sort((a, b) => {
      if (a.status === 'accepted') return -1;
      if (b.status === 'accepted') return 1;
      return 0;
    });
  }
}
