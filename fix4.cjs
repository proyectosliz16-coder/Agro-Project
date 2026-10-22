const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const replacementStr = `  return (
    <div className="app-container">
      <GlobalStyles />
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ color: '#4CAF50' }}>
            <LayoutGrid size={32} />
          </div>
          <h1>AgriFlow</h1>
        </div>

        <nav className="sidebar-nav" style={{ overflowY: 'auto', paddingRight: '4px' }}>
          <SidebarItem icon={Home} label="Dashboard" active={view === 'Dashboard'} onClick={() => setView('Dashboard')} />
          

          {user?.role === 'Vendedor' || user?.role === 'vendedor' ? (
            <>
              <SidebarSection title="VENTAS" isOpen={comercialOpen} onToggle={() => setComercialOpen(!comercialOpen)} />
              {comercialOpen && (
                <>
                  <SidebarItem icon={Users} label="Prospectos" active={view === 'Prospectos'} onClick={() => setView('Prospectos')} />
                  <SidebarItem icon={DollarSign} label="Pipeline" active={view === 'Ventas'} onClick={() => setView('Ventas')} />
                  <SidebarItem icon={Users} label="Clientes" active={view === 'Clientes'} onClick={() => setView('Clientes')} />
                  <SidebarItem icon={FileText} label="Cotizador" active={view === 'Cotizador'} onClick={() => setView('Cotizador')} />
                  <SidebarItem icon={ClipboardList} label="Pedidos" active={view === 'Pedidos'} onClick={() => setView('Pedidos')} />
                  <SidebarItem icon={Box} label="Backorders" active={view === 'Backorders'} onClick={() => setView('Backorders')} />
                </>`;

// Currently, from line 9088 there is just `              )}`
// We need to splice the lines from 9087 downwards.
let lines = content.split('\n');
// We deleted 27 lines from 9088 to 9117. The current 9088 is just `              )}`
lines.splice(9088, 0, ...replacementStr.split('\n'));
fs.writeFileSync('src/App.jsx', lines.join('\n'));
console.log('Restored App.jsx and added Prospectos');
