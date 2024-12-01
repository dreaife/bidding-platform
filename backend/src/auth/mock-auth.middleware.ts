import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MockAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.user = { id: 1, role: 'client' };
    // console.log('Middleware req.user:', req.user);
    next();
  }
}
