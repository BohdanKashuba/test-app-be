import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(@Inject(FileService) private readonly fileService: FileService) {}

  @Get(':id')
  async getFileById(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.fileService.findById(id);

    const stream = Readable.from(file.data);

    res.set({
      'Content-Disposition': `inline; filename="${file.id}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
  }
}
