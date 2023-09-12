import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FileService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async findById(id: string) {
    return await this.databaseService.image.findFirst({ where: { id } });
  }

  async upload(file: Express.Multer.File) {
    const data = {
      data: file.buffer,
    };

    const newFile = await this.databaseService.image.create({
      data,
      select: { id: true },
    });

    return newFile.id;
  }

  async destroy(fileId: string) {
    await this.databaseService.image.delete({ where: { id: fileId } });
  }
}
