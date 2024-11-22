import { parseCode } from "../utils/astUtils";
import { readFileContent } from "../utils/fileUtils";
import { hashCode } from "../utils/hashUtils";
import { extractFunctions } from "../utils/astUtils";

export function findExactDuplicates(files: string[]) {
  const hashes: { [hash: string]: { code: string; files: string[] } } = {};

  files.forEach((file) => {
    const code = readFileContent(file);
    const ast = parseCode(code);

    extractFunctions(ast).forEach((func) => {
      const funcCode = func.trim();
      const hash = hashCode(funcCode);

      if (!hashes[hash]) {
        hashes[hash] = { code: funcCode, files: [] };
      }
      if (!hashes[hash].files.includes(file)) {
        hashes[hash].files.push(file);
      }
    });
  });

  return Object.values(hashes)
    .filter((entry) => entry.files.length > 1)
    .map((entry) => ({ function: entry.code, files: entry.files }));
}
