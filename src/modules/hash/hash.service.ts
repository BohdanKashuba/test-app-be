import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private hashSalt: number;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const hashSalt = parseInt(configService.getOrThrow('HASH_SALT'));

    if (isNaN(hashSalt)) {
      throw new InternalServerErrorException('Invalid hash salt');
    }

    this.hashSalt = hashSalt;
  }

  async encrypt(input: string) {
    return bcrypt.hash(input, this.hashSalt);
  }

  async compare(input: string, output: string) {
    return bcrypt.compare(input, output);
  }
}
