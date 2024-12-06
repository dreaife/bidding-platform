import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import 'whatwg-fetch';

setupZoneTestEnv();

// 禁用 console.error
global.console.error = jest.fn();
global.console.warn = jest.fn();
global.console.info = jest.fn();
global.console.debug = jest.fn();
