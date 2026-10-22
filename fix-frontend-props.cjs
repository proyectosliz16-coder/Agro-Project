const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. ProspectosModule signature
content = content.replace(
  `function ProspectosModule({ onBack, prospects, setProspects, refreshProspects, onNavigate, mode = 'prospects', autoEditProspectId, setAutoEditProspectId, backorders = [] }) {`,
  `function ProspectosModule({ onBack, prospects, setProspects, refreshProspects, onNavigate, mode = 'prospects', autoEditProspectId, setAutoEditProspectId, backorders = [], user }) {`
);

// 2. ProspectosModule rendering
content = content.replace(
  `<ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'prospects')} mode="prospects" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} />`,
  `<ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'prospects')} mode="prospects" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} user={user} />`
);
content = content.replace(
  `<ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'clients')} mode="clients" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} />`,
  `<ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'clients')} mode="clients" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} user={user} />`
);

// 3. Inject vendedor in VentasModule (handleCreateProspect)
// It has body: JSON.stringify({ name: newProspectForm.name, phone: newProspectForm.phone, email: newProspectForm.email, interest: newProspectForm.interest, stage: 'Contacto', isClient: false, budget: 0 })
content = content.replace(
  `budget: 0\n        })`,
  `budget: 0,\n          vendedor: user?.name\n        })`
);

// 4. Inject vendedor in ProspectosModule (handleCreate)
// We need to find where it posts to prospects. It might be in handleSave.
content = content.replace(
  `isClient: mode === 'clients',\n          budget: 0\n        })`,
  `isClient: mode === 'clients',\n          budget: 0,\n          vendedor: user?.name\n        })`
);

// 5. Inject vendedor in activities.
// Where is fetch('/api/activities' with POST?
content = content.replace(
  `body: JSON.stringify({ type: 'Reunión', client: p.name, description, date: new Date().toISOString().split('T')[0], time: '12:00', status: 'Pendiente' })`,
  `body: JSON.stringify({ type: 'Reunión', client: p.name, description, date: new Date().toISOString().split('T')[0], time: '12:00', status: 'Pendiente', vendedor: user?.name })`
);

content = content.replace(
  `body: JSON.stringify({ type: isCall ? 'Phone' : 'Reunión', client: qp.name, description: isCall ? 'Llamada de seguimiento agendada' : 'Reunión de seguimiento agendada', date, time, status: 'Pendiente' })`,
  `body: JSON.stringify({ type: isCall ? 'Phone' : 'Reunión', client: qp.name, description: isCall ? 'Llamada de seguimiento agendada' : 'Reunión de seguimiento agendada', date, time, status: 'Pendiente', vendedor: user?.name })`
);

fs.writeFileSync('src/App.jsx', content);
console.log('Frontend POST injections updated');
