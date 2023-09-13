import { Prisma } from '@prisma/client';

export type TFindByInput = Prisma.UserWhereInput;
export type TFindManyByInput = Prisma.UserWhereInput;
export type TCreateInput = Omit<Prisma.UserCreateInput, 'watches' | 'cart'> & {
  watches: string[];
};
export type TUpdateInput = Partial<TCreateInput & { cartId: string }>;
