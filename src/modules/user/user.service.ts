import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import {
  TCreateInput,
  TFindByInput,
  TFindManyByInput,
  TUpdateInput,
} from './types/user.prop-types.type';
import { userWatchesSelection } from '../../common/selections/user.selection';

@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async findBy(where: TFindByInput) {
    return await this.databaseService.user.findFirst({
      where,
      select: userWatchesSelection,
    });
  }

  async findManyBy(where?: TFindManyByInput) {
    return await this.databaseService.user.findMany({
      where,
      select: userWatchesSelection,
    });
  }

  async create(data: TCreateInput) {
    const watches = await this.databaseService.product.findMany({
      where: { id: { in: data.watches } },
    });

    const d = data as Omit<TCreateInput, 'cartId'>;

    return await this.databaseService.user.create({
      data: {
        ...d,
        watches: { connect: watches },
        cart: { create: { products: { connect: [] }, totalPrice: 0 } },
      },
      select: userWatchesSelection,
    });
  }

  async update(id: string, data: TUpdateInput) {
    const watches = await this.databaseService.product.findMany({
      where: { id: { in: data.watches } },
    });

    const cart = await this.databaseService.cart.findFirst({
      where: { id: data.cartId },
    });

    delete data.cartId;

    const d = data as Omit<TUpdateInput, 'cartId'>;

    return await this.databaseService.user.update({
      data: {
        ...d,
        watches: { connect: watches },
        cart: { connect: cart },
      },
      where: { id },
      select: userWatchesSelection,
    });
  }

  async delete(id: string) {
    await this.databaseService.user.delete({ where: { id } });
  }
}
