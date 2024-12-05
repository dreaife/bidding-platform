import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { User } from '../entities/users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    user_id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockProject = {
    project_id: 1,
    client_id: 1,
    title: 'Test Project',
  };

  const mockBid = {
    bid_id: 1,
    bidder_id: 1,
    amount: 100,
  };

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    getName: jest.fn().mockResolvedValue(mockUser),
    getCurrentUser: jest.fn().mockResolvedValue(mockUser),
    updateProfile: jest.fn().mockResolvedValue(mockUser),
    findUserProjects: jest.fn().mockResolvedValue([mockProject]),
    findUserBids: jest.fn().mockResolvedValue([mockBid]),
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        RolesGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    // 重置所有 mock
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('应该返回当前用户信息', async () => {
      const result = await controller.getCurrentUser(1);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getUserProjects', () => {
    it('应该返回用户的项目', async () => {
      const result = await controller.getUserProjects(1);
      expect(result).toEqual([mockProject]);
      expect(service.findUserProjects).toHaveBeenCalledWith(1);
    });
  });

  describe('getUserBids', () => {
    it('应该返回用户的投标', async () => {
      const result = await controller.getUserBids(1);
      expect(result).toEqual([mockBid]);
      expect(service.findUserBids).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('应该返回所有用户', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('应该返回单个用户', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('应该创建用户', async () => {
      const result = await controller.create(mockUser as User);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(mockUser as User);
    });
  });

  describe('update', () => {
    it('应该更新用户', async () => {
      const result = await controller.update(1, mockUser as User);
      expect(result).toEqual({ affected: 1 });
      expect(service.update).toHaveBeenCalledWith(1, mockUser as User);
    });
  });

  describe('delete', () => {
    it('应该删除用户', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual({ affected: 1 });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('updateProfile', () => {
    it('应该更新用户档案', async () => {
      const updateData = { email: 'new@example.com' };
      const result = await controller.updateProfile(1, updateData);
      expect(result).toEqual(mockUser);
      expect(service.updateProfile).toHaveBeenCalledWith(1, updateData);
    });
  });
});
