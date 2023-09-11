import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';
import { ProductModule } from '../product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TagsModule } from '../tags/tags.module';
import { AuthModule } from '../auth/auth.module';
import { WatchesModule } from '../watches/watches.module';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/shared/database/database.module';
import { HashModule } from '../hash/hash.module';

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
  ],
})
export class AppModule {}
