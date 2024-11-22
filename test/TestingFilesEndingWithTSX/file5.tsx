// Unique to file5.tsx
function complexLogicTsxFile5(a: number, b: number, c: number): number {
  if (a > b && b > c) {
    return a + b + c;
  } else {
    return a * b * c;
  }
}

// Near-duplicate of calculateRectangleAreaTsxFile2 in file2.tsx
function calculateRectangleAreaTsxFile5(length: number, width: number): number {
  return width * length; // Same logic, reordered parameters
}

// Unique to file5.tsx
function processListTsxFile5(items: string[]): string[] {
  return items.map((item) => item.toLowerCase());
}

// Unique to file5.tsx
function nestedFunctionExampleTsxFile5(): number {
  function innerFunction(x: number): number {
    return x * x;
  }
  return innerFunction(10);
}
