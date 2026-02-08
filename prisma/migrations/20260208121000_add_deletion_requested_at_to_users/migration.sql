ALTER TABLE "public"."users"
  ADD COLUMN IF NOT EXISTS "deletion_requested_at" TIMESTAMPTZ(6);
