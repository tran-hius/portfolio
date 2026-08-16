import bcrypt from "bcrypt";

export class HashUtil {
  private static readonly DEFAULT_SALT_ROUNDS = 10;

  static async hash(
    plainText: string,
    saltRounds: number = HashUtil.DEFAULT_SALT_ROUNDS,
  ): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  }

  static async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
