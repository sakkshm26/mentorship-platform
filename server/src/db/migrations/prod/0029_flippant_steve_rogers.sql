ALTER TABLE "mentee_domain_map" ALTER COLUMN "domain" TYPE TEXT;
ALTER TABLE "mentee_domain_map" ALTER COLUMN "domain" SET DATA TYPE domain USING (domain::domain);