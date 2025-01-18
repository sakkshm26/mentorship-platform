ALTER TABLE "user" ADD CONSTRAINT "user_table_fk_user_mentor_unique" UNIQUE ("fk_user_mentor"), ADD CONSTRAINT "user_table_fk_user_mentee_unique" UNIQUE ("fk_user_mentee");

ALTER TABLE "mentee" ADD CONSTRAINT "mentee_table_fk_mentee_user_unique" UNIQUE ("fk_mentee_user");

ALTER TABLE "mentor" ADD CONSTRAINT "mentor_table_fk_mentor_user_unique" UNIQUE ("fk_mentor_user");