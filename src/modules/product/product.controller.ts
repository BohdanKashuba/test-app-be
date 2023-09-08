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
import { getSearchFilters } from 'src/common/functions/getSeatchFilters';
import { IMAGE_IS_REQUIRED } from 'src/common/messages/exceptions';
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
      name: {
        type: 'string',
        value: qs?.name?.toString(),
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
    });

    return await this.productService.findManyBy(
      {
        name: {
          contains: filter.name,
        },
        rate: {
          gte: filter.rate,
        },
        price: {
          gte: filter.price.start,
          lte: filter.price.end,
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

    return await this.productService.create({ ...dto, image: file });
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

    return await this.productService.update(id, {
      ...dto,
      image: file,
      rate,
    });
  }

  @Delete(':id')
  async deleteProductHandler(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.delete(id);
  }
}
