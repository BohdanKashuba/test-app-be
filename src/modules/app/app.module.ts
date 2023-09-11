import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { ProductModule } from '../product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TagsModule } from '../tags/tags.module';
import { AuthModule } from '../auth/auth.module';
import { WatchesModule } from '../watches/watches.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '.env'),
    }),
    ProductModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public'),
      serveRoot: '/api/v1',
    }),
    TagsModule,
    AuthModule,
    WatchesModule,
  ],
})
export class AppModule {}
