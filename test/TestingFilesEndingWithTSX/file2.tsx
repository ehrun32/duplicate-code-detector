// Duplicated in file1.tsx
function addTsxFile2(a: number, b: number): number {
  return a + b;
}

// Duplicated in file1.tsx and near-duplicate in file3.tsx
function greetTsxFile2(name: string): string {
  return `Hello, ${name}`;
}

// Unique to file2.tsx
function findMaxTsxFile2(array: number[]): number {
  return Math.max(...array);
}

// Near-duplicate in file5.tsx
function calculateRectangleAreaTsxFile2(length: number, width: number): number {
  return width * length; // Reordered but logically identical
}
