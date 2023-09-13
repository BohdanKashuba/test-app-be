import { DatabaseService } from 'src/shared/database/database.service';
import {
  TCreateInput,
  TFindByInput,
  TFindManyByInput,
  TUpdateInput,
} from './types/cart.prop-types.type';
import { cartProductsSelection } from 'src/common/selections/cart.selection';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async findManyBy(where?: TFindManyByInput) {
    return await this.databaseService.cart.findMany({
      where,
      select: cartProductsSelection,
    });
  }
  async findBy(where: TFindByInput) {
    return await this.databaseService.cart.findFirst({
      where,
      select: cartProductsSelection,
    });
  }
  async create(data: TCreateInput) {
    const products = await this.databaseService.product.findMany({
      where: { id: { in: data.products } },
    });

    const totalPrice = products.reduce(
      (acc, p) => (acc += p.price.toNumber()),
      0,
    );

    return await this.databaseService.cart.create({
      data: { products: { connect: products }, totalPrice },
      select: cartProductsSelection,
    });
  }
  async update(id: string, data: TUpdateInput) {
    const products = await this.databaseService.product.findMany({
      where: { id: { in: data.products } },
    });

    const totalPrice = products.reduce(
      (acc, p) => (acc += p.price.toNumber()),
      0,
    );

    return await this.databaseService.cart.update({
      where: { id },
      data: {
        products: {
          set: products,
        },
        totalPrice,
      },
      select: cartProductsSelection,
    });
  }

  async delete(id: string) {
    await this.databaseService.cart.delete({ where: { id } });
  }
}
