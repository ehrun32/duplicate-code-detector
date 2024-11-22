import { scanFiles } from "./scanner";
import { findExactDuplicates, printJsonOutput } from "./duplicates";

const directory = "./test"; // Test directory
const files = scanFiles(directory); // Scan for files
const duplicates = findExactDuplicates(files); // Find duplicates
printJsonOutput(duplicates); // Print results in JSON format
