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
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { Request } from 'express';
import { getSearchFilters } from '../../common/functions/getSeatchFilters';
import { IMAGE_IS_REQUIRED } from '../../common/messages/exceptions';
import { getByOrder } from './functions/getByOrder';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductService) private readonly productService: ProductService,
  ) {}

  @Get()
  async getProductsBy(@Req() req: Request) {
    const qs = req.query;

    const filter = getSearchFilters({
      keywords: {
        type: 'string',
        value: qs?.keywords?.toString(),
      },
      rate: {
        type: 'number',
        value: qs?.rate?.toString(),
      },
      price: {
        start: {
          type: 'number',
          value: qs?.priceStart?.toString(),
        },
        end: {
          type: 'number',
          value: qs?.priceEnd?.toString(),
        },
      },
      sort: {
        type: 'string',
        value: qs?.sortBy?.toString(),
      },
      tags: {
        type: 'array',
        value: qs?.tags?.toString().length ? qs?.tags?.toString() : undefined,
      },
    });

    return await this.productService.findManyBy(
      {
        name: {
          contains: filter.keywords,
          mode: 'insensitive',
        },
        rate: {
          gte: filter.rate,
        },
        price: {
          gte: filter.price.start,
          lte: filter.price.end,
        },
        tags: {
          some: {
            id: {
              in: filter.tags,
            },
          },
        },
      },
      getByOrder(filter.sort),
    );
  }

  @Get(':id')
  async getProductByIdHandler(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.findBy({ id });
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProductHandler(
    @Body() dto: ProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new UnprocessableEntityException(IMAGE_IS_REQUIRED);
    }

    const tags = JSON.parse(dto?.tags ?? null);

    return await this.productService.create({
      ...dto,
      image: file,
      tags: tags as string[] | undefined,
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProductHandler(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const rate = dto.rate ? parseFloat(dto.rate) : undefined;

    if (isNaN(rate) && dto.rate) {
      throw new UnprocessableEntityException();
    }

    const tags = JSON.parse(dto?.tags ?? null);

    return await this.productService.update(id, {
      ...dto,
      image: file,
      rate,
      tags: tags as string[] | undefined,
    });
  }

  @Delete(':id')
  async deleteProductHandler(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.delete(id);
  }
}
