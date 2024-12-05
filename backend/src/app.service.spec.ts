import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('应该返回正确的欢迎信息', () => {
      const expectedMessage =
        'Hello World!\nGet started at https://github.com/dreaife/bidding-platform\nGet API docs at /swagger';
      expect(service.getHello()).toBe(expectedMessage);
    });

    it('应该包含 GitHub 链接', () => {
      const result = service.getHello();
      expect(result).toContain('https://github.com/dreaife/bidding-platform');
    });

    it('应该包含 Swagger 文档信息', () => {
      const result = service.getHello();
      expect(result).toContain('/swagger');
    });
  });
});
