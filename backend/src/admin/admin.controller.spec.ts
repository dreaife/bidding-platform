import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../entities/users.entity';
import { Project } from '../entities/projects.entity';
import { Bid } from '../entities/bids.entity';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockUser = {
    user_id: 1,
    email: 'test@example.com',
    username: 'testuser',
    role: 'bidder',
  };

  const mockProject = {
    project_id: 1,
    title: '测试项目',
    description: '这是一个测试项目',
    budget_min: 1000,
    budget_max: 5000,
    deadline: new Date(),
  };

  const mockBid = {
    bid_id: 1,
    project_id: 1,
    bidder_id: 1,
    amount: 3000,
    proposal: '测试投标',
    message: '测试留言',
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAdminService = {
    findAllUsers: jest.fn().mockResolvedValue([mockUser]),
    findOneUser: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue({ affected: 1 }),
    deleteUser: jest.fn().mockResolvedValue({ affected: 1 }),
    findAllProjects: jest.fn().mockResolvedValue([mockProject]),
    findOneProject: jest.fn().mockResolvedValue(mockProject),
    updateProject: jest.fn().mockResolvedValue({ affected: 1 }),
    deleteProject: jest.fn().mockResolvedValue({ affected: 1 }),
    findAllBids: jest.fn().mockResolvedValue([mockBid]),
    findOneBid: jest.fn().mockResolvedValue(mockBid),
    updateBid: jest.fn().mockResolvedValue({ affected: 1 }),
    deleteBid: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: AuthService,
          useValue: {
            getCurrentUser: jest.fn(),
            verifyToken: jest.fn(),
          },
        },
        {
          provide: RolesGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // 用户相关测试
  describe('用户管理', () => {
    it('应该返回所有用户', async () => {
      const result = await controller.findAllUsers();
      expect(result).toEqual([mockUser]);
      expect(service.findAllUsers).toHaveBeenCalled();
    });

    it('应该返回单个用户', async () => {
      const result = await controller.findOneUser(1);
      expect(result).toEqual(mockUser);
      expect(service.findOneUser).toHaveBeenCalledWith(1);
    });

    it('应该更新用户', async () => {
      const result = await controller.updateUser(1, mockUser as User);
      expect(result).toEqual({ affected: 1 });
      expect(service.updateUser).toHaveBeenCalledWith(1, mockUser);
    });

    it('应该删除用户', async () => {
      const result = await controller.deleteUser(1);
      expect(result).toEqual({ affected: 1 });
      expect(service.deleteUser).toHaveBeenCalledWith(1);
    });
  });

  // 项目相关测试
  describe('项目管理', () => {
    it('应该返回所有项目', async () => {
      const result = await controller.findAllProjects();
      expect(result).toEqual([mockProject]);
      expect(service.findAllProjects).toHaveBeenCalled();
    });

    it('应该返回单个项目', async () => {
      const result = await controller.findOneProject(1);
      expect(result).toEqual(mockProject);
      expect(service.findOneProject).toHaveBeenCalledWith(1);
    });

    it('应该更新项目', async () => {
      const result = await controller.updateProject(1, mockProject as Project);
      expect(result).toEqual({ affected: 1 });
      expect(service.updateProject).toHaveBeenCalledWith(1, mockProject);
    });

    it('应该删除项目', async () => {
      const result = await controller.deleteProject(1);
      expect(result).toEqual({ affected: 1 });
      expect(service.deleteProject).toHaveBeenCalledWith(1);
    });
  });

  // 投标相关测试
  describe('投标管理', () => {
    it('应该返回所有投标', async () => {
      const result = await controller.findAllBids();
      expect(result).toEqual([mockBid]);
      expect(service.findAllBids).toHaveBeenCalled();
    });

    it('应该返回单个投标', async () => {
      const result = await controller.findOneBid(1);
      expect(result).toEqual(mockBid);
      expect(service.findOneBid).toHaveBeenCalledWith(1);
    });

    it('应该更新投标', async () => {
      const result = await controller.updateBid(1, mockBid as Bid);
      expect(result).toEqual({ affected: 1 });
      expect(service.updateBid).toHaveBeenCalledWith(1, mockBid);
    });

    it('应该删除投标', async () => {
      const result = await controller.deleteBid(1);
      expect(result).toEqual({ affected: 1 });
      expect(service.deleteBid).toHaveBeenCalledWith(1);
    });
  });
});
