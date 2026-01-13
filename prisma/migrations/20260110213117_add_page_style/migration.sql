-- CreateTable
CREATE TABLE "PageStyle" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "background" TEXT NOT NULL DEFAULT '#6366f1',
    "btnColor" TEXT NOT NULL DEFAULT '#8b5cf6',
    "textBtnColor" TEXT NOT NULL DEFAULT '#ffffff',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PageStyle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageStyle_pageId_key" ON "PageStyle" ("pageId");

-- AddForeignKey
ALTER TABLE "PageStyle"
ADD CONSTRAINT "PageStyle_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE;