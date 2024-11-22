import { parse } from "@babel/parser";
import generate from "@babel/generator";

// Parses the code into an AST.
export function parseCode(code: string): any {
  return parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
}

// Converts an AST node to a string.
export function nodeToString(node: any): string {
  return generate(node, { comments: false }).code;
}

// Normalizes an AST node by replacing variable names, function names, and literals with placeholders.
export function normalizeAST(node: any): string {
  function traverse(n: any) {
    if (!n || typeof n !== "object") return;

    try {
      if (n.type === "Identifier") {
        n.name = "placeholder";
      } else if (n.type === "Literal" || n.type === "StringLiteral") {
        n.value = "placeholder";
      } else if (n.type === "TemplateLiteral" && n.quasis) {
        n.quasis.forEach((quasi: any) => {
          quasi.value.raw = "placeholder";
          quasi.value.cooked = "placeholder";
        });
        n.expressions.forEach(traverse);
      } else if (n.type === "BinaryExpression") {
        traverse(n.left);
        traverse(n.right);
      } else if (n.type === "CallExpression") {
        traverse(n.callee);
        n.arguments.forEach(traverse);
      } else if (n.type === "ReturnStatement") {
        traverse(n.argument);
      } else if (n.type === "IfStatement") {
        traverse(n.test);
        traverse(n.consequent);
        if (n.alternate) traverse(n.alternate);
      }

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

// Extracts functions from an AST.
export function extractFunctions(ast: any): string[] {
  const functions: string[] = [];

  function traverse(node: any) {
    if (!node) return;

    if (
      node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression"
    ) {
      functions.push(nodeToString(node));
    }

    Object.keys(node).forEach((key) => {
      if (typeof node[key] === "object") traverse(node[key]);
    });
  }

  traverse(ast);
  return functions;
}
