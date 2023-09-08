import { Prisma } from '@prisma/client';

export type TFindByInput = Partial<Prisma.ProductWhereInput> & {
  id: Prisma.ProductWhereInput['id'];
};

export type TFindManyByInput = Prisma.ProductWhereInput;

export type TOrderBy = Prisma.ProductOrderByWithRelationInput;

export type TCreateInput = Omit<Prisma.ProductCreateInput, 'image' | 'rate'> & {
  image?: Express.Multer.File;
} & { tags?: string[] };

export type TUpdateInput = Omit<Prisma.ProductUpdateInput, 'image'> & {
  image?: Express.Multer.File;
} & { tags?: string[] };
