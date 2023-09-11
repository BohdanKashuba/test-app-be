import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  upload(file: Express.Multer.File) {
    const ext = path.extname(file.originalname);
    const filename = uuid() + ext;
    const fileUrl = path.join('images', filename);

    const nodeEnv = this.configService.get('NODE_ENV');

    if (nodeEnv === 'dev') {
      fs.writeFileSync(path.join(process.cwd(), 'tmp', fileUrl), file.buffer);
    } else {
      fs.writeFileSync(path.join('/tmp', fileUrl), file.buffer);
    }

    return fileUrl;
  }

  destroy(fileUrl: string) {
    const nodeEnv = this.configService.get('NODE_ENV');

    if (nodeEnv === 'dev') {
      fs.unlinkSync(path.join(process.cwd(), 'tmp', fileUrl));
    } else {
      fs.unlinkSync(path.join('/tmp', fileUrl));
    }
  }
}
