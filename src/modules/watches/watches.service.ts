import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_IS_NOT_EXISTS,
  USER_IS_NOT_EXISTS,
} from 'src/common/messages/exceptions';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class WatchesService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async getConnections(userId: string) {
    return await this.databaseService.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        watches: true,
      },
    });
  }

  async connect(userId: string, productId: string) {
    const user = await this.databaseService.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(USER_IS_NOT_EXISTS);
    }

    const product = await this.databaseService.product.findFirst({
      where: { id: productId },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException(PRODUCT_IS_NOT_EXISTS);
    }

    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        watches: {
          connect: {
            id: product.id,
          },
        },
      },
    });
  }

  async disconnect(userId: string, productId: string) {
    const user = await this.databaseService.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(USER_IS_NOT_EXISTS);
    }

    const product = await this.databaseService.product.findFirst({
      where: { id: productId },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new NotFoundException(PRODUCT_IS_NOT_EXISTS);
    }

    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        watches: {
          disconnect: {
            id: product.id,
          },
        },
      },
    });
  }
}
