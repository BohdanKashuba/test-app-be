import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';

@Injectable()
export class FileService {
  upload(file: Express.Multer.File) {
    const ext = path.extname(file.originalname);
    const filename = uuid() + ext;
    const fileUrl = path.join('images', filename);

    fs.writeFileSync(path.join(process.cwd(), 'public', fileUrl), file.buffer);

    return fileUrl;
  }

  destroy(fileUrl: string) {
    fs.unlinkSync(path.join(process.cwd(), 'public', fileUrl));
  }
}
