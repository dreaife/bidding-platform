import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!\nGet started at https://github.com/dreaife/bidding-platform\nGet API docs at /swagger';
  }
}
