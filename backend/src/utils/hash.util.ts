import bcrypt from "bcrypt";

export class HashUtil {
  private static readonly DEFAULT_SALT_ROUNDS = 10;

  /**
   * Hashes a plain text password/string.
   * @param plainText The plain string to hash
   * @param saltRounds Number of salt rounds (default 10)
   * @returns The hashed string
   */
  static async hash(
    plainText: string,
    saltRounds: number = HashUtil.DEFAULT_SALT_ROUNDS,
  ): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  }

  /**
   * Compares a plain text string against a hashed string.
   * @param plainText The plain text string
   * @param hashed The hashed string to compare against
   * @returns Boolean indicating whether it matches
   */
  static async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
