import * as fs from "fs";
import * as path from "path";

// Recursively scans a directory to find all files with the specified extensions.
export function scanDirectory(
  dir: string,
  extensions: string[] = [".js", ".ts"]
): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...scanDirectory(fullPath, extensions)); // Recurse into subdirectories
    } else if (extensions.some((ext) => fullPath.endsWith(ext))) {
      files.push(fullPath);
    }
  });

  return files;
}

// Validates if a directory exists.
export function validateDirectory(dir: string): boolean {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}
