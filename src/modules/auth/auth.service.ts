import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EMAIL_EXISTS, INVALID_CREDS } from '../../common/messages/exceptions';
import { UserService } from '../../modules/user/user.service';
import { HashService } from '../hash/hash.service';
import { TLogin, TSignUp } from './types/auth.prop-types.type';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TUser } from '../user/types/user.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(HashService) private readonly hashService: HashService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  generateTokens<T extends object>(data: T) {
    const expiresInAT = this.configService.getOrThrow('JWT_AT_EXPIRES_IN');
    const expiresInRT = this.configService.getOrThrow('JWT_RT_EXPIRES_IN');

    const accessToken = this.jwtService.sign(data, {
      expiresIn: expiresInAT,
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: expiresInRT,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(data: TSignUp) {
    const user = await this.userService.findBy({ email: data.email });

    if (user) {
      throw new UnprocessableEntityException(EMAIL_EXISTS);
    }

    const pass = await this.hashService.encrypt(data.password);

    const newUser = await this.userService.create({ ...data, password: pass });

    const tokens = this.generateTokens(user);

    delete newUser.password;

    return {
      user: newUser,
      tokens,
    };
  }

  async login(data: TLogin) {
    const user = await this.userService.findBy({ email: data.email });

    if (!user) {
      throw new UnprocessableEntityException(INVALID_CREDS);
    }

    const isValidPass = await this.hashService.compare(
      data.password,
      user.password,
    );

    if (!isValidPass) {
      throw new UnprocessableEntityException(INVALID_CREDS);
    }

    const tokens = this.generateTokens(user);

    delete user.password;

    return {
      user: user,
      tokens,
    };
  }

  async validateUser(token: string) {
    const secret = this.configService.getOrThrow('JWT_SECRET');

    try {
      this.jwtService.verify(token, { secret });
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }

    const data = this.jwtService.decode(token) as Partial<TUser>;

    const user = await this.userService.findBy({ email: data?.email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidPass = data?.password === user.password;

    if (!isValidPass) {
      throw new UnauthorizedException();
    }

    const tokens = this.generateTokens(user);

    delete user.password;

    return {
      user: user,
      tokens,
    };
  }
}
