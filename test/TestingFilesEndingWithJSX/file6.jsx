// Duplicated in file1.js and file2.js
function add(a, b) {
  return a + b;
}

// Duplicated in file1.js
function greet(name) {
  console.log(`Hello, ${name}`);
}

// Unique to file6.js
function transformData(data) {
  return data.map((item) => ({ ...item, transformed: true }));
}

// Near-duplicate of calculateRectangleArea in file4.js
function calculateRectangleArea(length, width) {
  if (length <= 0 || width <= 0) {
    console.error("Invalid dimensions!");
    return 0;
  }
  return length * width;
}
