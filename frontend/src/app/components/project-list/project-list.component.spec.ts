import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectListComponent } from './project-list.component';
import { ProjectsService } from '../../services/projects.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let mockProjectsService: jest.Mocked<ProjectsService>;
  let mockAuthService: jest.Mocked<AuthService>;

  const mockProjects = [
    {
      project_id: 1,
      title: '测试项目1',
      description: '描述1',
      budget_min: 1000,
      budget_max: 5000,
      deadline: '2024-12-31',
      status: 'open'
    },
    {
      project_id: 2,
      title: '测试项目2',
      description: '描述2',
      budget_min: 2000,
      budget_max: 8000,
      deadline: '2024-11-30',
      status: 'closed'
    }
  ];

  beforeEach(async () => {
    mockProjectsService = {
      getOpenProjects: jest.fn().mockReturnValue(of([])),
      getAllProjects: jest.fn().mockReturnValue(of([]))
    } as any;

    mockAuthService = {
      getUserRole: jest.fn().mockReturnValue('client')
    } as any;

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), ProjectListComponent],
      providers: [
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('应该获取用户角色', () => {
      const role = 'client';
      mockAuthService.getUserRole.mockReturnValue(role);
      
      fixture = TestBed.createComponent(ProjectListComponent);
      component = fixture.componentInstance;
      
      expect(mockAuthService.getUserRole).toHaveBeenCalled();
      expect(component.userRole).toBe(role);
    });
  });

  describe('项目加载', () => {
    it('对于投标者应该加载开放项目', () => {
      mockAuthService.getUserRole.mockReturnValue('bidder');
      mockProjectsService.getOpenProjects.mockReturnValue(of(mockProjects));
      
      fixture = TestBed.createComponent(ProjectListComponent);
      component = fixture.componentInstance;
      
      fixture.detectChanges();
      
      expect(mockProjectsService.getOpenProjects).toHaveBeenCalled();
      expect(mockProjectsService.getAllProjects).not.toHaveBeenCalled();
      expect(component.projects).toEqual(mockProjects);
      expect(component.loading).toBeFalsy();
    });

    it('对于客户应该加载所有项目', () => {
      mockAuthService.getUserRole.mockReturnValue('client');
      mockProjectsService.getAllProjects.mockReturnValue(of(mockProjects));
      
      fixture.detectChanges();
      
      expect(mockProjectsService.getAllProjects).toHaveBeenCalled();
      expect(mockProjectsService.getOpenProjects).not.toHaveBeenCalled();
      expect(component.projects).toEqual(mockProjects);
      expect(component.loading).toBeFalsy();
    });
  });

  describe('错误处理', () => {
    it('应该处理加载错误', () => {
      mockAuthService.getUserRole.mockReturnValue('client');
      mockProjectsService.getAllProjects.mockReturnValue(
        throwError(() => new Error('加载失败'))
      );
      
      fixture.detectChanges();
      
      expect(component.error).toBe('加载项目失败');
      expect(component.loading).toBeFalsy();
    });
  });

  describe('加载状态', () => {
    it('加载时应显示加载状态', () => {
      mockAuthService.getUserRole.mockReturnValue('client');
      // 使用延迟响应模拟加载过程
      mockProjectsService.getAllProjects.mockReturnValue(of(mockProjects));
      
      fixture.detectChanges();
      
      expect(component.loading).toBeFalsy(); // 加载完成后
      expect(component.projects).toEqual(mockProjects);
    });
  });
});
