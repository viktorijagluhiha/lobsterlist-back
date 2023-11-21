-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "priceFrom" DECIMAL(10,2) NOT NULL,
    "priceTo" DECIMAL(10,2),
    "priority" SERIAL NOT NULL,
    "ticked" BOOLEAN NOT NULL DEFAULT false,
    "tickedAt" TIMESTAMP(3),
    "tickedBy" VARCHAR(10),

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemLink" (
    "id" SERIAL NOT NULL,
    "href" TEXT NOT NULL,
    "description" TEXT,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "ItemLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Item_priority_idx" ON "Item"("priority");

-- CreateIndex
CREATE INDEX "Item_title_idx" ON "Item"("title");

-- CreateIndex
CREATE INDEX "Item_priceFrom_idx" ON "Item"("priceFrom");

-- CreateIndex
CREATE INDEX "ItemLink_itemId_idx" ON "ItemLink"("itemId");

-- AddForeignKey
ALTER TABLE "ItemLink" ADD CONSTRAINT "ItemLink_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
