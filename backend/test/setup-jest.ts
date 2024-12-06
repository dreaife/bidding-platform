// 禁用所有 console 输出
global.console = {
  ...console,
//   log: jest.fn(),
  error: jest.fn(),
//   warn: jest.fn(),
//   info: jest.fn(),
//   debug: jest.fn(),
}; 