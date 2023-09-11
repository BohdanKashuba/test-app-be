import { Module } from '@nestjs/common';
import { WatchesController } from './watches.controller';
import { WatchesService } from './watches.service';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  controllers: [WatchesController],
  providers: [WatchesService],
  exports: [WatchesService],
  imports: [DatabaseModule],
})
export class WatchesModule {}
