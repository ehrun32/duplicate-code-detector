import * as fs from "fs";

// Reads and returns the content of a file.
export function readFileContent(file: string): string {
  return fs.readFileSync(file, "utf-8");
}
