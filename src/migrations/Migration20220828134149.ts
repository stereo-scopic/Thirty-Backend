import { Migration } from '@mikro-orm/migrations';

export class Migration20220828134149 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "deleted_at" timestamptz(0) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "deleted_at";');
  }

}
