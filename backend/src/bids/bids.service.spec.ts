import { Test, TestingModule } from '@nestjs/testing';
import { BidsService } from './bids.service';
import { DataSource } from 'typeorm';
import { Bid } from '../entities/bids.entity';
import { User } from '../entities/users.entity';

describe('BidsService', () => {
  let service: BidsService;

  const mockBid = {
    bid_id: 1,
    project_id: 1,
    bidder_id: 1,
    amount: 1000,
    proposal: '测试投标',
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
    message: '测试消息',
  };

  const mockUser = {
    username: 'testuser',
  };

  const mockBidRepository = {
    find: jest.fn().mockResolvedValue([mockBid]),
    findOneBy: jest.fn().mockResolvedValue(mockBid),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    save: jest.fn().mockResolvedValue(mockBid),
    findBy: jest.fn().mockResolvedValue([mockBid]),
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  const mockDataSource = {
    getRepository: jest.fn((entity) => {
      if (entity === Bid) {
        return mockBidRepository;
      }
      if (entity === User) {
        return mockUserRepository;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<BidsService>(BidsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('应该返回所有投标', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBid]);
      expect(mockBidRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('应该返回单个投标', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockBid);
      expect(mockBidRepository.findOneBy).toHaveBeenCalledWith({ bid_id: 1 });
    });
  });

  describe('create', () => {
    it('应该创建投标', async () => {
      const result = await service.create(mockBid as Bid);
      expect(result).toEqual(mockBid);
      expect(mockBidRepository.save).toHaveBeenCalledWith(mockBid);
    });
  });

  describe('update', () => {
    it('应该更新投标', async () => {
      const result = await service.update(1, mockBid as Bid);
      expect(result).toEqual({ affected: 1 });
      expect(mockBidRepository.update).toHaveBeenCalledWith(1, mockBid);
    });
  });

  describe('findByProjectId', () => {
    it('应该返回项目的所有投标', async () => {
      const result = await service.findByProjectId(1);
      expect(result).toEqual([mockBid]);
      expect(mockBidRepository.findBy).toHaveBeenCalledWith({
        project_id: expect.objectContaining({
          _type: 'equal',
          _value: 1,
        }),
      });
    });
  });

  describe('updateStatus', () => {
    it('应该更新投标状态', async () => {
      const result = await service.updateStatus(1, 'accepted');
      expect(result).toEqual({ affected: 1 });
      expect(mockBidRepository.update).toHaveBeenCalledWith(1, {
        status: 'accepted',
      });
    });
  });

  describe('getBidUserName', () => {
    it('应该返回投标人姓名', async () => {
      const result = await service.getBidUserName(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
        select: ['username'],
      });
    });
  });
});
