const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Remove CentroControlModule
const funcStart = content.indexOf('function CentroControlModule({ onBack, user, activities, backorders, prospects }) {');
if (funcStart !== -1) {
  // Find the end of this function (we know it's the last function in the file before the export default App;)
  const funcEnd = content.indexOf('export default App;', funcStart);
  if (funcEnd !== -1) {
    content = content.substring(0, funcStart) + content.substring(funcEnd);
  }
}

// 2. Remove SidebarItem for CentroControl
const sidebarRegex = /\\{\\(user\\?\\.role === 'Master' \\|\\| user\\?\\.role === 'Administrador Master' \\|\\| user\\?\\.role === 'Admin' \\|\\| user\\?\\.role === 'admin' \\|\\| user\\?\\.role === 'Administrador'\\)\\s*&&\\s*\\([\\s\\S]*?<SidebarItem icon=\\{ShieldAlert\\} label="Centro de Control"[\\s\\S]*?\\)[\\s\\S]*?\\}\\}/;
// Since regex might be tricky over multiple lines with exact spaces, I'll use simple string replace
const sidebarCode = `{(user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'Admin' || user?.role === 'admin' || user?.role === 'Administrador') && (
            <SidebarItem icon={ShieldAlert} label="Centro de Control" active={view === 'CentroControl'} onClick={() => setView('CentroControl')} />
          )}`;

content = content.replace(sidebarCode, '');

// 3. Remove switch case for CentroControl
const caseCode = `      case 'CentroControl':
          <CentroControlModule onBack={() => setView('Dashboard')} user={user} activities={activities} backorders={backorders} prospects={prospects} />`;

content = content.replace(caseCode, '');

// Save changes
fs.writeFileSync(appPath, content, 'utf8');
console.log("Removed Centro de Control successfully from App.jsx");
