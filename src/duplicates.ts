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

/**
 * Normalizes an AST node by replacing variable names, function names, and literals with placeholders.
 * @param node - The AST node to normalize.
 * @returns The normalized AST node as a string.
 */
export function normalizeAST(node: any): string {
  function traverse(n: any) {
    if (!n || typeof n !== "object") return;

    try {
      // Replace identifiers and literals with placeholders
      if (n.type === "Identifier") {
        n.name = "placeholder";
      } else if (n.type === "Literal" || n.type === "StringLiteral") {
        n.value = "placeholder";
      } else if (n.type === "TemplateLiteral" && n.quasis) {
        n.quasis.forEach((quasi: any) => {
          quasi.value.raw = "placeholder";
          quasi.value.cooked = "placeholder";
        });
        n.expressions.forEach(traverse); // Traverse template expressions
      } else if (n.type === "BinaryExpression") {
        traverse(n.left); // Normalize left operand
        traverse(n.right); // Normalize right operand
      } else if (n.type === "MemberExpression") {
        traverse(n.object); // Normalize the object
        traverse(n.property); // Normalize the property
      } else if (n.type === "CallExpression") {
        traverse(n.callee); // Normalize the callee
        n.arguments.forEach(traverse); // Normalize arguments
      } else if (n.type === "ReturnStatement") {
        traverse(n.argument); // Normalize the return value
      } else if (n.type === "IfStatement") {
        traverse(n.test); // Normalize the condition
        traverse(n.consequent); // Normalize the 'if' body
        if (n.alternate) traverse(n.alternate); // Normalize the 'else' body
      }

      // Recursively traverse child nodes for other types
      Object.keys(n).forEach((key) => {
        if (typeof n[key] === "object") traverse(n[key]);
      });
    } catch (error) {
      console.error(
        `Error traversing node of type ${n.type}:`,
        JSON.stringify(n, null, 2)
      );
    }
  }

  try {
    const clonedNode = JSON.parse(JSON.stringify(node));
    traverse(clonedNode);
    return generate(clonedNode, { comments: false }).code;
  } catch (error) {
    console.error("Error normalizing AST node:", JSON.stringify(node, null, 2));
    return ""; // Skip the node
  }
}

/**
 * Extracts and normalizes all functions in a JavaScript/TypeScript file.
 * @param code - The file content to normalize.
 * @returns An array of normalized functions.
 */
export function normalizeFunctions(code: string): string[] {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
    const normalizedFunctions: string[] = [];

    function traverse(node: any) {
      if (!node) return;

      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression"
      ) {
        const normalizedCode = normalizeAST(node); // Normalize the function
        if (normalizedCode) {
          normalizedFunctions.push(normalizedCode);
        }
      }

      Object.keys(node).forEach((key) => {
        if (typeof node[key] === "object") traverse(node[key]);
      });
    }

    traverse(ast);

    return normalizedFunctions;
  } catch (error) {
    console.error("Error parsing or normalizing functions:", error);
    return [];
  }
}

/**
 * Finds structural duplicates by comparing normalized functions across files.
 * @param files - An array of file paths.
 * @returns An array of objects containing structurally duplicated functions and the files they appear in.
 */
export function findStructuralDuplicates(files: string[]): {
  normalizedFunction: string;
  originalFunctions: { file: string; function: string }[];
}[] {
  const normalizedHashes: {
    [hash: string]: {
      normalizedFunction: string;
      originalFunctions: { file: string; function: string }[];
    };
  } = {};

  files.forEach((file) => {
    const code = fs.readFileSync(file, "utf-8");

    // Extract and normalize functions from the file
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
    const functions = extractFunctions(ast);

    functions.forEach((originalFunction) => {
      const normalizedCode = normalizeAST(
        parse(originalFunction, { sourceType: "module" })
      );

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

  // Filter results to include only structural duplicates (more than one occurrence)
  return Object.values(normalizedHashes).filter(
    (entry) => entry.originalFunctions.length > 1
  );
}

// Generate the combined JSON output
export function generateOutput(
  exactDuplicates: { function: string; files: string[] }[],
  nearDuplicates: {
    function1: string;
    function2: string;
    similarity: number;
    files: [string, string];
  }[],
  structuralDuplicates: {
    normalizedFunction: string;
    originalFunctions: { file: string; function: string }[];
  }[]
) {
  const output = {
    exactDuplicates: exactDuplicates.map((dup) => ({
      function: dup.function.trim(),
      files: dup.files,
    })),
    nearDuplicates: nearDuplicates.map((dup) => ({
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
