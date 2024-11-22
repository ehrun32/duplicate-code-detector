// src/scanner.ts
import * as fs from "fs";
import * as path from "path";

export function scanFiles(directory: string): string[] {
  const results: string[] = [];
  function readDir(dir: string) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        readDir(fullPath);
      } else if (/\.(js|ts|jsx|tsx)$/.test(item)) {
        results.push(fullPath);
      }
    });
  }
  readDir(directory);
  return results;
}
