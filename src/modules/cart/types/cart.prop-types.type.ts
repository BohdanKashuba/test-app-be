import { Prisma } from '@prisma/client';

export type TFindByInput = Prisma.CartWhereInput;
export type TFindManyByInput = Partial<Prisma.CartWhereInput> & {
  id: Prisma.CartWhereInput['id'];
};
export type TCreateInput = {
  products: string[];
};
export type TUpdateInput = Partial<{
  products: string[];
}>;
