import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/shared/database/database.module';
import { FileModule } from 'src/shared/file/file.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [DatabaseModule, FileModule],
})
export class ProductModule {}
