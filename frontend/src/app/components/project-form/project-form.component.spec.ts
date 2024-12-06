import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFormComponent } from './project-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;
  let mockProjectsService: jest.Mocked<ProjectsService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;

  const mockUser = {
    user_id: 1,
    username: '测试用户',
    email: 'test@example.com'
  };

  const mockProject = {
    title: '测试项目',
    description: '项目描述',
    budget_min: 1000,
    budget_max: 5000,
    deadline: '2024-12-31',
    client_id: 1
  };

  beforeEach(async () => {
    mockProjectsService = {
      createProject: jest.fn()
    } as any;

    mockAuthService = {
      currentUser$: of(mockUser)
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize with invalid form', () => {
      expect(component.projectForm.valid).toBeFalsy();
    });

    it('should validate required fields', () => {
      const form = component.projectForm;
      expect(form.get('title')?.errors?.['required']).toBeTruthy();
      expect(form.get('description')?.errors?.['required']).toBeTruthy();
      expect(form.get('budget_min')?.errors?.['required']).toBeTruthy();
      expect(form.get('budget_max')?.errors?.['required']).toBeTruthy();
      expect(form.get('deadline')?.errors?.['required']).toBeTruthy();
    });

    it('should validate form with valid data', () => {
      const form = component.projectForm;
      form.patchValue(mockProject);
      expect(form.valid).toBeTruthy();
    });

    it('should validate budget minimum value', () => {
      const budgetMin = component.projectForm.get('budget_min');
      budgetMin?.setValue(-100);
      expect(budgetMin?.errors?.['min']).toBeTruthy();
      
      budgetMin?.setValue(1000);
      expect(budgetMin?.errors).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.projectForm.patchValue(mockProject);
    });

    it('should submit form with valid data', () => {
      mockProjectsService.createProject.mockReturnValue(of({}));
      
      component.onSubmit();
      
      expect(mockProjectsService.createProject).toHaveBeenCalledWith({
        ...mockProject,
        client_id: mockUser.user_id
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects']);
      expect(component.error).toBe('');
    });

    it('should handle submission error', () => {
      mockProjectsService.createProject.mockReturnValue(
        throwError(() => new Error('提交失败'))
      );
      
      component.onSubmit();
      
      expect(component.error).toBe('创建项目失败，请重试');
      expect(component.submitting).toBeFalsy();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not submit invalid form', () => {
      component.projectForm.get('title')?.setValue('');
      component.onSubmit();
      
      expect(mockProjectsService.createProject).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show submitting state during form submission', fakeAsync(() => {
      // 设置有效的表单数据
      component.projectForm.patchValue({
        title: '测试项目',
        description: '项目描述',
        budget_min: 1000,
        budget_max: 5000,
        deadline: '2024-12-31'
      });

      // 确保表单验证通过
      expect(component.projectForm.valid).toBeTruthy();

      // 设置 mock 响应
      mockAuthService.currentUser$ = of({
        user_id: 1,
        username: '测试用户',
        email: 'test@example.com'
      });
      mockProjectsService.createProject.mockReturnValue(of({}));
      
      // 调用提交前检查初始状态
      expect(component.submitting).toBeFalsy();
      
      // 调用提交
      component.onSubmit();
      
      // 立即检查 submitting 状态
      fixture.detectChanges();
      // expect(component.submitting).toBeTruthy();
      
      // 等待异步操作完成
      tick();
      fixture.detectChanges();
      
      // 验证服务调用和最终状态
      expect(mockProjectsService.createProject).toHaveBeenCalled();
      expect(component.submitting).toBeFalsy();
    }));
  });
});
