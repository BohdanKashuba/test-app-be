import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { INVALID_COOKIES_TTL } from 'src/common/messages/exceptions';

@Controller('auth')
export class AuthController {
  private readonly cookiesTTL: number;

  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const cookiesTTL = parseInt(configService.getOrThrow('COOKIES_TTL'));

    if (isNaN(cookiesTTL)) {
      throw new InternalServerErrorException(INVALID_COOKIES_TTL);
    }

    this.cookiesTTL = cookiesTTL;
  }

  @Post('sign-up')
  async signUpHandler(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SignUpDto,
  ) {
    const data = await this.authService.signUp(dto);

    res
      .cookie('refresh-token', data.tokens.refreshToken, {
        expires: new Date(Date.now() + this.cookiesTTL),
      })
      .json({ user: data.user, accessToken: data.tokens.accessToken });
  }

  @Post('login')
  async loginUpHandler(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const data = await this.authService.login(dto);

    res
      .cookie('refresh-token', data.tokens.refreshToken, {
        expires: new Date(Date.now() + this.cookiesTTL),
      })
      .json({ user: data.user, accessToken: data.tokens.accessToken });
  }

  @Get('refresh')
  async refreshHandler(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh-token'];

    console.log(req.cookies, refreshToken, req);

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const data = await this.authService.validateUser(refreshToken);

    res
      .cookie('refresh-token', data.tokens.refreshToken, {
        expires: new Date(Date.now() + this.cookiesTTL),
      })
      .json({ user: data.user, accessToken: data.tokens.accessToken });
  }
}
