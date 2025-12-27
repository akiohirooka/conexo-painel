CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."OperationType" AS ENUM ('AI_TEXT_CHAT', 'AI_IMAGE_GENERATION');

-- CreateTable
CREATE TABLE "public"."AdminSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "featureCosts" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CreditBalance" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "creditsRemaining" INTEGER NOT NULL DEFAULT 100,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "CreditBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feature" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "clerkName" TEXT,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT,
    "priceMonthlyCents" INTEGER,
    "priceYearlyCents" INTEGER,
    "description" TEXT,
    "features" JSONB,
    "badge" TEXT,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "ctaType" TEXT DEFAULT 'checkout',
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "billingSource" TEXT NOT NULL DEFAULT 'clerk',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StorageObject" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'vercel_blob',
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contentType" TEXT,
    "size" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "StorageObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubscriptionEvent" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "planKey" TEXT,
    "status" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,

    CONSTRAINT "SubscriptionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsageHistory" (
    "id" TEXT NOT NULL,
    "creditBalanceId" TEXT NOT NULL,
    "operationType" "public"."OperationType" NOT NULL,
    "creditsUsed" INTEGER NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "UsageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_categories" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "business_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_subcategories" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."businesses" (
    "id" BIGSERIAL NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "business_category_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "site_url" TEXT,
    "category" TEXT,
    "subcategory" TEXT[],
    "description" TEXT NOT NULL,
    "rating" DECIMAL(2,1) DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "cover_image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clerk_webhook_events" (
    "id" BIGSERIAL NOT NULL,
    "clerk_event_id" TEXT NOT NULL,
    "event_type" TEXT,
    "clerk_user_id" TEXT,
    "clerk_subscription_id" TEXT,
    "payload" JSONB NOT NULL,
    "processed_at" TIMESTAMPTZ(6),
    "processing_error" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clerk_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription_plans" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "billing_interval" TEXT NOT NULL DEFAULT 'monthly',
    "price_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "trial_days" INTEGER,
    "features" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_subscriptions" (
    "id" BIGSERIAL NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "plan_id" BIGINT,
    "status" TEXT NOT NULL DEFAULT 'trialing',
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trial_ends_at" TIMESTAMPTZ(6),
    "current_period_start" TIMESTAMPTZ(6),
    "current_period_end" TIMESTAMPTZ(6),
    "cancel_at" TIMESTAMPTZ(6),
    "canceled_at" TIMESTAMPTZ(6),
    "ended_at" TIMESTAMPTZ(6),
    "clerk_customer_id" TEXT,
    "clerk_subscription_id" TEXT,
    "clerk_price_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "clerk_user_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'user',
    "account_type" TEXT NOT NULL DEFAULT 'individual',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditBalance_clerkUserId_idx" ON "public"."CreditBalance"("clerkUserId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreditBalance_clerkUserId_key" ON "public"."CreditBalance"("clerkUserId" ASC);

-- CreateIndex
CREATE INDEX "CreditBalance_creditsRemaining_idx" ON "public"."CreditBalance"("creditsRemaining" ASC);

-- CreateIndex
CREATE INDEX "CreditBalance_lastSyncedAt_idx" ON "public"."CreditBalance"("lastSyncedAt" ASC);

-- CreateIndex
CREATE INDEX "CreditBalance_userId_idx" ON "public"."CreditBalance"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CreditBalance_userId_key" ON "public"."CreditBalance"("userId" ASC);

-- CreateIndex
CREATE INDEX "Feature_workspaceId_idx" ON "public"."Feature"("workspaceId" ASC);

-- CreateIndex
CREATE INDEX "Plan_active_idx" ON "public"."Plan"("active" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_clerkId_key" ON "public"."Plan"("clerkId" ASC);

-- CreateIndex
CREATE INDEX "Plan_sortOrder_idx" ON "public"."Plan"("sortOrder" ASC);

-- CreateIndex
CREATE INDEX "StorageObject_clerkUserId_idx" ON "public"."StorageObject"("clerkUserId" ASC);

-- CreateIndex
CREATE INDEX "StorageObject_contentType_idx" ON "public"."StorageObject"("contentType" ASC);

-- CreateIndex
CREATE INDEX "StorageObject_createdAt_idx" ON "public"."StorageObject"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "StorageObject_deletedAt_idx" ON "public"."StorageObject"("deletedAt" ASC);

-- CreateIndex
CREATE INDEX "StorageObject_name_idx" ON "public"."StorageObject"("name" ASC);

-- CreateIndex
CREATE INDEX "StorageObject_userId_idx" ON "public"."StorageObject"("userId" ASC);

-- CreateIndex
CREATE INDEX "SubscriptionEvent_clerkUserId_occurredAt_idx" ON "public"."SubscriptionEvent"("clerkUserId" ASC, "occurredAt" ASC);

-- CreateIndex
CREATE INDEX "SubscriptionEvent_userId_occurredAt_idx" ON "public"."SubscriptionEvent"("userId" ASC, "occurredAt" ASC);

-- CreateIndex
CREATE INDEX "UsageHistory_creditBalanceId_idx" ON "public"."UsageHistory"("creditBalanceId" ASC);

-- CreateIndex
CREATE INDEX "UsageHistory_operationType_idx" ON "public"."UsageHistory"("operationType" ASC);

-- CreateIndex
CREATE INDEX "UsageHistory_operationType_timestamp_idx" ON "public"."UsageHistory"("operationType" ASC, "timestamp" ASC);

-- CreateIndex
CREATE INDEX "UsageHistory_timestamp_idx" ON "public"."UsageHistory"("timestamp" ASC);

-- CreateIndex
CREATE INDEX "UsageHistory_userId_idx" ON "public"."UsageHistory"("userId" ASC);

-- CreateIndex
CREATE INDEX "UsageHistory_userId_timestamp_idx" ON "public"."UsageHistory"("userId" ASC, "timestamp" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "business_categories_slug_key" ON "public"."business_categories"("slug" ASC);

-- CreateIndex
CREATE INDEX "business_subcategories_category_idx" ON "public"."business_subcategories"("category_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "business_subcategories_unique" ON "public"."business_subcategories"("category_id" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "businesses_business_category_id_idx" ON "public"."businesses"("business_category_id" ASC);

-- CreateIndex
CREATE INDEX "businesses_clerk_user_id_idx" ON "public"."businesses"("clerk_user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_slug_key" ON "public"."businesses"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "clerk_webhook_events_clerk_event_id_uq" ON "public"."clerk_webhook_events"("clerk_event_id" ASC);

-- CreateIndex
CREATE INDEX "clerk_webhook_events_clerk_subscription_id_idx" ON "public"."clerk_webhook_events"("clerk_subscription_id" ASC);

-- CreateIndex
CREATE INDEX "clerk_webhook_events_clerk_user_id_idx" ON "public"."clerk_webhook_events"("clerk_user_id" ASC);

-- CreateIndex
CREATE INDEX "clerk_webhook_events_created_at_idx" ON "public"."clerk_webhook_events"("created_at" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_slug_key" ON "public"."subscription_plans"("slug" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_subscriptions_clerk_subscription_id_uq" ON "public"."user_subscriptions"("clerk_subscription_id" ASC);

-- CreateIndex
CREATE INDEX "user_subscriptions_clerk_user_id_idx" ON "public"."user_subscriptions"("clerk_user_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_user_id_key" ON "public"."users"("clerk_user_id" ASC);

-- AddForeignKey
ALTER TABLE "public"."CreditBalance" ADD CONSTRAINT "CreditBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StorageObject" ADD CONSTRAINT "StorageObject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionEvent" ADD CONSTRAINT "SubscriptionEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageHistory" ADD CONSTRAINT "UsageHistory_creditBalanceId_fkey" FOREIGN KEY ("creditBalanceId") REFERENCES "public"."CreditBalance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageHistory" ADD CONSTRAINT "UsageHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_subcategories" ADD CONSTRAINT "business_subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."business_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_business_category_id_fkey" FOREIGN KEY ("business_category_id") REFERENCES "public"."business_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "public"."users"("clerk_user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_subscriptions" ADD CONSTRAINT "user_subscriptions_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "public"."users"("clerk_user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

