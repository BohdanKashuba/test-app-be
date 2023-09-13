import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';
import { ProductModule } from '../product/product.module';
import { TagsModule } from '../tags/tags.module';
import { AuthModule } from '../auth/auth.module';
import { WatchesModule } from '../watches/watches.module';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../shared/database/database.module';
import { HashModule } from '../hash/hash.module';
import { FileModule } from '../../shared/file/file.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '.env'),
    }),
    ProductModule,
    TagsModule,
    AuthModule,
    WatchesModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow('JWT_SECRET');

        return {
          secret,
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    DatabaseModule,
    HashModule,
    FileModule,
    CartModule,
  ],
})
export class AppModule {}
