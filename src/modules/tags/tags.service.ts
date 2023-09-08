import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import {
  TCreateInput,
  TFindByInput,
  TUpdateInput,
} from './types/tags.prop-types.type';

@Injectable()
export class TagsService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async findManyBy(where?: TFindByInput) {
    return await this.databaseService.tag.findMany({ where });
  }

  async findBy(where: TFindByInput) {
    return await this.databaseService.tag.findFirst({ where });
  }

  async create(data: TCreateInput) {
    return await this.databaseService.tag.create({ data });
  }

  async update(id: string, data: TUpdateInput) {
    return await this.databaseService.tag.update({ data, where: { id } });
  }

  async delete(id: string) {
    return await this.databaseService.tag.delete({ where: { id } });
  }
}
