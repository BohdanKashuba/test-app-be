import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagDto, UpdateTagDto } from './dto/tag.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('tags')
export class TagsController {
  constructor(@Inject(TagsService) private readonly tagsService: TagsService) {}

  @Get()
  async findAllTagsHandler() {
    return await this.tagsService.findManyBy();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async findTagHandler(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tagsService.findBy({ id });
  }

  @Post()
  @UseGuards(AdminGuard)
  async createTagHandler(@Body() dto: TagDto) {
    return await this.tagsService.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateTagHandler(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return await this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteTagHandler(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tagsService.delete(id);
  }
}
