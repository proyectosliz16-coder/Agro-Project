const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// --- 1. LOGIN FIX ---
content = content.replace(
  `body: JSON.stringify({ email: selectedProfile ? selectedProfile.email : email, password: password })`,
  `body: JSON.stringify({ email: email, password: password })`
);
content = content.replace(
  `setPassword(p.email === 'vendedor@agriflow.com' ? 'vendedorpassword' : '1234');`,
  `setPassword('1234');`
);

// --- 2. FILTER FIX IN REFRESHALLDATA ---
const targetRefresh = `      const [v, c, b, a, p, pr] = results;
      console.log('Data fetched successfully:', {
        ventas: v.length,
        cartera: c.length,
        backorders: b.length,
        prospects: p.length,
        products: pr.length
      });

      setSellers(Array.isArray(v) ? v : []);
      setCarteraList(Array.isArray(c) ? c : []);
      setBackorders(Array.isArray(b) ? b : []);
      setActivities(Array.isArray(a) ? a : []);
      setProspects(Array.isArray(p) ? p : []);
      setProducts(Array.isArray(pr) ? pr : []);`;

const replaceRefresh = `      const [v, c, b, a, p, pr] = results;
      
      let v_data = Array.isArray(v) ? v : [];
      let c_data = Array.isArray(c) ? c : [];
      let b_data = Array.isArray(b) ? b : [];
      let a_data = Array.isArray(a) ? a : [];
      let p_data = Array.isArray(p) ? p : [];
      
      // VERY ROBUST FILTER CHECK
      const isVend = user && user.role && user.role.toLowerCase() === 'vendedor';
      console.log('Filtering data for user:', user?.name, 'Role:', user?.role, 'isVend:', isVend);
      
      if (isVend) {
        c_data = c_data.filter(item => item.seller === user.name);
        b_data = b_data.filter(item => item.vendedor === user.name);
        a_data = a_data.filter(item => item.vendedor === user.name || item.user === user.name);
        p_data = p_data.filter(item => item.vendedor === user.name);
        v_data = v_data.filter(item => item.name === user.name);
        console.log('Filtered counts:', { prospects: p_data.length, backorders: b_data.length });
      }

      console.log('Data fetched successfully:', {
        ventas: v_data.length,
        cartera: c_data.length,
        backorders: b_data.length,
        prospects: p_data.length,
        products: pr.length
      });

      setSellers(v_data);
      setCarteraList(c_data);
      setBackorders(b_data);
      setActivities(a_data);
      setProspects(p_data);
      setProducts(Array.isArray(pr) ? pr : []);`;

if (content.includes(targetRefresh)) {
  content = content.replace(targetRefresh, replaceRefresh);
} else {
  console.log("Could not find targetRefresh to replace!");
}

// --- 3. PROPS FIX ---
content = content.replace(
  `function ProspectosModule({ onBack, prospects, setProspects, refreshProspects, onNavigate, mode = 'prospects', autoEditProspectId, setAutoEditProspectId, backorders = [] }) {`,
  `function ProspectosModule({ onBack, prospects, setProspects, refreshProspects, onNavigate, mode = 'prospects', autoEditProspectId, setAutoEditProspectId, backorders = [], user }) {`
);

content = content.replace(
  `<ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'prospects')} mode="prospects" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} />`,
  `<ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'prospects')} mode="prospects" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} user={user} />`
);
content = content.replace(
  `<ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'clients')} mode="clients" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} />`,
  `<ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'clients')} mode="clients" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} user={user} />`
);

// --- 4. INJECT VENDEDOR ---
content = content.replace(
  `budget: 0\n        })`,
  `budget: 0,\n          vendedor: user?.name\n        })`
);

content = content.replace(
  `isClient: mode === 'clients',\n          budget: 0\n        })`,
  `isClient: mode === 'clients',\n          budget: 0,\n          vendedor: user?.name\n        })`
);

content = content.replace(
  `body: JSON.stringify({ type: 'Reunión', client: p.name, description, date: new Date().toISOString().split('T')[0], time: '12:00', status: 'Pendiente' })`,
  `body: JSON.stringify({ type: 'Reunión', client: p.name, description, date: new Date().toISOString().split('T')[0], time: '12:00', status: 'Pendiente', vendedor: user?.name })`
);

content = content.replace(
  `body: JSON.stringify({ type: isCall ? 'Phone' : 'Reunión', client: qp.name, description: isCall ? 'Llamada de seguimiento agendada' : 'Reunión de seguimiento agendada', date, time, status: 'Pendiente' })`,
  `body: JSON.stringify({ type: isCall ? 'Phone' : 'Reunión', client: qp.name, description: isCall ? 'Llamada de seguimiento agendada' : 'Reunión de seguimiento agendada', date, time, status: 'Pendiente', vendedor: user?.name })`
);

// --- 5. ACTIVITY LIST FIX ---
content = content.replace(
  `action: \`Pedido \${b.documento} registrado por Ventas\`,`,
  `action: \`Pedido \${b.documento} registrado por \${b.vendedor || 'Ventas'}\`,`
);
content = content.replace(
  `action: \`\${user?.name || 'Ventas'} convirtió a \${p.name} en Cliente\`,`,
  `action: \`\${p.vendedor || 'Ventas'} \${p.isClient ? 'convirtió' : 'agregó'} a \${p.name} \${p.isClient ? 'en Cliente' : 'como Prospecto'}\`,`
);

fs.writeFileSync('src/App.jsx', content);
console.log('All frontend fixes reapplied successfully!');
