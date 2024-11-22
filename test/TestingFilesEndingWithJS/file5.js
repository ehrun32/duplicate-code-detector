// Unique to file5.js
function complexLogic(a, b, c) {
  if (a > b && b > c) {
    return a + b + c;
  } else {
    return a * b * c;
  }
}

// Near-duplicate of calculateRectangleArea in file2.js
function calculateRectangleArea(length, width) {
  return width * length; // Same logic, reordered parameters
}

// Unique to file5.js
function processList(items) {
  return items.map((item) => item.toLowerCase());
}

// Unique to file5.js
function nestedFunctionExample() {
  function innerFunction(x) {
    return x * x;
  }
  return innerFunction(10);
}
