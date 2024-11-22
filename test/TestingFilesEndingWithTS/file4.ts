// Unique to file4.ts
function subtractTsFile4(a: number, b: number): number {
  return a - b;
}

// Near-duplicate of addTsFile1 in file1.ts
function addTsFile4(a: number, b: number): number {
  return a - b; // Changed logic but same function signature
}

// Unique to file4.ts
function calculateCircleAreaTsFile4(radius: number): number {
  return Math.PI * radius * radius;
}

// Complex logic, near-duplicate of calculateRectangleAreaTsFile1 in file1.ts and file2.ts
function calculateRectangleAreaTsFile4(length: number, width: number): number {
  if (length <= 0 || width <= 0) {
    throw new Error("Length and width must be positive numbers.");
  }
  return length * width;
}
