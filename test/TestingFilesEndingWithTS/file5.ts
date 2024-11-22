// Unique to file5.ts
function complexLogicTsFile5(a: number, b: number, c: number): number {
  if (a > b && b > c) {
    return a + b + c;
  } else {
    return a * b * c;
  }
}

// Near-duplicate of calculateRectangleAreaTsFile2 in file2.ts
function calculateRectangleAreaTsFile5(length: number, width: number): number {
  return width * length; // Same logic, reordered parameters
}

// Unique to file5.ts
function processListTsFile5(items: string[]): string[] {
  return items.map((item) => item.toLowerCase());
}

// Unique to file5.ts
function nestedFunctionExampleTsFile5(): number {
  function innerFunction(x: number): number {
    return x * x;
  }
  return innerFunction(10);
}
