/*
  Warnings:

  - You are about to drop the `PageStyle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PageStyle" DROP CONSTRAINT "PageStyle_pageId_fkey";

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "pageStyle" JSONB;

-- DropTable
DROP TABLE "PageStyle";
