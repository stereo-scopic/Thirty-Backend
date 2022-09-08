import { Migration } from '@mikro-orm/migrations';

export class Migration20220908124152 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "answer" drop constraint "answer_mission_id_foreign";');

    this.addSql('alter table "answer" alter column "music" type varchar(255) using ("music"::varchar(255));');
    this.addSql('alter table "answer" alter column "music" drop not null;');
    this.addSql('alter table "answer" alter column "detail" type varchar(255) using ("detail"::varchar(255));');
    this.addSql('alter table "answer" alter column "detail" drop not null;');
    this.addSql('alter table "answer" alter column "image" type varchar(255) using ("image"::varchar(255));');
    this.addSql('alter table "answer" alter column "image" drop not null;');
    this.addSql('alter table "answer" alter column "stamp" type int using ("stamp"::int);');
    this.addSql('alter table "answer" rename column "mission_id" to "date";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "answer" alter column "music" type varchar(255) using ("music"::varchar(255));');
    this.addSql('alter table "answer" alter column "music" set not null;');
    this.addSql('alter table "answer" alter column "detail" type varchar(255) using ("detail"::varchar(255));');
    this.addSql('alter table "answer" alter column "detail" set not null;');
    this.addSql('alter table "answer" alter column "image" type varchar(255) using ("image"::varchar(255));');
    this.addSql('alter table "answer" alter column "image" set not null;');
    this.addSql('alter table "answer" alter column "stamp" type varchar(255) using ("stamp"::varchar(255));');
    this.addSql('alter table "answer" rename column "date" to "mission_id";');
    this.addSql('alter table "answer" add constraint "answer_mission_id_foreign" foreign key ("mission_id") references "mission" ("id") on update cascade;');
  }

}
