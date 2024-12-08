import { parseCode } from "../utils/astUtils";
import { readFileContent } from "../utils/fileUtils";
import { extractFunctions } from "../utils/astUtils";
import { compareTwoStrings } from "string-similarity";
import crypto from "crypto";

function normalizeFunctionCode(code: string): string {
  return code
    .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "") // Remove comments
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

export function findNearDuplicates(files: string[], threshold: number = 0.8) {
  const functions: { code: string; hash: string; file: string }[] = [];

  // Step 1: Extract functions and hash them
  files.forEach((file) => {
    const code = readFileContent(file);
    const ast = parseCode(code);
    extractFunctions(ast).forEach((func) => {
      const normalizedFunc = normalizeFunctionCode(func);
      const hash = crypto
        .createHash("md5")
        .update(normalizedFunc)
        .digest("hex");
      functions.push({ code: normalizedFunc, hash, file });
    });
  });

  const nearDuplicates: {
    function1: string;
    function2: string;
    similarity: number;
    files: [string, string];
  }[] = [];

  // Step 2: Compare functions
  for (let i = 0; i < functions.length; i++) {
    for (let j = i + 1; j < functions.length; j++) {
      const sim = compareTwoStrings(functions[i].code, functions[j].code);
      // console.log(
      //   `Comparing:\nFunction 1: ${functions[i].code}\nFunction 2: ${functions[j].code}\nSimilarity: ${sim}`
      // );
      if (sim >= threshold) {
        nearDuplicates.push({
          function1: functions[i].code,
          function2: functions[j].code,
          similarity: sim,
          files: [functions[i].file, functions[j].file],
        });
      }
    }
  }

  return nearDuplicates;
}
