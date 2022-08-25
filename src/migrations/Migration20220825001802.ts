import { Migration } from '@mikro-orm/migrations';

export class Migration20220825001802 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "mission" ("id" serial primary key, "challenge_id" int not null, "date" int not null, "detail" varchar(255) not null);');

    this.addSql('create table "bucket_challenge" ("bucket_id" varchar(255) not null, "challenge_id" int not null, constraint "bucket_challenge_pkey" primary key ("bucket_id", "challenge_id"));');

    this.addSql('alter table "mission" add constraint "mission_challenge_id_foreign" foreign key ("challenge_id") references "challenge" ("id") on update cascade;');

    this.addSql('alter table "bucket_challenge" add constraint "bucket_challenge_bucket_id_foreign" foreign key ("bucket_id") references "bucket" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "bucket_challenge" add constraint "bucket_challenge_challenge_id_foreign" foreign key ("challenge_id") references "challenge" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "bucket" drop constraint "bucket_challenge_id_foreign";');

    this.addSql('alter table "bucket" drop column "challenge_id";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "mission" cascade;');

    this.addSql('drop table if exists "bucket_challenge" cascade;');

    this.addSql('alter table "bucket" add column "challenge_id" int4 not null default null;');
    this.addSql('alter table "bucket" add constraint "bucket_challenge_id_foreign" foreign key ("challenge_id") references "challenge" ("id") on update cascade on delete no action;');
  }

}
