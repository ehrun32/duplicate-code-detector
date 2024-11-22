// Near-duplicate of add(a, b) in file1.js
function add(x, y) {
  return x + y; // Variable names changed
}

// Near-duplicate of greet(name) in file1.js and file2.js
function greet(name) {
  console.log("Hi there, " + name); // String concatenation instead of template literals
}

// Unique to file3.js
function multiply(a, b) {
  return a * b;
}

// Unique to file3.js
function generateRandomNumber(max) {
  return Math.floor(Math.random() * max);
}
