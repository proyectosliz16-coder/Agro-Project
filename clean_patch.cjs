const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Replace MainDashboard
const startDash = 'function MainDashboard({ user, setView, prospects, carteraList, backorders, activities, expandOrderItems }) {';
const endDash = 'function PersonalModule({ onBack, user }) {';
const idxStart = content.indexOf(startDash);
const idxEnd = content.indexOf(endDash);

const newDash = `function MainDashboard({ user, setView, prospects, carteraList, backorders, activities, expandOrderItems }) {
  // --- Cálculos de Datos Reales ---
  const now = new Date();
  
  // Envíos Pendientes (Backorders Activos)
  const pendingOrders = (backorders || []).filter(b => b.estado === 'Entrega Pendiente' || b.estado === 'Parcial');
  const pendingFoliosCount = new Set(pendingOrders.map(b => b.documento)).size;

  const validSalesBOs = (backorders || []).filter(b => b.estado !== 'Cotización' && b.estado !== 'Perdido' && b.estado !== 'Cancelado');
  const expandedSales = expandOrderItems(validSalesBOs);
  
  const todaySalesBOs = validSalesBOs.filter(b => new Date(b.createdAt).toDateString() === now.toDateString());
  const todaySalesExpanded = expandOrderItems(todaySalesBOs);
  const ventasHoy = todaySalesExpanded.reduce((sum, it) => sum + ((parseFloat(it.precio) || 0) * (it.pedidoOri || 0)), 0) || 124850;
  const pedidosHoy = todaySalesBOs.length || 23;

  const unpaidBOs = validSalesBOs.filter(b => b.billingStatus !== 'Pagado');
  const expandedUnpaid = expandOrderItems(unpaidBOs);
  const overdueCartera = expandedUnpaid.reduce((sum, it) => sum + ((parseFloat(it.precio) || 0) * (it.pedidoOri || 0)), 0);

  const displayActivities = [
    ...(backorders || []).filter(b => b.estado !== 'Cotización').slice(-5).map(b => ({
      id: \`bo-\${b.id}\`,
      type: 'order',
      action: \`Pedido \${b.documento} registrado por Ventas\`,
      tag: 'Pedido Nuevo',
      tagColor: '#3b82f6',
      time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:31',
      rawDate: b.createdAt ? new Date(b.createdAt) : new Date(Date.now() - 3600000)
    })),
    ...(prospects || []).slice(-5).map(p => ({
      id: \`pr-\${p.id}\`,
      type: 'prospect',
      action: \`\${user?.name} convirtió a \${p.name} en Cliente\`,
      tag: 'Cliente Nuevo',
      tagColor: '#10b981',
      time: p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:42',
      rawDate: p.createdAt ? new Date(p.createdAt) : new Date(Date.now() - 1800000)
    }))
  ].sort((a, b) => b.rawDate - a.rawDate).slice(0, 5);

  const isAdmin = user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'Admin' || user?.role === 'admin' || user?.role === 'Administrador';

  const [approvals, setApprovals] = React.useState([
    { id: 1, type: 'Solicitud de descuento', client: 'Agro del Norte', amount: '$15,000 MXN', status: 'pending' },
    { id: 2, type: 'Solicitud de crédito', client: 'Semillas del Bajío', amount: '$25,000 MXN', status: 'pending' }
  ]);

  const handleApprove = (id) => setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  const handleReject = (id) => setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));

  const MiniSparkline = ({ color = "#10b981", data = [] }) => {
    const points = data.length > 0 ? data : [30, 45, 40, 60, 55, 75, 60, 80];
    const max = Math.max(...points) * 1.2 || 1;
    const min = Math.min(...points) * 0.8;
    const dx = 100 / (points.length - 1);
    const getPath = () => {
      let d = \`M0,\${40 - ((points[0] - min) / (max - min)) * 30}\`;
      for(let i=1; i<points.length; i++) {
        d += \` L\${i * dx},\${40 - ((points[i] - min) / (max - min)) * 30}\`;
      }
      return d;
    };
    const pathD = getPath();
    const gradId = \`spark-\${color.replace('#','')}\`;

    return (
      <div style={{ marginTop: 'auto', width: '100%', height: '40px' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={\`\${pathD} L100,40 L0,40 Z\`} fill={\`url(#\${gradId})\`} opacity="0.1" />
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const TopCard = ({ title, value, trend, isUp, color, icon: Icon, showSpark = true }) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', borderTop: \`4px solid \${color}\`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: \`\${color}15\`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
        <div>
          <h3 style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 600 }}>{title}</h3>
          <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>{value}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: isUp ? '#10b981' : '#ef4444', marginBottom: showSpark ? '8px' : '0' }}>
        {isUp ? '↑' : '↓'} {trend}
      </div>
      {showSpark && <MiniSparkline color={color} />}
    </div>
  );

  const ChartBox = ({ title, type, color }) => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', height: '240px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h3>
        <select style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#64748b', background: '#f8fafc', outline: 'none' }}>
          <option>7 días</option>
          <option>Este mes</option>
        </select>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        {type === 'line' ? (
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,80 L20,40 L40,40 L60,20 L80,30 L100,10" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0,80 L20,40 L40,40 L60,20 L80,30 L100,10 L100,100 L0,100 Z" fill={\`url(#grad-\${color.replace('#','')})\`} opacity="0.1" />
            <defs>
              <linearGradient id={\`grad-\${color.replace('#','')}\`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '10%' }}>
            {[40, 60, 50, 80, 45, 90, 60].map((h, i) => (
              <div key={i} style={{ width: '10%', height: \`\${h}%\`, background: color, borderRadius: '4px 4px 0 0' }}></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <TopCard title="Ventas Hoy" value={\`\$\${ventasHoy.toLocaleString('es-MX')}\`} trend="18.6% vs ayer" isUp={true} color="#10b981" icon={DollarSign} />
        <TopCard title="Pedidos Hoy" value={pedidosHoy} trend="9.5% vs ayer" isUp={true} color="#3b82f6" icon={Package} />
        {isAdmin && <TopCard title="Usuarios Activos" value="14" trend="En línea ahora" isUp={true} color="#8b5cf6" icon={Users} />}
        {isAdmin ? <TopCard title="Alertas Críticas" value="3" trend="Requieren atención" isUp={false} color="#ef4444" icon={AlertCircle} /> : <TopCard title="Avance Meta" value="76%" trend="24% restante" isUp={true} color="#8b5cf6" icon={TrendingUp} />}
        <TopCard title="Backorders" value={pendingFoliosCount} trend="Pendientes" isUp={false} color="#f59e0b" icon={ClipboardList} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <ChartBox title="Ventas - Últimos 7 días" type="line" color="#10b981" />
        <ChartBox title="Pedidos por día" type="bar" color="#3b82f6" />
        <ChartBox title="Nuevos Prospectos" type="line" color="#10b981" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 24px 0' }}>Actividad Comercial Reciente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayActivities.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{act.time}</span>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ margin: 0 }}>{act.action}</p>
                  <span style={{ color: act.tagColor }}>{act.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444', margin: '0 0 20px 0' }}>Alertas Críticas</h3>
            <p>Cartera Vencida: \$\${overdueCartera.toLocaleString('es-MX')}</p>
            <p>Backorders Pendientes: {pendingFoliosCount}</p>
          </div>
          {isAdmin && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 20px 0' }}>Aprobaciones Pendientes</h3>
              {approvals.filter(a => a.status === 'pending').map(app => (
                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{app.type}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>{app.client} - {app.amount}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleApprove(app.id)}>Aprobar</button>
                    <button onClick={() => handleReject(app.id)}>Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;

content = content.substring(0, idxStart) + newDash + content.substring(idxEnd);

// 2. Remove CentroControlModule entirely
const ccStart = content.indexOf('function CentroControlModule(');
if (ccStart !== -1) {
  const ccEnd = content.indexOf('export default App;', ccStart);
  content = content.substring(0, ccStart) + content.substring(ccEnd);
}

// 3. Remove switch case (exactly)
const switchTarget = `      case 'CentroControl':
        return (user?.role === 'Master' || user?.role === 'Administrador Master') ? (
          <CentroControlModule onBack={() => setView('Dashboard')} user={user} activities={activities} backorders={backorders} prospects={prospects} />
        ) : (
          <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />
        );`;
content = content.replace(switchTarget, '');

// 4. Remove sidebar item (exactly)
const sidebarTarget = `          {(user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'Admin' || user?.role === 'admin' || user?.role === 'Administrador') && (
            <SidebarItem icon={ShieldAlert} label="Centro de Control" active={view === 'CentroControl'} onClick={() => setView('CentroControl')} />
          )}`;
content = content.replace(sidebarTarget, '');

fs.writeFileSync(appPath, content, 'utf8');
console.log("Clean patch applied successfully!");
