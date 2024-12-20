import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    if (authService.isAdmin()) {
      return true;
    }
  } catch (error) {
    console.error('Admin check failed:', error);
  }
  
  router.navigate(['/projects']);
  return false;
};
