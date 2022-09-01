import * as bcrypt from 'bcrypt';

const SALT_ROUND = 10;

export class crypt {
  static async getHashedValue(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUND);
    return bcrypt.hash(value, salt);
  }

  static async isEqualToHashed(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}
