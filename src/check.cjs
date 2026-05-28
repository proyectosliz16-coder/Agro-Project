const fs = require('fs');
const content = fs.readFileSync('App.jsx', 'utf8');
try {
  let braces = 0;
  for (let char of content) {
    if (char === '{') braces++;
    if (char === '}') braces--;
  }
  console.log(`Braces balance: ${braces}`);
} catch (e) {
  console.error(e);
}
