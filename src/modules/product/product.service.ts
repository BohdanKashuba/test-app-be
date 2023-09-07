import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import {
  TCreateInput,
  TFindByInput,
  TFindManyByInput,
  TUpdateInput,
} from './types/product.prop-types.type';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async findBy(where: TFindByInput) {
    return await this.databaseService.product.findFirst({ where });
  }

  async findManyBy(where?: TFindManyByInput) {
    return await this.databaseService.product.findFirst({ where });
  }

  async create(data: TCreateInput) {
    const creationData = { ...data, image: '', rate: 0 };

    return await this.databaseService.product.create({ data: creationData });
  }

  async update(id: string, data: TUpdateInput) {
    const creationData = { ...data, image: '' };

    return await this.databaseService.product.update({
      data: creationData,
      where: { id },
    });
  }

  async delete(id: string) {
    await this.databaseService.product.findFirst({ where: { id } });
  }
}
