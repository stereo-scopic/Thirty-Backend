import { Migration } from '@mikro-orm/migrations';

export class Migration20220908111532 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "stamp" ("id" serial primary key, "created_at" timestamptz(0) not null default current_timestamp, "updated_at" timestamptz(0) not null default current_timestamp, "detail" varchar(255) not null, "illust" varchar(255) null);');

    this.addSql('create table "answer" ("id" serial primary key, "created_at" timestamptz(0) not null default current_timestamp, "updated_at" timestamptz(0) not null default current_timestamp, "bucket_id" varchar(255) not null, "music" varchar(255) not null, "mission_id" int not null, "detail" varchar(255) not null, "image" varchar(255) not null, "stamp" varchar(255) not null);');

    this.addSql('alter table "answer" add constraint "answer_bucket_id_foreign" foreign key ("bucket_id") references "bucket" ("id") on update cascade;');
    this.addSql('alter table "answer" add constraint "answer_mission_id_foreign" foreign key ("mission_id") references "mission" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "stamp" cascade;');

    this.addSql('drop table if exists "answer" cascade;');
  }

}
