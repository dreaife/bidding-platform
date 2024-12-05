import { Test, TestingModule } from '@nestjs/testing';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { Bid } from '../entities/bids.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';

describe('BidsController', () => {
  let controller: BidsController;
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

  const mockBidsService = {
    findAll: jest.fn().mockResolvedValue([mockBid]),
    findOne: jest.fn().mockResolvedValue(mockBid),
    create: jest.fn().mockResolvedValue(mockBid),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findByProjectId: jest.fn().mockResolvedValue([mockBid]),
    updateStatus: jest.fn().mockResolvedValue({ affected: 1 }),
    getBidUserName: jest.fn().mockResolvedValue({ username: 'testuser' }),
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidsController],
      providers: [
        {
          provide: BidsService,
          useValue: mockBidsService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        RolesGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<BidsController>(BidsController);
    service = module.get<BidsService>(BidsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('应该返回所有投标', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockBid]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('应该返回单个投标', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockBid);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('应该创建投标', async () => {
      const result = await controller.create(mockBid as Bid);
      expect(result).toEqual(mockBid);
      expect(service.create).toHaveBeenCalledWith(mockBid as Bid);
    });
  });

  describe('update', () => {
    it('应该更新投标', async () => {
      const result = await controller.update(1, mockBid as Bid);
      expect(result).toEqual({ affected: 1 });
      expect(service.update).toHaveBeenCalledWith(1, mockBid as Bid);
    });
  });

  describe('findByProjectId', () => {
    it('应该返回项目的所有投标', async () => {
      const result = await controller.findByProjectId(1);
      expect(result).toEqual([mockBid]);
      expect(service.findByProjectId).toHaveBeenCalledWith(1);
    });
  });

  describe('acceptBid', () => {
    it('应该更新投标状态', async () => {
      const status = 'accepted';
      const result = await controller.acceptBid(1, { status });
      expect(result).toEqual({ affected: 1 });
      expect(service.updateStatus).toHaveBeenCalledWith(1, status);
    });
  });

  describe('getBidUserName', () => {
    it('应该返回投标人姓名', async () => {
      const result = await controller.getBidUserName(1);
      expect(result).toEqual({ username: 'testuser' });
      expect(service.getBidUserName).toHaveBeenCalledWith(1);
    });
  });
});
