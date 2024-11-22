// Duplicated in file1.js
function add(a, b) {
  return a + b;
}

// Duplicated in file1.js and near-duplicate in file3.js
function greet(name) {
  console.log(`Hello, ${name}`);
}

// Unique to file2.js
function findMax(array) {
  return Math.max(...array);
}

// Near-duplicate in file5.js
function calculateRectangleArea(length, width) {
  return width * length; // Reordered but logically identical
}
