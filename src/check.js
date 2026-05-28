const fs = require('fs');
const content = fs.readFileSync('App.jsx', 'utf8');
try {
  // Very basic check for mismatched braces/brackets
  let braces = 0;
  let brackets = 0;
  let parens = 0;
  for (let char of content) {
    if (char === '{') braces++;
    if (char === '}') braces--;
    if (char === '[') brackets++;
    if (char === ']') brackets--;
    if (char === '(') parens++;
    if (char === ')') parens--;
  }
  console.log(`Braces: ${braces}, Brackets: ${brackets}, Parens: ${parens}`);
} catch (e) {
  console.error(e);
}
