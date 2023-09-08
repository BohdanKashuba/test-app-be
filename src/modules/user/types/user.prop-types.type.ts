import { Prisma } from '@prisma/client';

export type TFindByInput = Prisma.UserWhereInput;
export type TFindManyByInput = Prisma.UserWhereInput;
export type TCreateInput = Prisma.UserCreateInput;
export type TUpdateInput = Partial<TCreateInput>;
