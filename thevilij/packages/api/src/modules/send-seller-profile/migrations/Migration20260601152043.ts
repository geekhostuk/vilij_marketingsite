import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260601152043 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "send_seller_profile" ("id" text not null, "vilij_stage" text check ("vilij_stage" in ('applied', 'in_review', 'approved_pending_welcome', 'onboarding', 'active', 'paused', 'rejected')) not null default 'applied', "is_founding" boolean not null default false, "founding_until" timestamptz null, "founding_warned_at" timestamptz null, "founding_commission_rate_id" text null, "is_vilij_verified" boolean not null default false, "send_connection" text null, "business_stage" text null, "why_belongs" text null, "story" text null, "links" jsonb null, "photos" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "send_seller_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_send_seller_profile_deleted_at" ON "send_seller_profile" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "send_seller_profile" cascade;`);
  }

}
