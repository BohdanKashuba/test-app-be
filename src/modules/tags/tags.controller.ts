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
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagDto, UpdateTagDto } from './dto/tag.dto';

@Controller('tags')
export class TagsController {
  constructor(@Inject(TagsService) private readonly tagsService: TagsService) {}

  @Get()
  async findAllTagsHandler() {
    return await this.tagsService.findManyBy();
  }

  @Get(':id')
  async findTagHandler(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tagsService.findBy({ id });
  }

  @Post()
  async createTagHandler(@Body() dto: TagDto) {
    return await this.tagsService.create(dto);
  }

  @Put(':id')
  async updateTagHandler(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return await this.tagsService.update(id, dto);
  }

  @Delete(':id')
  async deleteTagHandler(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tagsService.delete(id);
  }
}
