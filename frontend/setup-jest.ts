import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import 'whatwg-fetch';

setupZoneTestEnv();

// 禁用 console.error
global.console.error = jest.fn();
