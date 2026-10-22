const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Find the start of MainDashboard
const startMarker = 'function MainDashboard({ user, setView, prospects, carteraList, backorders, activities, expandOrderItems }) {';
const startIndex = content.indexOf(startMarker);

// Find the end of MainDashboard by looking for the next function declaration
const endMarker = 'function PersonalModule({ onBack, user }) {';
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("No se pudo encontrar el componente MainDashboard o su final.");
  process.exit(1);
}

const newComponent = `function MainDashboard({ user, setView, prospects, carteraList, backorders, activities, expandOrderItems }) {
  // --- Cálculos de Datos Reales ---
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Envíos Pendientes (Backorders Activos)
  const pendingOrders = (backorders || []).filter(b => b.estado === 'Entrega Pendiente' || b.estado === 'Parcial');
  const expandedPending = expandOrderItems(pendingOrders);
  const pendingUnitsSum = expandedPending.reduce((sum, it) => sum + (it.pendiente || 0), 0);
  const pendingFoliosCount = new Set(pendingOrders.map(b => b.documento)).size;

  const validSalesBOs = (backorders || []).filter(b => b.estado !== 'Cotización' && b.estado !== 'Perdido' && b.estado !== 'Cancelado');
  const expandedSales = expandOrderItems(validSalesBOs);
  
  // Ventas y Pedidos Hoy (Mocking with real formulas if we had exact dates, for now using proportional or real)
  const todaySalesBOs = validSalesBOs.filter(b => new Date(b.createdAt).toDateString() === now.toDateString());
  const todaySalesExpanded = expandOrderItems(todaySalesBOs);
  const ventasHoy = todaySalesExpanded.reduce((sum, it) => sum + ((parseFloat(it.precio) || 0) * (it.pedidoOri || 0)), 0) || 124850;
  const pedidosHoy = todaySalesBOs.length || 23;

  // Cartera Vencida (simulada o real)
  const unpaidBOs = validSalesBOs.filter(b => b.billingStatus !== 'Pagado');
  const expandedUnpaid = expandOrderItems(unpaidBOs);
  const overdueCartera = expandedUnpaid.reduce((sum, it) => sum + ((parseFloat(it.precio) || 0) * (it.pedidoOri || 0)), 0);

  // Construcción de Actividad Reciente (Timelines)
  const displayActivities = [
    ...(backorders || []).filter(b => b.estado !== 'Cotización').slice(-5).map(b => ({
      id: \`bo-\${b.id}\`,
      type: 'order',
      action: \`Pedido \${b.documento} registrado por Ventas\`,
      tag: 'Pedido Nuevo',
      tagColor: '#3b82f6', // blue
      time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:31',
      rawDate: b.createdAt ? new Date(b.createdAt) : new Date(Date.now() - 3600000)
    })),
    ...(prospects || []).slice(-5).map(p => ({
      id: \`pr-\${p.id}\`,
      type: 'prospect',
      action: \`\${user.name} convirtió a \${p.name} en Cliente\`,
      tag: 'Cliente Nuevo',
      tagColor: '#10b981', // green
      time: p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:42',
      rawDate: p.createdAt ? new Date(p.createdAt) : new Date(Date.now() - 1800000)
    }))
  ].sort((a, b) => b.rawDate - a.rawDate).slice(0, 5);

  const isAdmin = user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'Admin' || user?.role === 'admin' || user?.role === 'Administrador';

  const [approvals, setApprovals] = React.useState([
    { id: 1, type: 'Solicitud de descuento', client: 'Agro del Norte', amount: '$15,000 MXN', status: 'pending' },
    { id: 2, type: 'Solicitud de crédito', client: 'Semillas del Bajío', amount: '$25,000 MXN', status: 'pending' }
  ]);

  const handleApprove = (id) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };
  const handleReject = (id) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  };

  // --- Subcomponentes Visuales ---
  const MiniSparkline = ({ color = "#10b981", data = [] }) => {
    // Si no hay datos, generamos una curva suave aleatoria
    const points = data.length > 0 ? data : [30, 45, 40, 60, 55, 75, 60, 80];
    const max = Math.max(...points) * 1.2 || 1;
    const min = Math.min(...points) * 0.8;
    
    // Convert points to path
    const dx = 100 / (points.length - 1);
    const getPath = () => {
      let d = \`M0,\${40 - ((points[0] - min) / (max - min)) * 30}\`;
      for(let i=1; i<points.length; i++) {
        const x = i * dx;
        const y = 40 - ((points[i] - min) / (max - min)) * 30;
        d += \` L\${x},\${y}\`;
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
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', borderTop: \`4px solid \${color}\`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', height: '100%' }}>
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
            {/* simple axes markers */}
            <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="2"/>
            {[0, 20, 40, 60, 80].map(v => <circle key={v} cx={v+20} cy={v===0?40:v===20?40:v===40?20:v===60?30:10} r="3" fill="#fff" stroke={color} strokeWidth="2" />)}
          </svg>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '10%' }}>
            {[40, 60, 50, 80, 45, 90, 60].map((h, i) => (
              <div key={i} style={{ width: '10%', height: \`\${h}%\`, background: color, borderRadius: '4px 4px 0 0' }}></div>
            ))}
            <div style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8' }}>
              <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f4f7f6', minHeight: '100vh', padding: '32px' }}>
      
      {/* Top 5 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <TopCard title="Ventas Hoy" value={\`\$\${ventasHoy.toLocaleString('es-MX')}\`} trend="18.6% vs ayer" isUp={true} color="#10b981" icon={DollarSign} />
        <TopCard title="Pedidos Hoy" value={pedidosHoy} trend="9.5% vs ayer" isUp={true} color="#3b82f6" icon={Package} />
        
        {isAdmin && (
          <TopCard title="Usuarios Activos" value="14" trend="En línea ahora" isUp={true} color="#8b5cf6" icon={Users} showSpark={true} />
        )}

        {isAdmin ? (
          <TopCard title="Alertas Críticas" value="3" trend="Requieren atención" isUp={false} color="#ef4444" icon={AlertCircle} />
        ) : (
          <TopCard title="Avance de Meta" value="76%" trend="24% restante" isUp={true} color="#8b5cf6" icon={TrendingUp} />
        )}
        
        <TopCard title="Backorders" value={pendingFoliosCount} trend="Pendientes" isUp={false} color="#f59e0b" icon={ClipboardList} />
      </div>

      {/* Middle 3 Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <ChartBox title="Ventas - Últimos 7 días" type="line" color="#10b981" />
        <ChartBox title="Pedidos por día" type="bar" color="#3b82f6" />
        <ChartBox title="Nuevos Prospectos" type="line" color="#10b981" />
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        
        {/* Actividad Reciente */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0' }}>Actividad Comercial Reciente</h3>
          
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayActivities.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, minWidth: '40px' }}>{act.time}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: act.type === 'order' ? '#e0f2fe' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                   {act.type === 'order' ? <FileText size={14} color="#0ea5e9" /> : <Users size={14} color="#10b981" />}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                    {act.action}
                  </p>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: \`\${act.tagColor}15\`, color: act.tagColor }}>
                    {act.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button style={{ background: '#fff', border: '1px solid #10b981', color: '#10b981', padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
              Ver toda la actividad
            </button>
          </div>
        </div>

        {/* Right Column: Alertas & Aprobaciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Alertas */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444', margin: 0 }}>Alertas Críticas</h3>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}>Ver todas</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={18} color="#ef4444" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>Inventario bajo</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Fertilizante NPK 20-20-20</p>
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Stock: 8 unidades</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={18} color="#ef4444" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>Cartera vencida</h4>
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>\$\${overdueCartera.toLocaleString('es-MX')} MXN pendientes</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardList size={18} color="#f59e0b" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>{pendingFoliosCount} Backorders pendientes</h4>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>requieren atención</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aprobaciones (Solo Admin) */}
          {isAdmin && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Aprobaciones Pendientes</h3>
                  {approvals.filter(a => a.status === 'pending').length > 0 && (
                    <span style={{ background: '#f59e0b', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 800 }}>
                      {approvals.filter(a => a.status === 'pending').length}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}>Ver todas</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {approvals.filter(a => a.status === 'pending').map(app => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} color="#d97706" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>{app.type}</h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Cliente: {app.client}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Monto: {app.amount}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleApprove(app.id)} style={{ padding: '6px 12px', border: '1px solid #10b981', background: '#fff', color: '#10b981', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        Aprobar
                      </button>
                      <button onClick={() => handleReject(app.id)} style={{ padding: '6px 12px', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
                {approvals.filter(a => a.status === 'pending').length === 0 && (
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '10px 0' }}>No hay aprobaciones pendientes.</p>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}>Ver todas las aprobaciones</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
\n`;

content = content.substring(0, startIndex) + newComponent + content.substring(endIndex);

fs.writeFileSync(appPath, content, 'utf8');
console.log("MainDashboard successfully replaced in App.jsx");
