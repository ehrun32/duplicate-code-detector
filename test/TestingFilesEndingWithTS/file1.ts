// Duplicated in file2.ts
function addTsFile1(a: number, b: number): number {
  return a + b;
}

// Duplicated in file2.ts and near-duplicate in file3.ts
function greetTsFile1(name: string): void {
  console.log(`Hello, ${name}`);
}

// Unique function in file1.ts
function uniqueFunctionTsFile1(): void {
  console.log("This is unique to file1.ts");
}

// Near-duplicate in file4.ts
function calculateRectangleAreaTsFile1(length: number, width: number): number {
  return length * width;
}
