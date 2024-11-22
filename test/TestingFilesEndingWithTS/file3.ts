// Near-duplicate of addTsFile1 in file1.ts
function addTsFile3(x: number, y: number): number {
  return x + y; // Variable names changed
}

// Near-duplicate of greetTsFile1 in file1.ts and file2.ts
function greetTsFile3(name: string): void {
  console.log("Hi there, " + name); // String concatenation instead of template literals
}

// Unique to file3.ts
function multiplyTsFile3(a: number, b: number): number {
  return a * b;
}

// Unique to file3.ts
function generateRandomNumberTsFile3(max: number): number {
  return Math.floor(Math.random() * max);
}
