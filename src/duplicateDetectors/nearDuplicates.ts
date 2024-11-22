import { parseCode } from "../utils/astUtils";
import { readFileContent } from "../utils/fileUtils";
import { extractFunctions } from "../utils/astUtils";
import { compareTwoStrings } from "string-similarity";

export function findNearDuplicates(files: string[], threshold: number = 0.8) {
  const functions: { code: string; file: string }[] = [];

  files.forEach((file) => {
    const code = readFileContent(file);
    const ast = parseCode(code);
    extractFunctions(ast).forEach((func) => {
      functions.push({ code: func.trim(), file });
    });
  });

  const nearDuplicates: {
    function1: string;
    function2: string;
    similarity: number;
    files: [string, string];
  }[] = [];

  for (let i = 0; i < functions.length; i++) {
    for (let j = i + 1; j < functions.length; j++) {
      const sim = compareTwoStrings(functions[i].code, functions[j].code);
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
