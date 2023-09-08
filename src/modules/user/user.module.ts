import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [DatabaseModule],
})
export class UserModule {}
