const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

const target = `       case 'Personal': return <PersonalModule onBack={() => setView('Dashboard')} user={user} />;
      
        ) : (
          <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />
        );
      case 'Sistema':`;

const replacement = `       case 'Personal': return <PersonalModule onBack={() => setView('Dashboard')} user={user} />;
      case 'Sistema':`;

content = content.replace(target, replacement);

fs.writeFileSync(appPath, content, 'utf8');
console.log("Syntax fixed");
