import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    // ... 其他imports
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
