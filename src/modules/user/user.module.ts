import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CartService } from '../cart/cart.service';

@Module({
  providers: [UserService, CartService],
  exports: [UserService],
})
export class UserModule {}
