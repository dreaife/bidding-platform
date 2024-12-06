import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { switchMap, take, tap } from 'rxjs/operators';
@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent {
  projectForm: FormGroup;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private router: Router,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      budget_min: ['', [Validators.required, Validators.min(0)]],
      budget_max: ['', [Validators.required, Validators.min(0)]],
      deadline: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.submitting = true;
      this.error = '';

      const projectData = { ...this.projectForm.value };

      this.authService.currentUser$.pipe(
        take(1),
        tap(user => {
          projectData.client_id = user.user_id;
        }),
        switchMap(() => this.projectsService.createProject(projectData))
      ).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.error = '创建项目失败，请重试';
          console.error('创建项目错误:', err);
          this.submitting = false;
        }
      });
    }
  }
}
