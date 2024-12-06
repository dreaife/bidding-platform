import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { roleGuard } from './role.guard';

describe('RoleGuard', () => {
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    const authSpy = {
      getUserRole: jest.fn(),
      isAuthenticated: jest.fn()
    } as unknown as jest.Mocked<AuthService>;

    const routerSpy = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(roleGuard).toBeTruthy();
  });

  describe('Role Validation', () => {
    it('should allow access when user has required role', () => {
      const mockRoute: any = {
        data: {
          role: ['admin', 'user']
        }
      };
      authService.getUserRole.mockReturnValue('admin');
      authService.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, {} as any)
    );

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(authService.getUserRole).toHaveBeenCalled();
    });

    it('should redirect to login when route data has no role', () => {
      const mockRoute: any = {
        data: {}
      };
      authService.getUserRole.mockReturnValue('admin');

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, {} as any)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

    it('should redirect to login when user role is empty string', () => {
      const mockRoute: any = {
        data: {
          role: ['admin']
        }
      };
      authService.getUserRole.mockReturnValue('');

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, {} as any)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

    it('should redirect to login when user role is undefined', () => {
      const mockRoute: any = {
        data: {
          role: ['admin']
        }
      };
      authService.getUserRole.mockReturnValue('');

      const result = TestBed.runInInjectionContext(() => 
        roleGuard(mockRoute, {} as any)
      );

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should redirect to home when user role does not match required roles', () => {
      const mockRoute: any = {
        data: {
          role: ['admin']
        }
      };
      authService.getUserRole.mockReturnValue('user');

    const result = TestBed.runInInjectionContext(() => 
      roleGuard(mockRoute, {} as any)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

    it('should handle array of required roles', () => {
      const mockRoute: any = {
        data: {
          role: ['admin', 'manager', 'supervisor']
        }
      };
      authService.getUserRole.mockReturnValue('manager');

      const result = TestBed.runInInjectionContext(() => 
        roleGuard(mockRoute, {} as any)
      );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

    it('should handle case-sensitive role comparison', () => {
      const mockRoute: any = {
        data: {
          role: ['Admin']
        }
      };
      authService.getUserRole.mockReturnValue('admin');

      const result = TestBed.runInInjectionContext(() => 
        roleGuard(mockRoute, {} as any)
      );

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

  });
});
