import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');
jest.mock('jwk-to-pem', () => jest.fn().mockReturnValue('mock-pem'));

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    user_id: 1,
    email: 'test@example.com',
    username: 'testuser',
    role: 'bidder',
    cognito_id: 'test-cognito-id',
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  const mockCognitoResponse = {
    AuthenticationResult: {
      AccessToken: 'test-token',
      IdToken: 'test-id-token',
      RefreshToken: 'test-refresh-token',
    },
  };

  const mockCognitoClient = {
    send: jest.fn().mockImplementation((command) => {
      switch (command.constructor.name) {
        case 'SignUpCommand':
          return Promise.resolve({
            UserConfirmed: false,
            UserSub: 'test-cognito-id',
          });
        case 'InitiateAuthCommand':
          return Promise.resolve({
            AuthenticationResult: {
              AccessToken: 'test-token',
              IdToken: 'test-id-token',
              RefreshToken: 'test-refresh-token',
            },
          });
        case 'ConfirmSignUpCommand':
          return Promise.resolve({
            // Cognito 确认注册成功后的响应
            UserConfirmed: true,
          });
        default:
          throw new Error(`Command not mocked: ${command.constructor.name}`);
      }
    }),
  };

  beforeEach(async () => {
    process.env.AWS_COGNITO_CLIENT_ID = '123456abcdef';
    process.env.AWS_COGNITO_USER_POOL_ID = 'us-east-1_123456789';
    process.env.AWS_REGION = 'ap-northeast-1';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: CognitoIdentityProviderClient,
          useValue: mockCognitoClient,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // 直接设置 service 的 cognitoClient
    Object.defineProperty(service, 'cognitoClient', {
      value: mockCognitoClient,
      writable: true,
    });

    // Mock jwt functions
    (jwt.decode as jest.Mock).mockReturnValue({
      complete: true,
      header: { kid: 'test-kid' },
      payload: { sub: 'test-cognito-id' },
    });
    (jwt.verify as jest.Mock).mockReturnValue({
      sub: 'test-cognito-id',
      email: 'test@example.com',
    });

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        keys: [
          {
            kid: 'test-kid',
            kty: 'RSA',
            n: 'test-n',
            e: 'test-e',
          },
        ],
      }),
    });

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('应该登录用户', async () => {
      const result = await service.login('test@example.com', 'password');
      expect(result).toEqual({
        token: mockCognitoResponse.AuthenticationResult,
        user: mockUser,
      });
      expect(mockCognitoClient.send).toHaveBeenCalled();
    });

    it('应该处理新用户登录', async () => {
      // 模拟 findOne 返回 null，表示用户不存在
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      // 模拟 create 和 save 返回新用户数据
      const newUser = {
        user_id: 1,
        email: 'newuser@example.com',
        username: 'newuser@example.com',
        role: 'bidder',
        cognito_id: 'test-cognito-id',
      };
      mockUserRepository.create.mockReturnValueOnce(newUser);
      mockUserRepository.save.mockResolvedValueOnce(newUser);

      const result = await service.login('newuser@example.com', 'password');
      expect(result).toEqual({
        token: mockCognitoResponse.AuthenticationResult,
        user: newUser,
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: 'newuser@example.com',
        email: 'newuser@example.com',
        role: 'bidder',
        cognito_id: 'test-cognito-id',
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('应该处理已存在用户的登录', async () => {
      // 模拟 findOne 返回已存在的用户
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.login('test@example.com', 'password');
      expect(result).toEqual({
        token: mockCognitoResponse.AuthenticationResult,
        user: mockUser,
      });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('应该更新用户的 cognito_id', async () => {
      // 模拟用户存在但 cognito_id 不匹配
      const userWithDifferentCognitoId = {
        ...mockUser,
        cognito_id: 'different-id',
      };
      mockUserRepository.findOne.mockResolvedValueOnce(
        userWithDifferentCognitoId,
      );

      const result = await service.login('test@example.com', 'password');
      expect(result).toEqual({
        token: mockCognitoResponse.AuthenticationResult,
        user: mockUser,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...userWithDifferentCognitoId,
        cognito_id: 'test-cognito-id',
      });
    });

    it('应该处理 Cognito 错误', async () => {
      mockCognitoClient.send.mockRejectedValueOnce(new Error('Cognito error'));

      await expect(
        service.login('test@example.com', 'password'),
      ).rejects.toThrow('Cognito error');
    });
  });

  describe('register', () => {
    it('应该注册用户', async () => {
      const userDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const result = await service.register(userDto);
      expect(result).toEqual(mockUser);
      expect(mockCognitoClient.send).toHaveBeenCalled();
    });
  });

  describe('confirmSignUp', () => {
    it('应该确认注册', async () => {
      const result = await service.confirmSignUp('test@example.com', '123456');
      expect(result).toEqual({ message: '邮箱验证成功' });
      expect(mockCognitoClient.send).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('应该获取当前用户信息', async () => {
      const result = await service.getCurrentUser('Bearer test-token');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { cognito_id: 'test-cognito-id' },
      });
    });

    it('应该处理无效的 token', async () => {
      jest
        .spyOn(service, 'verifyToken')
        .mockRejectedValueOnce(new Error('Invalid token'));

      await expect(service.getCurrentUser('invalid-token')).rejects.toThrow(
        'Invalid token',
      );
    });

    it('应该处理用户不存在的情况', async () => {
      jest.spyOn(service, 'verifyToken').mockResolvedValueOnce({
        sub: 'non-existent-id',
      });
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      const result = await service.getCurrentUser('valid-token');
      expect(result).toBeNull();
    });
  });

  describe('verifyToken', () => {
    it('应该验证 token', async () => {
      const result = await service.verifyToken('test-token');
      expect(result).toEqual({
        sub: 'test-cognito-id',
        email: 'test@example.com',
      });
    });

    it('应该处理 token 解码失败', async () => {
      (jwt.decode as jest.Mock).mockReturnValueOnce(null);

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        'Invalid token format',
      );
    });

    it('应该处理 token 验证失败', async () => {
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Token verification failed');
      });

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        'Token verification failed',
      );
    });

    it('应该处理获取公钥失败', async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed to fetch public key'));

      await expect(service.verifyToken('valid-token')).rejects.toThrow(
        'Failed to fetch public key',
      );
    });
  });

  describe('syncUsers', () => {
    it('应该同步新用户', async () => {
      const cognitoUsers = [
        {
          Attributes: [
            { Name: 'email', Value: 'new@example.com' },
            { Name: 'name', Value: 'New User' },
          ],
        },
      ];
      mockCognitoClient.send.mockResolvedValueOnce({ Users: cognitoUsers });
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      await service.syncUsers();

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: 'New User',
        email: 'new@example.com',
        role: 'bidder',
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('应该更新已存在用户', async () => {
      const cognitoUsers = [
        {
          Attributes: [
            { Name: 'email', Value: 'existing@example.com' },
            { Name: 'name', Value: 'Updated User' },
          ],
        },
      ];
      const existingUser = {
        user_id: 1,
        email: 'existing@example.com',
        username: 'Old User',
        role: 'bidder',
      };
      mockCognitoClient.send.mockResolvedValueOnce({ Users: cognitoUsers });
      mockUserRepository.findOne.mockResolvedValueOnce(existingUser);

      await service.syncUsers();

      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...existingUser,
        username: 'Updated User',
      });
    });

    it('应该处理同步错误', async () => {
      mockCognitoClient.send.mockRejectedValueOnce(new Error('Cognito error'));

      await expect(service.syncUsers()).rejects.toThrow('Cognito error');
    });

    it('应该处理用户已存在的情况', async () => {
      const cognitoUsers = [
        {
          Attributes: [
            { Name: 'email', Value: 'existing@example.com' },
            { Name: 'name', Value: 'Existing User' },
          ],
        },
      ];
      const existingUser = {
        user_id: 1,
        email: 'existing@example.com',
        username: 'Existing User',
        role: 'bidder',
      };
      mockCognitoClient.send.mockResolvedValueOnce({ Users: cognitoUsers });
      mockUserRepository.findOne.mockResolvedValueOnce(existingUser);

      await service.syncUsers();

      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...existingUser,
        username: 'Existing User',
      });
    });

    it('应该处理空的 Cognito 用户列表', async () => {
      mockCognitoClient.send.mockResolvedValueOnce({ Users: [] });

      await service.syncUsers();

      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('应该处理缺少必要属性的 Cognito 用户', async () => {
      const cognitoUsers = [
        {
          Attributes: [
            // 缺少 name 属性
            { Name: 'email', Value: 'test@example.com' },
          ],
        },
      ];
      mockCognitoClient.send.mockResolvedValueOnce({ Users: cognitoUsers });

      await service.syncUsers();

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });
});
