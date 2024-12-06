import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

jest.mock('../../services/auth.service');
jest.mock('../../services/users.service');

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jest.Mocked<AuthService>;
  let usersService: jest.Mocked<UsersService>;

  const mockClientUser = {
    user_id: 1,
    username: 'Client User',
    email: 'client@example.com',
    role: 'client'
  };

  const mockBidderUser = {
    user_id: 2,
    username: 'Bidder User',
    email: 'bidder@example.com',
    role: 'bidder'
  };

  const mockProjects = [
    { project_id: 101, title: 'Project A', description: 'Description A', budget_min: 1000, budget_max: 5000, status: 'active', deadline: new Date() },
    { project_id: 102, title: 'Project B', description: 'Description B', budget_min: 2000, budget_max: 6000, status: 'completed', deadline: new Date() }
  ];

  const mockBids = [
    { bid_id: 201, project: { title: 'Project A' }, amount: 1500, status: 'won', created_at: new Date(), project_id: 101, message: 'Bid message A' },
    { bid_id: 202, project: { title: 'Project B' }, amount: 2500, status: 'lost', created_at: new Date(), project_id: 102, message: 'Bid message B' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, RouterTestingModule],
      providers: [
        AuthService,
        UsersService
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    usersService = TestBed.inject(UsersService) as jest.Mocked<UsersService>;

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('應該創建組件', () => {
    authService.getCurrentUser.mockReturnValue(mockClientUser);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('應該在初始化時加載用戶數據', () => {
      authService.getCurrentUser.mockReturnValue(mockClientUser);
      const loadUserDataSpy = jest.spyOn(component, 'loadUserData');
      fixture.detectChanges();
      expect(loadUserDataSpy).toHaveBeenCalled();
    });
  });

  describe('loadUserData', () => {
    it('如果用戶是客戶，應加載其項目', async () => {
      authService.getCurrentUser.mockReturnValue(mockClientUser);
      usersService.getUserProjects.mockReturnValue(of(mockProjects));

      fixture.detectChanges();
      await fixture.whenStable();

      // expect(component.loading).toBe(false);
      expect(component.currentUser).toEqual(mockClientUser);
      expect(component.userProjects).toEqual(mockProjects);
      expect(component.userBids).toEqual([]);
      expect(usersService.getUserProjects).toHaveBeenCalledWith(mockClientUser.user_id);
    });

    it('如果用戶是投標人，應加載其投標', async () => {
      authService.getCurrentUser.mockReturnValue(mockBidderUser);
      usersService.getUserBids.mockReturnValue(of(mockBids));

      fixture.detectChanges();
      await fixture.whenStable();

      // expect(component.loading).toBe(false);
      expect(component.currentUser).toEqual(mockBidderUser);
      expect(component.userBids).toEqual(mockBids);
      expect(component.userProjects).toEqual([]);
      expect(usersService.getUserBids).toHaveBeenCalledWith(mockBidderUser.user_id);
    });

    it('應處理服務錯誤並設置相應數據為空', async () => {
      authService.getCurrentUser.mockReturnValue(mockClientUser);
      usersService.getUserProjects.mockReturnValue(throwError(() => new Error('服務錯誤')));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      fixture.detectChanges();
      await fixture.whenStable();

      // expect(component.loading).toBe(false);
      expect(component.userProjects).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '加载项目失败:',
        expect.objectContaining({ message: expect.any(String) })
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('模板渲染', () => {
    it('應顯示加載指示器當loading為真', () => {
      authService.getCurrentUser.mockReturnValue(mockClientUser);
      usersService.getUserProjects.mockReturnValue(of(mockProjects));
      component.loading = true;
      fixture.detectChanges();

      const loadingElement = fixture.debugElement.query(By.css('.loading'));
      expect(loadingElement).toBeTruthy();
      expect(loadingElement.nativeElement.textContent).toContain('加载中...');
    });

    it('應顯示用戶信息', async () => {
      authService.getCurrentUser.mockReturnValue(mockClientUser);
      usersService.getUserProjects.mockReturnValue(of(mockProjects));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const username = fixture.debugElement.query(By.css('.user-info h2')).nativeElement.textContent;
      const email = fixture.debugElement.query(By.css('.email')).nativeElement.textContent;
      const role = fixture.debugElement.query(By.css('.role')).nativeElement.textContent;

      expect(username).toContain(mockClientUser.username);
      expect(email).toContain(mockClientUser.email);
      expect(role).toContain('客户');
    });

    it('應顯示用戶的項目', async () => {
      console.log('Testing Project Cards');
      authService.getCurrentUser.mockReturnValue(mockClientUser);
      usersService.getUserProjects.mockReturnValue(of(mockProjects));

      // 初次变更检测
      console.log('Before detectChanges');
      fixture.detectChanges();
      console.log('After detectChanges');

      // 确保所有异步操作完成
      await fixture.whenStable();
      console.log('After whenStable');

      // 再次变更检测以更新视图
      fixture.detectChanges();

      const projectCards = fixture.debugElement.queryAll(By.css('.project-card'));
      console.log('Project Cards:', projectCards.length);
      console.log('HTML:', fixture.debugElement.nativeElement.innerHTML);
      expect(projectCards.length).toBe(mockProjects.length);
      expect(projectCards[0].nativeElement.textContent).toContain(mockProjects[0].title);
      expect(projectCards[1].nativeElement.textContent).toContain(mockProjects[1].title);
    });

    it('應顯示用戶的投標', async () => {
      authService.getCurrentUser.mockReturnValue(mockBidderUser);
      usersService.getUserBids.mockReturnValue(of(mockBids));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const bidCards = fixture.debugElement.queryAll(By.css('.bid-card'));
      console.log('Bid Cards:', bidCards.length);
      console.log('HTML:', fixture.debugElement.nativeElement.innerHTML);
      expect(bidCards.length).toBe(mockBids.length);
      expect(bidCards[0].nativeElement.textContent).toContain(mockBids[0].project.title);
      expect(bidCards[1].nativeElement.textContent).toContain(mockBids[1].project.title);
    });
  });
});
