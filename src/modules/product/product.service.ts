import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import {
  TCreateInput,
  TFindByInput,
  TFindManyByInput,
  TOrderBy,
  TUpdateInput,
} from './types/product.prop-types.type';
import { FileService } from '../../shared/file/file.service';

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
    const image = await this.fileService.upload(data.image);

    const creationData = {
      ...data,
      rate: 0,
      tags: data?.tags.map((t) => ({ id: t })) ?? [],
    };

    return await this.databaseService.product.create({
      data: {
        ...creationData,
        tags: { connect: creationData.tags },
        image: { connect: { id: image } },
      },
    });
  }

  async update(id: string, data: TUpdateInput) {
    const oldProduct = await this.databaseService.product.findFirst({
      where: { id },
    });

    let image: string;

    if (data.image) {
      image = await this.fileService.upload(data.image);
    }

    const uploadData = {
      ...data,
      tags: data?.tags?.map((t) => ({ id: t })),
    };

    const product = await this.databaseService.product
      .update({
        data: {
          ...uploadData,
          tags: { set: uploadData.tags },
          image: { update: { id: image } },
        },
        where: { id },
      })
      .catch(() => {
        this.fileService.destroy(image);

        throw new InternalServerErrorException();
      });

    if (image && oldProduct.imageId) {
      this.fileService.destroy(oldProduct.imageId);
    }

    return product;
  }

  async delete(id: string) {
    const product = await this.databaseService.product.delete({
      where: { id },
    });

    this.fileService.destroy(product.imageId);
  }

  async receiveFilters() {
    const maxPrice = await this.databaseService.product.aggregate({
      _max: {
        price: true,
      },
    });

    const minPrice = await this.databaseService.product.aggregate({
      _min: {
        price: true,
      },
    });

    return {
      price: {
        max: maxPrice._max.price,
        min: minPrice._min.price,
      },
    };
  }
}
