import * as crypto from "crypto";

// Hashes a given string using SHA256.
export function hashCode(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}
