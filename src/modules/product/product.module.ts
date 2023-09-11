import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {} from '../../shared/database/database.module';
import { FileModule } from '../../shared/file/file.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [FileModule],
})
export class ProductModule {}
