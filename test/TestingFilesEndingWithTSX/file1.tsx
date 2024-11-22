// Duplicated in file2.tsx
function addTsxFile1(a: number, b: number): number {
  return a + b;
}

// Duplicated in file2.tsx and near-duplicate in file3.tsx
function greetTsxFile1(name: string): string {
  return `Hello, ${name}`;
}

// Unique function in file1.tsx
function uniqueFunctionTsxFile1(): string {
  return "This is unique to file1.tsx";
}

// Near-duplicate in file4.tsx
function calculateRectangleAreaTsxFile1(length: number, width: number): number {
  return length * width;
}
