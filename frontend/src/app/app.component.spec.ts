import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: Router;

  const mockUser = {
    username: 'TestUser',
    email: 'test@example.com',
    role: 'admin'
  };

  beforeEach(async () => {
    const authServiceMock = {
      currentUser$: of(mockUser),
      isAuthenticated: jest.fn().mockReturnValue(true),
      getCurrentUser: jest.fn().mockReturnValue(mockUser),
      logout: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth', component: {} as any },
          { path: 'admin', component: {} as any },
          { path: 'projects', component: {} as any }
        ]),
        CommonModule,
        RouterLink,
        RouterOutlet,
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router);
    
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current user', () => {
    fixture.detectChanges();
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should check admin role correctly', () => {
    component.currentUser = { ...mockUser, role: 'admin' };
    expect(component.isAdmin).toBeTruthy();
    
    component.currentUser = { ...mockUser, role: 'client' };
    expect(component.isAdmin).toBeFalsy();
  });

  it('should check client role correctly', () => {
    component.currentUser = { ...mockUser, role: 'client' };
    expect(component.isClient).toBeTruthy();
    
    component.currentUser = { ...mockUser, role: 'admin' };
    expect(component.isClient).toBeFalsy();
  });

  it('should handle logout', async () => {
    await component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });

  describe('Template Tests', () => {
    beforeEach(() => {
      component.currentUser = mockUser;
      fixture.detectChanges();
    });

    it('should show navigation when authenticated', () => {
      const header = fixture.debugElement.query(By.css('.header'));
      expect(header).toBeTruthy();
    });

    it('should display user information correctly', () => {
      const username = fixture.debugElement.query(By.css('.username'));
      expect(username.nativeElement.textContent).toContain(mockUser.username);
    });

    it('should show admin link for admin users', () => {
      component.currentUser = { ...mockUser, role: 'admin' };
      fixture.detectChanges();
      
      const adminLink = fixture.debugElement.query(By.css('[routerLink="/admin"]'));
      expect(adminLink).toBeTruthy();
    });

    it('should not show admin link for non-admin users', () => {
      component.currentUser = { ...mockUser, role: 'client' };
      fixture.detectChanges();
      
      const adminLink = fixture.debugElement.query(By.css('[routerLink="/admin"]'));
      expect(adminLink).toBeFalsy();
    });

    it('should show dropdown menu when hovering', () => {
      const userInfo = fixture.debugElement.query(By.css('.user-info-container'));
      userInfo.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();
      
      expect(component.showDropdown).toBeTruthy();
    });
  });
});
