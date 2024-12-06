import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'bidder'
  };

  const mockToken = {
    AccessToken: 'mock-access-token'
  };

  const mockResponse = {
    token: mockToken,
    user: mockUser
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // 清除 localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authentication State', () => {
    it('should initially be not authenticated', () => {
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should check token validity', () => {
      localStorage.setItem('token', 'mock-token');
      expect(service['hasValidToken']()).toBeTruthy();
    });
  });

  describe('Authentication Operations', () => {
    it('should login successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials.email, credentials.password).then(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('token')).toBe(mockToken.AccessToken);
        expect(localStorage.getItem('role')).toBe(mockUser.role);
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
        expect(service.isAuthenticated()).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should register new user', async () => {
      const registerData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User'
      };

      const mockRegisterResponse = { message: 'Registration successful' };

      service.register(registerData.email, registerData.password, registerData.name).then(response => {
        expect(response).toEqual(mockRegisterResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
        role: 'bidder'
      });
      req.flush(mockRegisterResponse);
    });

    it('should logout and clear storage', () => {
      // 设置初始状态
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('role', 'bidder');
      localStorage.setItem('user', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should confirm signup', async () => {
      const confirmData = {
        email: 'test@example.com',
        code: '123456'
      };

      const mockConfirmResponse = { message: 'Confirmation successful' };

      service.confirmSignUp(confirmData.email, confirmData.code).then(response => {
        expect(response).toEqual(mockConfirmResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/confirm`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(confirmData);
      req.flush(mockConfirmResponse);
    });
  });

  describe('User Role and Access', () => {
    it('should check admin role', () => {
      // 设置认证状态
      localStorage.setItem('token', 'mock-token');
      // 设置角色
      localStorage.setItem('role', 'admin');
      // 更新认证状态
      service['isAuthenticatedSubject'].next(true);
      
      // 调试信息
      console.log('Is authenticated:', service.isAuthenticated());
      console.log('Role:', service.getUserRole());
      console.log('Is admin result:', service.isAdmin());
      
      expect(service.isAdmin()).toBeTruthy();
    });

    it('should get user role', () => {
      localStorage.setItem('role', 'bidder');
      expect(service.getUserRole()).toBe('bidder');
    });

    it('should get current user', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      expect(service.getCurrentUser()).toEqual(mockUser);
    });
  });

  describe('Error Handling', () => {
    it('should handle login error', async () => {
      service.login('test@example.com', 'wrong-password').catch(error => {
        expect(error.status).toBe(401);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle registration error', async () => {
      service.register('existing@example.com', 'password', 'name').catch(error => {
        expect(error.status).toBe(409);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
    });

    it('should handle confirmation error', async () => {
      service.confirmSignUp('test@example.com', 'wrong-code').catch(error => {
        expect(error.status).toBe(400);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/confirm`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });
});
