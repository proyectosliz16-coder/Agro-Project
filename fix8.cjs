const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStartStr = `      default: return <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />;\n}`;
const targetEndStr = `  if (!user) {\n    return <Login onLogin={(u) => setUser(u)} />;\n  }\n\n  return (\n    <div className="app-container">`;

const startIdx = content.indexOf(`      default: return <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />;`);
const endIdx = content.indexOf(`  return (\n    <div className="app-container">`);

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find start or end index');
    process.exit(1);
}

const originalCorrectStr = `      default: return <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />;
    }
  };

  console.log('App Rendering... User state:', user);

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

`;

const newContent = content.slice(0, startIdx) + originalCorrectStr + content.slice(endIdx);
fs.writeFileSync('src/App.jsx', newContent);
console.log('Reverted damage successfully!');
