import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRole = route.data['role'] as string[];
  const userRole = authService.getUserRole();

  if (!requiredRole || !userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRole.includes(userRole)) {
    return true;
  } 

  router.navigate(['/']);
  return false;
};
