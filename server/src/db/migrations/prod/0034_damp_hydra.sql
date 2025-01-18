ALTER TABLE "mentor" ALTER COLUMN "internal_rating" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "mentor" ALTER COLUMN "internal_rating" SET NOT NULL;