import { findExactDuplicates } from "./duplicateDetectors/exactDuplicates";
import { findNearDuplicates } from "./duplicateDetectors/nearDuplicates";
import { findStructuralDuplicates } from "./duplicateDetectors/structuralDuplicates";
import { scanDirectory, validateDirectory } from "./utils/scanUtils";

/**
 * Combines duplicate detection results and outputs a JSON summary.
 */
function main() {
  const directory = "./test"; // Change to your test directory

  if (!validateDirectory(directory)) {
    console.error(`Invalid directory: ${directory}`);
    process.exit(1);
  }

  const files = scanDirectory(directory);
  console.log("Files to process:", files);

  // Run all duplicate detectors
  const exactDuplicates = findExactDuplicates(files);
  const nearDuplicates = findNearDuplicates(files);
  const structuralDuplicates = findStructuralDuplicates(files);
  // Filter out near-duplicates with similarity of 1
  const filteredNearDuplicates = nearDuplicates.filter(
    (dup) => dup.similarity < 1
  );

  // Generate the final JSON output
  const output = {
    exactDuplicates: exactDuplicates.map((dup) => ({
      function: dup.function.trim(),
      files: dup.files,
    })),
    nearDuplicates: filteredNearDuplicates.map((dup) => ({
      function1: dup.function1.trim(),
      function2: dup.function2.trim(),
      similarity: dup.similarity,
      files: dup.files,
    })),
    structuralDuplicates: structuralDuplicates.map((dup) => ({
      normalizedFunction: dup.normalizedFunction.trim(),
      originalFunctions: dup.originalFunctions.map((original) => ({
        file: original.file,
        function: original.function.trim(),
      })),
    })),
  };

  console.log(JSON.stringify(output, null, 2));
}

main();
