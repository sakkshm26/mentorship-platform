ALTER TABLE "mentor" ALTER COLUMN "internal_rating" SET DATA TYPE numeric(2, 1);--> statement-breakpoint
ALTER TABLE "mentor" ALTER COLUMN "internal_rating" SET DEFAULT '5.0';