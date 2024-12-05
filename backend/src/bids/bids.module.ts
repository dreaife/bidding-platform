import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    // ... 其他imports
  ],
  providers: [BidsService],
  controllers: [BidsController],
})
export class BidsModule {}
