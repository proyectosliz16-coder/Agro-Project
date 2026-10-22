const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Remove the case switch
content = content.replace(/case 'CentroControl':[\s\S]*?<CentroControlModule[\s\S]*?\/>/, '');

// Remove the SidebarItem
content = content.replace(/\{\(user\?\.role === 'Master'[^}]*?Centro de Control[^}]*?\}\)/, '');

fs.writeFileSync(appPath, content, 'utf8');
console.log("Removed remaining CentroControl refs");
