import * as fs from "fs";
import * as path from "path";
import { normalizeFunction } from "./normalize";

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

/**
 * Normalizes all functions in the given file and logs the results.
 * @param file - The file to process.
 */
function testNormalizeFile(file: string) {
  try {
    const code = fs.readFileSync(file, "utf-8");
    console.log(`\nProcessing File: ${file}`);
    const normalizedFunction = normalizeFunction(code);
    if (normalizedFunction) {
      console.log("Normalized Code:");
      console.log(normalizedFunction);
    } else {
      console.log("No functions found or normalization failed.");
    }
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
  }
}

// Main execution
const directory = "./test"; // Change this to your test directory
if (!fs.existsSync(directory)) {
  console.error(`Directory not found: ${directory}`);
  process.exit(1);
}

const files = scanFiles(directory);
console.log("Files to process:", files);

files.forEach(testNormalizeFile);
