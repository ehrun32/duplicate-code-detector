import { scanFiles } from "./scanner";
import {
  findExactDuplicates,
  findNearDuplicates,
  generateOutput,
} from "./duplicates";

const directory = "./test";
const files = scanFiles(directory);

const exactDuplicates = findExactDuplicates(files); // Detect exact duplicates
const nearDuplicates = findNearDuplicates(files); // Detect near duplicates

generateOutput(exactDuplicates, nearDuplicates); // Print combined output
