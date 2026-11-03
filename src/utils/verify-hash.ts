import { compare } from "bcrypt-ts";

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Returns true if match, false otherwise
  const isMatch = await compare(password, hash);
  return isMatch;
}
