import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from './roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockAuthService = {
    getCurrentUser: jest.fn(),
  };

  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('当没有设置角色要求时应该返回 true', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = await guard.canActivate(
        mockExecutionContext as unknown as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('当没有提供 token 时应该抛出 UnauthorizedException', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
        headers: {},
      });

      await expect(
        guard.canActivate(mockExecutionContext as unknown as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('当用户角色匹配时应该返回 true', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        role: Role.Admin,
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: 'Bearer test-token' },
      });
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const result = await guard.canActivate(
        mockExecutionContext as unknown as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('当用户角色不匹配时应该返回 false', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        role: Role.Bidder,
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: 'Bearer test-token' },
      });
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const result = await guard.canActivate(
        mockExecutionContext as unknown as ExecutionContext,
      );

      expect(result).toBe(false);
    });

    it('当 token 无效时应该抛出 UnauthorizedException', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);
      mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: 'Bearer invalid-token' },
      });
      mockAuthService.getCurrentUser.mockResolvedValue(null);

      await expect(
        guard.canActivate(mockExecutionContext as unknown as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('应该将用户信息添加到请求中', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        role: Role.Admin,
      };

      const mockRequest = {
        headers: { authorization: 'Bearer test-token' },
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);
      mockExecutionContext
        .switchToHttp()
        .getRequest.mockReturnValue(mockRequest);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

      await guard.canActivate(
        mockExecutionContext as unknown as ExecutionContext,
      );

      expect(mockRequest['user']).toEqual(mockUser);
    });
  });
});
