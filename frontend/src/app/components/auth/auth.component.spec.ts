import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(waitForAsync(() => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      confirmSignUp: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true),
    };

    TestBed.configureTestingModule({
      imports: [
        AuthComponent, // 作为独立组件导入
        ReactiveFormsModule, // 导入必要的模块，如 ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('初始化', () => {
    it('应该正确初始化组件', () => {
      expect(component).toBeTruthy();
      expect(component.isLogin).toBeTruthy();
      expect(component.needConfirm).toBeFalsy();
      expect(component.error).toBe('');
    });
  });

  describe('表单验证', () => {
    it('登录模式下应正确验证表单', () => {
      component.isLogin = true;
      
      // 空表单应该无效
      expect(component.isValid()).toBeFalsy();

      // 只填写邮箱应该无效
      component.email = 'test@example.com';
      expect(component.isValid()).toBeFalsy();

      // 填写邮箱和密码应该有效
      component.password = 'password';
      expect(component.isValid()).toBeTruthy();
    });

    it('注册模式下应正确验证表单', () => {
      component.isLogin = false;
      
      // 空表单应该无效
      expect(component.isValid()).toBeFalsy();

      // 部分填写应该无效
      component.email = 'test@example.com';
      component.password = 'password';
      expect(component.isValid()).toBeFalsy();

      // 完整填写应该有效
      component.username = 'testuser';
      expect(component.isValid()).toBeTruthy();
    });

    it('确认模式下应正确验证表单', () => {
      component.needConfirm = true;
      
      // 空表单应该无效
      expect(component.isValid()).toBeFalsy();

      // 只填写邮箱应该无效
      component.email = 'test@example.com';
      expect(component.isValid()).toBeFalsy();

      // 填写邮箱和确认码应该有效
      component.confirmationCode = '123456';
      expect(component.isValid()).toBeTruthy();
    });
  });

  describe('表单提交', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // 重置所有 mock
    });

    it('表单无效时不应提交', async () => {
      // 不填写任何字段
      await component.onSubmit();
      
      expect(component.error).toBe('请填写所有字段');
      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(mockAuthService.register).not.toHaveBeenCalled();
      expect(mockAuthService.confirmSignUp).not.toHaveBeenCalled();
    });

    it('登录成功后应导航到项目页面', async () => {
      component.isLogin = true;
      component.email = 'test@example.com';
      component.password = 'password';
      
      const loginResponse = { token: 'fake-token', user: { id: 1, username: 'testuser' } };
      mockAuthService.login.mockResolvedValue(loginResponse);

      // 调用 onSubmit 并等待其完成
      await component.onSubmit();

      // 更新组件视图
      fixture.detectChanges();

      // 断言 AuthService.login 被正确调用
      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
      // 断言 Router.navigate 被正确调用
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects']);
    });

    it('注册成功后应进入确认模式', async () => {
      component.isLogin = false;
      component.email = 'test@example.com';
      component.password = 'password';
      component.username = 'testuser';
      
      // 模拟 AuthService.register 返回一个成功的 Promise
      mockAuthService.register.mockResolvedValue({ message: '注册成功' });

      // 调用 onSubmit 并等待其完成
      await component.onSubmit();

      // 更新组件视图
      fixture.detectChanges();

      // 断言 AuthService.register 被正确调用
      expect(mockAuthService.register).toHaveBeenCalledWith(
        'test@example.com',
        'password',
        'testuser'
      );
      // 断言需要确认模式被设置为 true
      expect(component.needConfirm).toBeTruthy();
      // 断言错误信息被正确设置
      expect(component.error).toBe('注册成功，请查收邮箱并输入确认码');
    });

    it('确认成功后应返回登录模式', async () => {
      component.needConfirm = true;
      component.email = 'test@example.com';
      component.confirmationCode = '123456';
      
      // 模拟 AuthService.confirmSignUp 返回一个成功的 Promise
      mockAuthService.confirmSignUp.mockResolvedValue({ message: '邮箱验证成功' });

      // 调用 onSubmit 并等待其完成
      await component.onSubmit();

      // 更新组件视图
      fixture.detectChanges();

      // 断言 AuthService.confirmSignUp 被正确调用
      expect(mockAuthService.confirmSignUp).toHaveBeenCalledWith('test@example.com', '123456');
      // 断言 isLogin 被设置为 true
      expect(component.isLogin).toBeTruthy();
      // 断言 needConfirm 被设置为 false
      expect(component.needConfirm).toBeFalsy();
      // 断言错误信息被正确设置
      expect(component.error).toBe('邮箱验证成功，请登录');
    });

    it('应处理登录错误', async () => {
      component.isLogin = true;
      component.email = 'test@example.com';
      component.password = 'password';
      
      // 模拟 AuthService.login 返回一个失败的 Promise
      mockAuthService.login.mockRejectedValue(new Error('登录失败'));

      // 调用 onSubmit
      await component.onSubmit();
      fixture.detectChanges();

      expect(component.error).toBe('登录失败');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('应处理注册错误', async () => {
      component.isLogin = false;
      component.email = 'test@example.com';
      component.password = 'password';
      component.username = 'testuser';
      
      mockAuthService.register.mockRejectedValue(new Error('注册失败'));

      await component.onSubmit();
      fixture.detectChanges();

      expect(component.error).toBe('注册失败');
      expect(component.needConfirm).toBeFalsy();
    });

    it('应处理确认错误', async () => {
      // 设置初始状态
      component.isLogin = false;  // 明确设置为 false
      component.needConfirm = true;
      component.email = 'test@example.com';
      component.confirmationCode = '123456';
      
      mockAuthService.confirmSignUp.mockRejectedValue(new Error('验证码错误'));

      await component.onSubmit();
      fixture.detectChanges();

      expect(component.error).toBe('验证码错误');
      expect(component.isLogin).toBeFalsy();
      expect(component.needConfirm).toBeTruthy();
    });
  });

  describe('切换模式', () => {
    it('应正确切换登录/注册模式', () => {
      // 初始应为登录模式
      expect(component.isLogin).toBeTruthy();

      // 切换到注册模式
      component.toggleMode();
      expect(component.isLogin).toBeFalsy();
      expect(component.error).toBe('');

      // 切换回登录模式
      component.toggleMode();
      expect(component.isLogin).toBeTruthy();
      expect(component.error).toBe('');
    });

    it('确认模式下不应切换模式', () => {
      // 设置初始状态
      component.isLogin = false;  // 先设置为 false
      component.needConfirm = true;

      const originalLoginState = component.isLogin;  // 保存原始状态
      
      component.toggleMode();
      fixture.detectChanges();
      
      // 验证状态保持不变
      expect(component.isLogin).toBe(originalLoginState);  // 使用原始状态进行比较
      expect(component.needConfirm).toBeTruthy();
    });
  });

  describe('表单重置', () => {
    it('应正确重置表单字段', () => {
      // 设置表单字段
      component.email = 'test@example.com';
      component.password = 'password';
      component.username = 'testuser';
      component.confirmationCode = '123456';
      component.error = '某些错误';

      fixture.detectChanges();  // 更新视图
      component.resetForm();
      fixture.detectChanges();  // 再次更新视图

      // 验证所有字段都被重置
      expect(component.email).toBe('');
      expect(component.password).toBe('');
      expect(component.username).toBe('');
      expect(component.confirmationCode).toBe('');
      expect(component.error).toBe('');
    });
  });
});
