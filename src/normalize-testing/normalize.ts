import { parse } from "@babel/parser";
import generate from "@babel/generator";

// Normalizes an AST node by replacing variable names, function names, and literals with placeholders.
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
    // Clone the node to avoid mutating the original AST
    const clonedNode = JSON.parse(JSON.stringify(node));
    traverse(clonedNode);
    return generate(clonedNode, { comments: false }).code;
  } catch (error) {
    console.error("Error normalizing AST node:", JSON.stringify(node, null, 2));
    return ""; // Skip the node
  }
}

// Normalizes all functions in a JavaScript/TypeScript file
export function normalizeFunctions(code: string): string[] {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
    const normalizedFunctions: string[] = [];

    // Traverse the AST to find functions
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

    return normalizedFunctions; // Return all normalized functions
  } catch (error) {
    console.error("Error parsing or normalizing functions:", error);
    return [];
  }
}
