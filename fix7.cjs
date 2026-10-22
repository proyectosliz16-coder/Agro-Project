const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

let lines = content.split('\n');

// Verify we are deleting the right things
console.log('Deleting from 9157:');
console.log(lines.slice(9156, 9156+6).join('\n'));

console.log('Deleting from 9116:');
console.log(lines.slice(9115, 9115+1).join('\n'));

// Delete lines 9157 to 9162 (index 9156 to 9161, which is 6 items)
lines.splice(9156, 6);

// Delete line 9116 (index 9115, which is 1 item)
lines.splice(9115, 1);

fs.writeFileSync('src/App.jsx', lines.join('\n'));
console.log('Fixed using array splice');
