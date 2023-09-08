import { Prisma } from '@prisma/client';

export type TFindByInput = Prisma.TagWhereInput;

export type TCreateInput = Prisma.TagCreateInput;

export type TUpdateInput = Partial<TCreateInput>;
