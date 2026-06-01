import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260601154818 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "service_enquiry" ("id" text not null, "product_id" text not null, "seller_id" text null, "customer_name" text not null, "customer_email" text not null, "message" text not null, "status" text check ("status" in ('new', 'contacted', 'closed')) not null default 'new', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_enquiry_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_service_enquiry_deleted_at" ON "service_enquiry" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "service_enquiry" cascade;`);
  }

}
