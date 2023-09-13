import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export class AdminGuard implements CanActivate {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const role = request.headers?.['role'];
    const secret = request.headers?.['admin-secret'];

    const adminSecret = this.configService.getOrThrow('ADMIN_SECRET');

    if (role !== 'admin' || secret !== adminSecret) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
