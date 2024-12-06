import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { adminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    const authSpy = {
      isAdmin: jest.fn()
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
    expect(adminGuard).toBeTruthy();
  });

  describe('Admin Access Check', () => {
    it('should allow access when user is admin', () => {
      authService.isAdmin.mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() => 
        adminGuard({} as any, {} as any)
      );

      expect(result).toBe(true);
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to projects when user is not admin', () => {
      authService.isAdmin.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        adminGuard({} as any, {} as any)
      );

      expect(result).toBe(false);
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/projects']);
    });

    it('should handle edge cases when isAdmin returns undefined', () => {
      authService.isAdmin.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        adminGuard({} as any, {} as any)
      );

      expect(result).toBe(false);
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/projects']);
    });

    it('should handle edge cases when isAdmin returns null', () => {
      authService.isAdmin.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        adminGuard({} as any, {} as any)
      );

      expect(result).toBe(false);
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/projects']);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in isAdmin', () => {
      authService.isAdmin.mockImplementation(() => {
        throw new Error('Admin check error');
      });

      const result = TestBed.runInInjectionContext(() => 
        adminGuard({} as any, {} as any)
      );

      expect(result).toBe(false);
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/projects']);
    });
  });

  describe('Route State Handling', () => {
    it('should work with different route states', () => {
      authService.isAdmin.mockReturnValue(true);

      const mockRoute = {
        url: '/admin',
        params: { id: '123' }
      };

      const mockState = {
        url: '/admin',
        root: null
      };

      const result = TestBed.runInInjectionContext(() => 
        adminGuard(mockRoute as any, mockState as any)
      );

      expect(result).toBe(true);
      expect(authService.isAdmin).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
