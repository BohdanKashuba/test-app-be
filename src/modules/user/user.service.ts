import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import {
  TCreateInput,
  TFindByInput,
  TFindManyByInput,
  TUpdateInput,
} from './types/user.prop-types.type';

@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async findBy(where: TFindByInput) {
    return await this.databaseService.user.findFirst({ where });
  }

  async findManyBy(where?: TFindManyByInput) {
    return await this.databaseService.user.findMany({ where });
  }

  async create(data: TCreateInput) {
    return await this.databaseService.user.create({ data });
  }

  async update(id: string, data: TUpdateInput) {
    return await this.databaseService.user.update({ data, where: { id } });
  }

  async delete(id: string) {
    await this.databaseService.user.delete({ where: { id } });
  }
}
