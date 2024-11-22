import * as fs from "fs";
import * as path from "path";
import {
  findExactDuplicates,
  findNearDuplicates,
  findStructuralDuplicates,
  generateOutput,
} from "./duplicates";

/**
 * Recursively scans a directory and returns all JavaScript/TypeScript file paths.
 * @param dir - The directory to scan.
 * @returns An array of file paths.
 */
function scanFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...scanFiles(fullPath)); // Recursive scan for subdirectories
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".ts")) {
      files.push(fullPath);
    }
  });

  return files;
}

// Main execution
const directory = "./test"; // Change this to your test directory
if (!fs.existsSync(directory)) {
  console.error(`Directory not found: ${directory}`);
  process.exit(1);
}

const files = scanFiles(directory);
console.log("Files to process:", files);

// Find exact, near, and structural duplicates
const exactDuplicates = findExactDuplicates(files);
const nearDuplicates = findNearDuplicates(files);
const structuralDuplicates = findStructuralDuplicates(files);

// Generate and display the output
generateOutput(exactDuplicates, nearDuplicates, structuralDuplicates);
