import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TUser } from '../../modules/user/types/user.type';
import { DatabaseService } from '../../shared/database/database.service';
import { HashService } from '../../modules/hash/hash.service';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
    @Inject(HashService) private readonly hashService: HashService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers['authorization'];

    try {
      const secret = this.configService.getOrThrow('JWT_SECRET');
      this.jwtService.verify(token, { secret });
    } catch {
      throw new UnauthorizedException();
    }

    const data = this.jwtService.decode(token) as Partial<TUser>;

    const user = await this.databaseService.user.findFirst({
      where: { id: data.id },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidPass = this.hashService.compare(data?.password, user.password);

    if (!isValidPass) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
