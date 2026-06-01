import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260601154814 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "digital_product" ("id" text not null, "name" text not null, "file_url" text not null, "mime_type" text null, "license_key" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_product_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_product_deleted_at" ON "digital_product" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "digital_product_delivery" ("id" text not null, "token" text not null, "digital_product_id" text not null, "order_id" text null, "email" text null, "expires_at" timestamptz null, "download_count" integer not null default 0, "max_downloads" integer not null default 5, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_product_delivery_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_product_delivery_deleted_at" ON "digital_product_delivery" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "digital_product" cascade;`);

    this.addSql(`drop table if exists "digital_product_delivery" cascade;`);
  }

}
