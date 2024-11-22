// Duplicated in file1.ts
function addTsFile2(a: number, b: number): number {
  return a + b;
}

// Duplicated in file1.ts and near-duplicate in file3.ts
function greetTsFile2(name: string): void {
  console.log(`Hello, ${name}`);
}

// Unique to file2.ts
function findMaxTsFile2(array: number[]): number {
  return Math.max(...array);
}

// Near-duplicate in file5.ts
function calculateRectangleAreaTsFile2(length: number, width: number): number {
  return width * length; // Reordered but logically identical
}
