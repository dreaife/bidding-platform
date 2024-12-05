import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { DataSource } from 'typeorm';
import { User } from '../entities/users.entity';
import { Project } from '../entities/projects.entity';
import { Bid } from '../entities/bids.entity';

describe('AdminService', () => {
  let service: AdminService;
  let mockDataSource: Partial<DataSource>;

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

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 用户相关测试
  describe('用户管理', () => {
    it('应该返回所有用户', async () => {
      const result = await service.findAllUsers();
      expect(result).toEqual([mockUser]);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('应该返回单个用户', async () => {
      const result = await service.findOneUser(1);
      expect(result).toEqual(mockUser);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
    });

    it('应该更新用户', async () => {
      const result = await service.updateUser(1, mockUser as User);
      expect(result).toEqual({ affected: 1 });
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockRepository.update).toHaveBeenCalledWith(1, mockUser);
    });

    it('应该删除用户', async () => {
      const result = await service.deleteUser(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(User);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  // 项目相关测试
  describe('项目管理', () => {
    it('应该返回所有项目', async () => {
      mockRepository.find.mockResolvedValueOnce([mockProject]);
      const result = await service.findAllProjects();
      expect(result).toEqual([mockProject]);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Project);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('应该返回单个项目', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(mockProject);
      const result = await service.findOneProject(1);
      expect(result).toEqual(mockProject);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Project);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ project_id: 1 });
    });

    it('应该更新项目', async () => {
      const result = await service.updateProject(1, mockProject as Project);
      expect(result).toEqual({ affected: 1 });
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Project);
      expect(mockRepository.update).toHaveBeenCalledWith(1, mockProject);
    });

    it('应该删除项目', async () => {
      const result = await service.deleteProject(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Project);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  // 投标相关测试
  describe('投标管理', () => {
    it('应该返回所有投标', async () => {
      mockRepository.find.mockResolvedValueOnce([mockBid]);
      const result = await service.findAllBids();
      expect(result).toEqual([mockBid]);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Bid);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('应该返回单个投标', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(mockBid);
      const result = await service.findOneBid(1);
      expect(result).toEqual(mockBid);
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Bid);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ bid_id: 1 });
    });

    it('应该更新投标', async () => {
      const result = await service.updateBid(1, mockBid as Bid);
      expect(result).toEqual({ affected: 1 });
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Bid);
      expect(mockRepository.update).toHaveBeenCalledWith(1, mockBid);
    });

    it('应该删除投标', async () => {
      const result = await service.deleteBid(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Bid);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
