import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUpHandler(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SignUpDto,
  ) {
    const data = await this.authService.login(dto);

    res
      .cookie('refresh-token', data.tokens.refreshToken)
      .json({ user: data.user, accessToken: data.tokens.accessToken });
  }

  @Post('login')
  async loginUpHandler(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SignUpDto,
  ) {
    const data = await this.authService.login(dto);

    res
      .cookie('refresh-token', data.tokens.refreshToken)
      .json({ user: data.user, accessToken: data.tokens.accessToken });
  }

  @Get('refresh')
  async refreshHandler(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const data = await this.authService.validateUser(refreshToken);

    res
      .cookie('refresh-token', data.tokens.refreshToken)
      .json({ user: data.user, accessToken: data.tokens.accessToken });
  }
}
