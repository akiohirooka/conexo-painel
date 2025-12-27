-- CreateEnum
CREATE TYPE "ReviewItemType" AS ENUM ('BUSINESS', 'EVENT', 'JOB');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "clerk_user_id" VARCHAR(255) NOT NULL,
    "item_type" "ReviewItemType" NOT NULL,
    "item_id" BIGINT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" BIGSERIAL NOT NULL,
    "clerk_user_id" VARCHAR(255) NOT NULL,
    "item_type" "ReviewItemType" NOT NULL,
    "item_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notifications" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "starts_at" TIMESTAMPTZ(6),
    "ends_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_notification_users" (
    "id" BIGSERIAL NOT NULL,
    "notification_id" BIGINT NOT NULL,
    "clerk_user_id" VARCHAR(255) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_notification_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_item_idx" ON "reviews"("item_type", "item_id");

-- CreateIndex
CREATE INDEX "reviews_user_idx" ON "reviews"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_unique_user_item" ON "reviews"("clerk_user_id", "item_type", "item_id");

-- CreateIndex
CREATE INDEX "favorites_user_idx" ON "favorites"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_unique_user_item" ON "favorites"("clerk_user_id", "item_type", "item_id");

-- CreateIndex
CREATE INDEX "system_notification_users_user_idx" ON "system_notification_users"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_notification_users_unique" ON "system_notification_users"("notification_id", "clerk_user_id");

-- AddForeignKey
ALTER TABLE "system_notification_users" ADD CONSTRAINT "system_notification_users_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "system_notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
