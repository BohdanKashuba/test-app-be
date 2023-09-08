import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  providers: [TagsService],
  controllers: [TagsController],
  imports: [DatabaseModule],
})
export class TagsModule {}
