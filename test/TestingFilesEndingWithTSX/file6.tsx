// Duplicated in file1.tsx and file2.tsx
function addTsxFile6(a: number, b: number): number {
  return a + b;
}

// Duplicated in file1.tsx
function greetTsxFile6(name: string): string {
  return `Hello, ${name}`;
}

// Unique to file6.tsx
function transformDataTsxFile6(
  data: { [key: string]: any }[]
): { [key: string]: any }[] {
  return data.map((item) => ({ ...item, transformed: true }));
}

// Near-duplicate of calculateRectangleAreaTsxFile4 in file4.tsx
function calculateRectangleAreaTsxFile6(length: number, width: number): number {
  if (length <= 0 || width <= 0) {
    console.error("Invalid dimensions!");
    return 0;
  }
  return length * width;
}
