import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    const authSpy = {
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
    expect(authGuard).toBeTruthy();
  });

  describe('Authentication Check', () => {
    it('should allow access when user is authenticated', () => {
      authService.isAuthenticated.mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() => 
        authGuard({} as any, {} as any)
      );

      expect(result).toBe(true);
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to auth page when user is not authenticated', () => {
      authService.isAuthenticated.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        authGuard({} as any, {} as any)
      );

      expect(result).toBe(false);
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });

    it('should handle edge cases when isAuthenticated returns undefined', () => {
      authService.isAuthenticated.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        authGuard({} as any, {} as any)
      );

      expect(result).toBe(false);
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });

    it('should handle edge cases when isAuthenticated returns null', () => {
      authService.isAuthenticated.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        authGuard({} as any, {} as any)
      );

      expect(result).toBe(false);
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });
  });

  describe('Route State Handling', () => {
    it('should work with different route states', () => {
      authService.isAuthenticated.mockReturnValue(true);

      const mockRoute = {
        url: '/protected',
        params: { id: '123' }
      };

      const mockState = {
        url: '/protected',
        root: null
      };

      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute as any, mockState as any)
      );

      expect(result).toBe(true);
      expect(authService.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in isAuthenticated', () => {
      authService.isAuthenticated.mockImplementation(() => {
        throw new Error('Authentication error');
      });

      const result = TestBed.runInInjectionContext(() => 
        authGuard({} as any, {} as any)
      );

      expect(result).toBe(false);
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });
  });
});
