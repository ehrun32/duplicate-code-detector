import * as fs from "fs";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import { compareTwoStrings } from "string-similarity";

// Hash function for exact duplicates
export function hashCode(content: string): string {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(content).digest("hex");
}

// Extract function blocks from AST
export function extractFunctions(ast: any): string[] {
  const functions: string[] = [];

  function traverse(node: any) {
    if (!node) return;

    if (
      node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression"
    ) {
      functions.push(nodeToString(node)); // Convert function to string
    }

    Object.keys(node).forEach((key) => {
      if (typeof node[key] === "object") traverse(node[key]);
    });
  }

  traverse(ast);
  return functions;
}

// Convert AST node to string
export function nodeToString(node: any): string {
  return generate(node, { comments: false }).code; // Strip comments
}

// Find exact duplicates
export function findExactDuplicates(
  files: string[]
): { function: string; files: string[] }[] {
  const hashes: { [hash: string]: { code: string; files: string[] } } = {};

  files.forEach((file) => {
    const code = fs.readFileSync(file, "utf-8");
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

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

// Find near duplicates
export function findNearDuplicates(
  files: string[],
  threshold: number = 0.8
): {
  function1: string;
  function2: string;
  similarity: number;
  files: [string, string];
}[] {
  const functions: { code: string; file: string }[] = [];

  files.forEach((file) => {
    const code = fs.readFileSync(file, "utf-8");
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
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

// Generate the combined JSON output
export function generateOutput(
  exactDuplicates: { function: string; files: string[] }[],
  nearDuplicates: {
    function1: string;
    function2: string;
    similarity: number;
    files: [string, string];
  }[]
) {
  // Extract exact duplicate functions for comparison
  const exactFunctions = exactDuplicates.map((dup) => dup.function.trim());

  // Filter out near-duplicates with similarity of 1
  const filteredNearDuplicates = nearDuplicates.filter(
    (dup) =>
      dup.similarity < 1 || // Allow only near-duplicates with similarity < 1
      !(
        exactFunctions.includes(dup.function1.trim()) &&
        exactFunctions.includes(dup.function2.trim())
      )
  );

  // Create the final output
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
  };

  console.log(JSON.stringify(output, null, 2));
}
