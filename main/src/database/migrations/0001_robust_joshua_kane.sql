ALTER TABLE "products" ALTER COLUMN "brand_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "screenSize" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "battery" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "camera" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "processor" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "os" varchar NOT NULL;