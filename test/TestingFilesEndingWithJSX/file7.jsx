// Unique to file7.js
function sortArrayAsc(array) {
  return array.sort((a, b) => a - b);
}

// Unique to file7.js
function calculateTriangleArea(base, height) {
  return 0.5 * base * height;
}

// Near-duplicate of calculateRectangleArea in file4.js
function calculateRectangleArea(length, width) {
  if (length > 0 && width > 0) {
    return length * width;
  }
  throw new Error("Invalid dimensions!");
}

// Near-duplicate of add(a, b) in file1.js
function addNumbers(a, b) {
  return a + b; // Renamed function but same logic
}
