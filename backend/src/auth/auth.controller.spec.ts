import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDto } from 'src/entities/DTO/users.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ token: 'test-token', user: {} }),
    register: jest.fn().mockResolvedValue({}),
    confirmSignUp: jest.fn().mockResolvedValue({ message: '邮箱验证成功' }),
    getCurrentUser: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('应该登录用户', async () => {
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'test',
        role: 'bider',
      };
      const result = await controller.login(userDto);
      expect(result).toEqual({ token: 'test-token', user: {} });
      expect(service.login).toHaveBeenCalledWith(
        userDto.email,
        userDto.password,
      );
    });
  });

  describe('register', () => {
    it('应该注册用户', async () => {
      const userDto: UserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'test',
        role: 'bider',
      };
      const result = await controller.register(userDto);
      expect(result).toEqual({});
      expect(service.register).toHaveBeenCalledWith(userDto);
    });
  });

  describe('confirmSignUp', () => {
    it('应该确认注册', async () => {
      const confirmDto = { email: 'test@example.com', code: '123456' };
      const result = await controller.confirmSignUp(confirmDto);
      expect(result).toEqual({ message: '邮箱验证成功' });
      expect(service.confirmSignUp).toHaveBeenCalledWith(
        confirmDto.email,
        confirmDto.code,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('应该获取当前用户信息', async () => {
      const token = 'Bearer test-token';
      const result = await controller.getCurrentUser(token);
      expect(result).toEqual({});
      expect(service.getCurrentUser).toHaveBeenCalledWith(token);
    });
  });
});
