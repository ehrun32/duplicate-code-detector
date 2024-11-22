// Unique to file4.tsx
function subtractTsxFile4(a: number, b: number): number {
  return a - b;
}

// Near-duplicate of addTsxFile1 in file1.tsx
function addTsxFile4(a: number, b: number): number {
  return a - b; // Changed logic but same function signature
}

// Unique to file4.tsx
function calculateCircleAreaTsxFile4(radius: number): number {
  return Math.PI * radius * radius;
}

// Complex logic, near-duplicate of calculateRectangleAreaTsxFile1 in file1.tsx and file2.tsx
function calculateRectangleAreaTsxFile4(length: number, width: number): number {
  if (length <= 0 || width <= 0) {
    throw new Error("Length and width must be positive numbers.");
  }
  return length * width;
}
