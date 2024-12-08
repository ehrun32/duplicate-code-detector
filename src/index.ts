import { findExactDuplicates } from "./duplicateDetectors/exactDuplicates";
import { findNearDuplicates } from "./duplicateDetectors/nearDuplicates";
import { findStructuralDuplicates } from "./duplicateDetectors/structuralDuplicates";
import { scanDirectory, validateDirectory } from "./utils/scanUtils";
import inquirer from "inquirer";
import fs from "fs";

/**
 * Saves the output to a specified file in JSON format.
 */
function saveToFile(filename: string, data: any): void {
  const formattedData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filename, formattedData, "utf8");
  console.log(`Saved results to ${filename}`);
}

/**
 * Main function for duplicate detection and saving results.
 */
async function main() {
  // Prompt the user to enter the directory
  const { directory } = await inquirer.prompt([
    {
      type: "input",
      name: "directory",
      message: "Enter the directory to scan:",
      default: "./test/TestingFilesEndingWithJS", // Default value
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

  // Ask the user if they want to save the results to files
  const { saveResults } = await inquirer.prompt([
    {
      type: "confirm",
      name: "saveResults",
      message: "Do you want to save the results to text files?",
      default: true,
    },
  ]);

  if (saveResults) {
    switch (detectionType) {
      case "Exact":
        saveToFile("exact.txt", output);
        break;
      case "Near":
        saveToFile("near.txt", output);
        break;
      case "Structural":
        saveToFile("structural.txt", output);
        break;
    }
  }
}

main();
