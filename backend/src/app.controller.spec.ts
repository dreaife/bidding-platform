import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const mockAppService = {
    getHello: jest
      .fn()
      .mockReturnValue(
        'Hello World!\nGet started at https://github.com/dreaife/bidding-platform\nGet API docs at /swagger',
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('应该返回欢迎信息', () => {
      const result = controller.getHello();
      expect(result).toBe(mockAppService.getHello());
      expect(service.getHello).toHaveBeenCalled();
    });
  });
});
