import { parseCode, normalizeAST, extractFunctions } from "../utils/astUtils";
import { readFileContent } from "../utils/fileUtils";
import { hashCode } from "../utils/hashUtils";

export function findStructuralDuplicates(files: string[]) {
  const normalizedHashes: {
    [hash: string]: {
      normalizedFunction: string;
      originalFunctions: { file: string; function: string }[];
    };
  } = {};

  files.forEach((file) => {
    const code = readFileContent(file);
    const ast = parseCode(code);
    const functions = extractFunctions(ast);

    functions.forEach((originalFunction) => {
      const normalizedCode = normalizeAST(parseCode(originalFunction));
      if (!normalizedCode) {
        console.error(`Failed to normalize function: ${originalFunction}`);
        return;
      }

      const hash = hashCode(normalizedCode);

      if (!normalizedHashes[hash]) {
        normalizedHashes[hash] = {
          normalizedFunction: normalizedCode,
          originalFunctions: [],
        };
      }
      normalizedHashes[hash].originalFunctions.push({
        file,
        function: originalFunction,
      });
    });
  });

  return Object.values(normalizedHashes).filter(
    (entry) => entry.originalFunctions.length > 1
  );
}
