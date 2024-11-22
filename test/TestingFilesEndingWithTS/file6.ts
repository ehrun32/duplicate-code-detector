// Duplicated in file1.ts and file2.ts
function addTsFile6(a: number, b: number): number {
  return a + b;
}

// Duplicated in file1.ts
function greetTsFile6(name: string): void {
  console.log(`Hello, ${name}`);
}

// Unique to file6.ts
function transformDataTsFile6(
  data: { [key: string]: any }[]
): { [key: string]: any }[] {
  return data.map((item) => ({ ...item, transformed: true }));
}

// Near-duplicate of calculateRectangleAreaTsFile4 in file4.ts
function calculateRectangleAreaTsFile6(length: number, width: number): number {
  if (length <= 0 || width <= 0) {
    console.error("Invalid dimensions!");
    return 0;
  }
  return length * width;
}
