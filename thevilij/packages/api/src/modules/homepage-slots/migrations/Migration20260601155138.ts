import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260601155138 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "homepage_slot" ("id" text not null, "slot_key" text check ("slot_key" in ('start_shopping', 'seller_spotlight', 'new_this_week', 'community_favourites', 'vilij_own_brand', 'behind_the_business')) not null, "title" text not null, "subtitle" text null, "body" text null, "cta_label" text null, "cta_href" text null, "media_url" text null, "target_type" text check ("target_type" in ('collection', 'category', 'seller', 'product', 'url')) null, "target_id" text null, "position" integer not null default 0, "is_published" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "homepage_slot_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_homepage_slot_deleted_at" ON "homepage_slot" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "homepage_slot" cascade;`);
  }

}
