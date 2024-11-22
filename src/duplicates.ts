import * as fs from "fs";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as crypto from "crypto";

/**
 * Hashes a given string using SHA256.
 * @param content - The string to hash.
 * @returns The hash of the string.
 */
export function hashCode(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Extracts function-level code blocks from an Abstract Syntax Tree (AST).
 * @param ast - The AST of the code.
 * @returns An array of code blocks as strings.
 */
export function extractFunctions(ast: any): string[] {
  const functions: string[] = [];

  function traverse(node: any) {
    if (!node) return;

    // Check for function-like nodes
    if (
      node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression"
    ) {
      functions.push(nodeToString(node)); // Convert function to string
    }

    // Recursively traverse child nodes
    Object.keys(node).forEach((key) => {
      if (typeof node[key] === "object") {
        traverse(node[key]);
      }
    });
  }

  traverse(ast);
  return functions;
}

/**
 * Converts an AST node back into a JavaScript code string.
 * @param node - The AST node to convert.
 * @returns The string representation of the code.
 */
export function nodeToString(node: any): string {
  return generate(node).code;
}

/**
 * Finds exact duplicate functions across multiple files.
 * @param files - An array of file paths.
 * @returns An array of objects containing duplicated functions and the files they appear in.
 */
export function findExactDuplicates(
  files: string[]
): { function: string; files: string[] }[] {
  const hashes: { [hash: string]: { code: string; files: string[] } } = {};

  files.forEach((file) => {
    const code = fs.readFileSync(file, "utf-8");

    // Parse the file into an AST
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    // Extract functions or blocks
    extractFunctions(ast).forEach((func) => {
      const funcCode = func.trim(); // Clean up the function code
      const hash = hashCode(funcCode); // Hash the function code

      if (!hashes[hash]) {
        hashes[hash] = { code: funcCode, files: [] };
      }
      if (!hashes[hash].files.includes(file)) {
        hashes[hash].files.push(file);
      }
    });
  });

  // Filter and format output for readability
  return Object.values(hashes)
    .filter((entry) => entry.files.length > 1) // Only include duplicates
    .map((entry) => ({ function: entry.code, files: entry.files }));
}

/**
 * Prints duplicate functions in JSON format.
 * @param duplicates - An array of objects containing duplicated functions and their files.
 */
export function printJsonOutput(
  duplicates: { function: string; files: string[] }[]
): void {
  const output = {
    exactDuplicates: duplicates.map((duplicate) => ({
      function: duplicate.function.trim(), // Clean up the function code
      files: duplicate.files,
    })),
  };

  console.log(JSON.stringify(output, null, 2)); // Pretty print JSON
}
