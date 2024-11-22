// Unique to file4.js
function subtract(a, b) {
  return a - b;
}

// Near-duplicate of add(a, b) in file1.js
function add(a, b) {
  return a - b; // Changed logic but same function signature
}

// Unique to file4.js
function calculateCircleArea(radius) {
  return Math.PI * radius * radius;
}

// Complex logic, near-duplicate of calculateRectangleArea in file1.js and file2.js
function calculateRectangleArea(length, width) {
  if (length <= 0 || width <= 0) {
    throw new Error("Length and width must be positive numbers.");
  }
  return length * width;
}
