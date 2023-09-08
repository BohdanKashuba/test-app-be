import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import {
  TCreateInput,
  TFindByInput,
  TFindManyByInput,
  TOrderBy,
  TUpdateInput,
} from './types/product.prop-types.type';
import { FileService } from 'src/file/file.service';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
    @Inject(FileService) private readonly fileService: FileService,
  ) {}

  async findBy(where: TFindByInput) {
    return await this.databaseService.product.findFirst({ where });
  }

  async findManyBy(where?: TFindManyByInput, orderBy?: TOrderBy) {
    return await this.databaseService.product.findMany({
      where,
      orderBy,
    });
  }

  async create(data: TCreateInput) {
    const image = this.fileService.upload(data.image);

    const creationData = {
      ...data,
      image,
      rate: 0,
      tags: data?.tags.map((t) => ({ id: t })) ?? [],
    };

    return await this.databaseService.product.create({
      data: { ...creationData, tags: { connect: creationData.tags } },
    });
  }

  async update(id: string, data: TUpdateInput) {
    const oldProduct = await this.databaseService.product.findFirst({
      where: { id },
    });

    let image: string;

    if (data.image) {
      image = this.fileService.upload(data.image);
    }

    const uploadData = {
      ...data,
      image,
      tags: data?.tags.map((t) => ({ id: t })),
    };

    const product = await this.databaseService.product
      .update({
        data: { ...uploadData, tags: { set: uploadData.tags } },
        where: { id },
      })
      .catch(() => {
        this.fileService.destroy(image);

        throw new InternalServerErrorException();
      });

    if (image && oldProduct.image) {
      this.fileService.destroy(oldProduct.image);
    }

    return product;
  }

  async delete(id: string) {
    const product = await this.databaseService.product.delete({
      where: { id },
    });

    this.fileService.destroy(product.image);
  }
}
