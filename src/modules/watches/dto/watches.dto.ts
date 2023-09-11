import { IsString, IsUUID } from 'class-validator';

export class WatchDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsUUID()
  productId: string;
}
