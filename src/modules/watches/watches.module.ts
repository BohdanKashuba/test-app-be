import { Module } from '@nestjs/common';
import { WatchesController } from './watches.controller';
import { WatchesService } from './watches.service';

@Module({
  controllers: [WatchesController],
  providers: [WatchesService],
  exports: [WatchesService],
  imports: [],
})
export class WatchesModule {}
