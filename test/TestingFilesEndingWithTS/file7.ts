// Unique to file7.ts
function sortArrayAscTsFile7(array: number[]): number[] {
  return array.sort((a, b) => a - b);
}

// Unique to file7.ts
function calculateTriangleAreaTsFile7(base: number, height: number): number {
  return 0.5 * base * height;
}

// Near-duplicate of calculateRectangleAreaTsFile4 in file4.ts
function calculateRectangleAreaTsFile7(length: number, width: number): number {
  if (length > 0 && width > 0) {
    return length * width;
  }
  throw new Error("Invalid dimensions!");
}

// Near-duplicate of addTsFile1 in file1.ts
function addNumbersTsFile7(a: number, b: number): number {
  return a + b; // Renamed function but same logic
}
