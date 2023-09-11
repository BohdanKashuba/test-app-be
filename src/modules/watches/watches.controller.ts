import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { WatchesService } from './watches.service';
import { WatchDto } from './dto/watches.dto';

@Controller('watches')
export class WatchesController {
  constructor(
    @Inject(WatchesService) private readonly watchesService: WatchesService,
  ) {}

  @Post('connect')
  async connectWatchesHandler(@Body() dto: WatchDto) {
    await this.watchesService.connect(dto.userId, dto.productId);
  }

  @Post('disconnect')
  async disconnectWatchesHandler(@Body() dto: WatchDto) {
    await this.watchesService.disconnect(dto.userId, dto.productId);
  }

  @Get(':userId')
  async getWatches(@Param('userId', ParseUUIDPipe) id: string) {
    return await this.watchesService.getConnections(id);
  }
}
