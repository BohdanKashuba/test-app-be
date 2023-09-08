-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_id_key" ON "Tag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "_ProductToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
