const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');
let lines = content.split('\n');
// We want to delete lines 9161 to 9165. In 0-indexed array, this is 9160 to 9164.
lines.splice(9160, 5); // Start at 9160, delete 5 elements.
fs.writeFileSync('src/App.jsx', lines.join('\n'));
console.log('Deleted lines 9161 to 9165');
