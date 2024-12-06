import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    if (authService.isAuthenticated()) {
      return true;
    }
  } catch (error) {
    console.error('Authentication check failed:', error);
  }
  
  router.navigate(['/auth']);
  return false;
};
