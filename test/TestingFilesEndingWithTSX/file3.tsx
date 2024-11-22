// Near-duplicate of addTsxFile1 in file1.tsx
function addTsxFile3(x: number, y: number): number {
  return x + y; // Variable names changed
}

// Near-duplicate of greetTsxFile1 in file1.tsx and file2.tsx
function greetTsxFile3(name: string): string {
  return "Hi there, " + name; // String concatenation instead of template literals
}

// Unique to file3.tsx
function multiplyTsxFile3(a: number, b: number): number {
  return a * b;
}

// Unique to file3.tsx
function generateRandomNumberTsxFile3(max: number): number {
  return Math.floor(Math.random() * max);
}
