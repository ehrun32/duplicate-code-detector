// file4.js

function divide(a, b) {
  if (b !== 0) {
    return a / b;
  } else {
    console.log("Cannot divide by zero");
    return null;
  }
}

// Same structure as add in file1.js but with subtraction instead of addition
function add(a, b) {
  return a - b;
}
