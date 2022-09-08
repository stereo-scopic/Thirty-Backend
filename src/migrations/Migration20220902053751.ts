import { Migration } from '@mikro-orm/migrations';

export class Migration20220902053751 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "type" to "role";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" rename column "role" to "type";');
  }

}
