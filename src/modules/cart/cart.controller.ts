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
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('cart')
export class CartController {
  constructor(@Inject(CartService) private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AdminGuard)
  async getCartsHandler() {
    return await this.cartService.findManyBy();
  }

  @Get(':id')
  async getCartHandler(@Param('id', ParseUUIDPipe) id: string) {
    return await this.cartService.findBy({ id });
  }

  @Post()
  @UseGuards(AdminGuard)
  async createCartHandler(@Body() dto) {
    return await this.cartService.create(dto);
  }

  @Put(':id')
  async updateCartHandler(@Param('id', ParseUUIDPipe) id: string, @Body() dto) {
    return await this.cartService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteCart(@Param('id', ParseUUIDPipe) id: string) {
    await this.cartService.delete(id);
  }
}
