// Unique to file7.tsx
function sortArrayAscTsxFile7(array: number[]): number[] {
  return array.sort((a, b) => a - b);
}

// Unique to file7.tsx
function calculateTriangleAreaTsxFile7(base: number, height: number): number {
  return 0.5 * base * height;
}

// Near-duplicate of calculateRectangleAreaTsxFile4 in file4.tsx
function calculateRectangleAreaTsxFile7(length: number, width: number): number {
  if (length > 0 && width > 0) {
    return length * width;
  }
  throw new Error("Invalid dimensions!");
}

// Near-duplicate of addTsxFile1 in file1.tsx
function addNumbersTsxFile7(a: number, b: number): number {
  return a + b; // Renamed function but same logic
}
