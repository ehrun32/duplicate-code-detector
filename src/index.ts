import { findExactDuplicates } from "./duplicateDetectors/exactDuplicates";
import { findNearDuplicates } from "./duplicateDetectors/nearDuplicates";
import { findStructuralDuplicates } from "./duplicateDetectors/structuralDuplicates";
import { scanDirectory, validateDirectory } from "./utils/scanUtils";
import inquirer from "inquirer";

/**
 * Combines duplicate detection results and outputs a JSON summary.
 */
async function main() {
  // Prompt the user to enter the directory
  const { directory } = await inquirer.prompt([
    {
      type: "input",
      name: "directory",
      message: "Enter the directory to scan:",
      default: "./test/TestingFilesEndingWithTSX", // Default value
    },
  ]);

  if (!validateDirectory(directory)) {
    console.error(`Invalid directory: ${directory}`);
    process.exit(1);
  }

  // Prompt the user to choose the type of duplicate detection
  const { detectionType } = await inquirer.prompt([
    {
      type: "list",
      name: "detectionType",
      message: "Choose the type of duplicate detection:",
      choices: ["Exact", "Near", "Structural"],
    },
  ]);

  // Scan for JavaScript, TypeScript, JSX, and TSX files
  const files = scanDirectory(directory, [".js", ".ts", ".jsx", ".tsx"]);
  console.log("Files to process:", files);

  let output: any;

  // Use a switch-case to process the selected detection type
  switch (detectionType) {
    case "Exact":
      const exactDuplicates = findExactDuplicates(files);
      output = {
        exactDuplicates: exactDuplicates.map((dup) => ({
          function: dup.function.trim(),
          files: dup.files,
        })),
      };
      break;

    case "Near":
      const nearDuplicates = findNearDuplicates(files);
      const filteredNearDuplicates = nearDuplicates.filter(
        (dup) => dup.similarity < 1
      );
      output = {
        nearDuplicates: filteredNearDuplicates.map((dup) => ({
          function1: dup.function1.trim(),
          function2: dup.function2.trim(),
          similarity: dup.similarity,
          files: dup.files,
        })),
      };
      break;

    case "Structural":
      const structuralDuplicates = findStructuralDuplicates(files);
      output = {
        structuralDuplicates: structuralDuplicates.map((dup) => ({
          normalizedFunction: dup.normalizedFunction.trim(),
          originalFunctions: dup.originalFunctions.map((original) => ({
            file: original.file,
            function: original.function.trim(),
          })),
        })),
      };
      break;

    default:
      console.error("Invalid choice.");
      process.exit(1);
  }

  // Output the results in JSON format
  console.log(JSON.stringify(output, null, 2));
}

main();
