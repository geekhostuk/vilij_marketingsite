import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260601153019 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "review_checklist" ("id" text not null, "subject_type" text check ("subject_type" in ('seller', 'product')) not null, "subject_id" text not null, "trust" boolean null, "authenticity" boolean null, "curation_fit" boolean null, "quality" boolean null, "notes" text null, "decision" text check ("decision" in ('approved', 'rejected', 'hold')) null, "reviewer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "review_checklist_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_review_checklist_deleted_at" ON "review_checklist" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "review_checklist" cascade;`);
  }

}
