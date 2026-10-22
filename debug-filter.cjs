const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Find the refreshAllData function and see its exact contents.
const refreshMatch = content.match(/const refreshAllData = async \(\) => {[\s\S]*?setProducts\(Array\.isArray\(pr\) \? pr : \[\]\);\n    } catch/);
console.log("Current refreshAllData structure:");
console.log(refreshMatch ? refreshMatch[0] : "Not found!");
