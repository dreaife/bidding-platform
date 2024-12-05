import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource } from 'typeorm';
import { User } from '../entities/users.entity';
import { Project } from '../entities/projects.entity';
import { Bid } from '../entities/bids.entity';

describe('UsersService', () => {
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

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  const mockProjectRepository = {
    find: jest.fn().mockResolvedValue([mockProject]),
  };

  const mockBidRepository = {
    find: jest.fn().mockResolvedValue([mockBid]),
  };

  const mockDataSource = {
    getRepository: jest.fn((entity) => {
      if (entity === User) {
        return mockUserRepository;
      } else if (entity === Project) {
        return mockProjectRepository;
      } else if (entity === Bid) {
        return mockBidRepository;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('应该返回所有用户', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('应该返回单个用户', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
    });
  });

  describe('create', () => {
    it('应该创建并返回新用户', async () => {
      const result = await service.create(mockUser as User);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('应该更新用户', async () => {
      const result = await service.update(1, mockUser as User);
      expect(result).toEqual({ affected: 1 });
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, mockUser);
    });
  });

  describe('delete', () => {
    it('应该删除用户', async () => {
      const result = await service.delete(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getName', () => {
    it('应该返回用户名', async () => {
      const result = await service.getName(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
    });
  });

  describe('getCurrentUser', () => {
    it('应该返回当前用户信息', async () => {
      const result = await service.getCurrentUser(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
    });
  });

  describe('updateProfile', () => {
    it('应该更新当前用户信息', async () => {
      const updateData = { email: 'new@example.com' };
      const result = await service.updateProfile(1, updateData);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('findUserProjects', () => {
    it('应该返回用户的项目', async () => {
      const result = await service.findUserProjects(1);
      expect(result).toEqual([mockProject]);
      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        where: { client_id: 1 },
      });
    });
  });

  describe('findUserBids', () => {
    it('应该返回用户的投标', async () => {
      const result = await service.findUserBids(1);
      expect(result).toEqual([mockBid]);
      expect(mockBidRepository.find).toHaveBeenCalledWith({
        where: { bidder_id: 1 },
      });
    });
  });
});
