-- AlterTable: add images array to Product
ALTER TABLE "Product" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- AlterTable: make batchNumber optional on ProductBatch and drop unique constraint
ALTER TABLE "ProductBatch" ALTER COLUMN "batchNumber" DROP NOT NULL;

-- Drop old unique constraint on (productId, batchNumber) - no longer needed
DROP INDEX IF EXISTS "ProductBatch_productId_batchNumber_key";
