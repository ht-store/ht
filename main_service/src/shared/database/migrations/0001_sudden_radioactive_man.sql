ALTER TYPE "product_serial_status" ADD VALUE 'block';--> statement-breakpoint
ALTER TABLE "import_order_items" DROP CONSTRAINT "import_order_items_product_id_skus_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_import_order_items_product_id";--> statement-breakpoint
ALTER TABLE "import_order_items" ALTER COLUMN "import_order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "import_order_items" ADD COLUMN "sku_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "serial_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "import_order_items" ADD CONSTRAINT "import_order_items_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_serial_id_serial_numbers_id_fk" FOREIGN KEY ("serial_id") REFERENCES "public"."serial_numbers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_import_order_items_product_id" ON "import_order_items" USING btree ("sku_id");--> statement-breakpoint
ALTER TABLE "import_order_items" DROP COLUMN IF EXISTS "product_id";