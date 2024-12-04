import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/projects', 
    pathMatch: 'full' 
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./components/project-list/project-list.component').then(m => m.ProjectListComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: ['bidder', 'client', 'admin'] }
  },
  {
    path: 'projects/new',
    loadComponent: () => import('./components/project-form/project-form.component').then(m => m.ProjectFormComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: ['client', 'admin'] }
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./components/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: ['bidder', 'client', 'admin'] }
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: ['admin'] }
  }
];
