import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { AGRIFLOW_LOGO } from './logo_data.js';
import { generatePremiumPDF } from './utils/pdfGenerator.js';
import {
  Pencil,
  Trash2,
  Search,
  LayoutGrid,
  LayoutDashboard,
  Package,
  FileText,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  BarChart2,
  LogOut,
  Home,
  CheckCircle2,
  Check,
  AlertCircle,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Download,
  X,
  Lock,
  ShieldAlert,
  Settings,
  ClipboardList,
  Clock,
  AlertTriangle,
  ChevronLeft,
  Plus,
  Minus,
  Receipt,
  Truck,
  FileCheck2,
  PieChart,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Trophy,
  Zap,
  Target,
  History,
  Building2,
  Filter,
  ArrowRight,
  Navigation,
  UserCheck,
  ClipboardCheck,
  MoreHorizontal,
  MoreVertical,
  ChevronDown,
  ShoppingCart,
  Leaf,
  Upload,
  CreditCard,
  FileWarning,
  FileX,
  Sliders,
  Layers,
  Scale,
  Box
} from 'lucide-react';

const GlobalStyles = () => (
  <style>{`
    .sidebar-nav::-webkit-scrollbar {
      width: 5px;
    }
    .sidebar-nav::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
    }
    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(76, 175, 80, 0.3);
      border-radius: 10px;
    }
    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(76, 175, 80, 0.6);
    }
    
    /* Suavizado general del scroll */
    .sidebar-nav {
      scrollbar-width: thin;
      scrollbar-color: rgba(76, 175, 80, 0.3) transparent;
    }
  `}</style>
);

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon size={20} />
    <span>{label}</span>
  </div>
);

const SidebarSection = ({ title, isOpen, onToggle }) => (
  <div
    onClick={onToggle}
    style={{
      padding: '24px 20px 12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      userSelect: 'none'
    }}
  >
    <span style={{
      color: '#4CAF50',
      fontSize: '0.7rem',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      whiteSpace: 'nowrap'
    }}>{title}</span>
    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
    <ChevronDown
      size={14}
      color="#4CAF50"
      style={{
        opacity: 0.8,
        transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
        transition: 'transform 0.3s ease'
      }}
    />
  </div>
);

const StatCard = ({ icon: Icon, label, value, subtext, iconClass }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className={`stat-icon-wrapper ${iconClass}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="stat-body">
      <span className="stat-label">{label}</span>
      <h3 className="stat-value">{value}</h3>
      <div className="stat-footer">
        <span>{subtext}</span>
      </div>
    </div>
  </div>
);

const QuickAccessItem = ({ icon: Icon, label, onClick }) => (
  <div className="quick-item" onClick={onClick}>
    <span>{label}</span>
    <Icon size={18} className="quick-icon" />
  </div>
);

const AlertItem = ({ icon: Icon, title, subtitle, variant }) => (
  <div className={`alert-item ${variant}`}>
    <div className="alert-icon">
      <Icon size={20} />
    </div>
    <div className="alert-content">
      <span className="alert-title">{title}</span>
      <span className="alert-subtitle">{subtitle}</span>
    </div>
  </div>
);

function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);

  const profiles = [
    { title: 'Master', email: 'master@agriflow.com', icon: LayoutGrid, color: '#f59e0b', desc: 'Control Total' },
    { title: 'Admin', email: 'admin@agriflow.com', icon: Users, color: '#2d5a3f', desc: 'Operaciones' },
    { title: 'Vendedor', email: 'vendedor@agriflow.com', icon: DollarSign, color: '#22c55e', desc: 'Ventas/Campo' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedProfile ? selectedProfile.email : email, password: password })
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data);
      } else {
        alert(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>AgriFlow Pro</h1>
        <p>Gestión Agrícola Inteligente</p>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar sesion</h2>

          <div className="role-selector">
            {profiles.map(p => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className={`role-card ${selectedProfile?.title === p.title ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedProfile(p);
                    setEmail(p.email);
                    setPassword(p.email === 'vendedor@agriflow.com' ? 'vendedorpassword' : '1234');
                  }}
                >
                  <Icon size={24} />
                  <p>{p.title}</p>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                required
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>

            <p className="demo-hint">* Escribe tu contraseña (demo master: 1234)</p>

            <button type="submit" className="login-btn">Entrar</button>
          </form>

          <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Acceso restringido a personal autorizado. <br />
            Contacte a su administrador para obtener credenciales.
          </p>
        </div>
      </div>
    </div>
  );
}

// Icono temporal para vendedor
const SellIcon = ({ size }) => <TrendingUp size={size} />;

// Los perfiles ahora son gestionados exclusivamente por Administradores.

function ViewHeader({ title, subtitle, icon: Icon = BarChart2, onBack, children }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)',
      padding: '40px 32px 20px 32px',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Abstract background elements */}
      <div style={{
        position: 'absolute',
        right: '-100px',
        top: '-100px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        borderRadius: '50%'
      }}></div>
      <div style={{
        position: 'absolute',
        left: '20%',
        bottom: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
        borderRadius: '50%'
      }}></div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: '#fff',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.2)',
              border: '1px solid #d1fae5'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: '#f0fdf4',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={28} color="#059669" />
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1a2e21', margin: 0, letterSpacing: '-0.025em' }}>{title}</h2>
              {subtitle && <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '4px', marginBottom: '8px', fontWeight: 500 }}>{subtitle}</p>}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                color: '#64748b'
              }}>
                <Home size={16} style={{ cursor: 'pointer' }} onClick={onBack} />
                <span style={{ cursor: 'pointer' }} onClick={onBack}>Dashboard</span>
                <span style={{ color: '#cbd5e1' }}>/</span>
                <Icon size={16} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: 700 }}>{title}</span>
              </div>
            </div>
          </div>
          {children && <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>{children}</div>}
        </div>
      </div>
    </div>
  );
}

// 1. Módulo de Backorders
function BackordersModule({ onBack, user, refreshAllData, onEditOrder, isNewClientFilter = false, title = "Backorders", products = [], prospects = [] }) {
  const [backorders, setBackorders] = useState([]); // Iniciamos vacío
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [filterCliente, setFilterCliente] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');

  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'confirm', // 'confirm' or 'confirm-danger' or 'success'
    onConfirm: null
  });

  const deleteBackorderFolio = (folio, cliente) => {
    setAlertModal({
      show: true,
      title: '¿Eliminar Pedido?',
      message: `¿Estás seguro de que deseas eliminar definitivamente el pedido ${folio} de ${cliente}?\nEsta acción no se puede deshacer y se regresarán los productos al inventario.`,
      type: 'confirm-danger',
      onConfirm: async () => {
        try {
          console.log(`Intentando eliminar todos los items del folio: ${folio}`);
          
          // 1. Revertir inventario de los productos de este folio que estén pendientes
          const itemsToDelete = backorders.filter(it => (it.documento || `AGRO-${it.id}`) === folio);
          for (const it of itemsToDelete) {
            const product = products.find(p => p.name === it.producto);
            if (product && it.pendiente > 0) {
              await fetch(`/api/products/${product.id}/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ incrementBy: it.pendiente })
              });
            }
          }

          // 2. Llamar al endpoint PUT para marcar como Perdido en vez de borrar
          const res = await fetch(`/api/backorders/by-folio/${folio}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'Perdido', pendiente: 0 })
          });

          if (res.ok) {
            setBackorders(prev => prev.filter(bo => (bo.documento || `AGRO-${bo.id}`) !== folio));
            if (typeof refreshAllData === 'function') refreshAllData();
            
            // Mostrar ventana de éxito
            setAlertModal({
              show: true,
              title: '¡Pedido Eliminado!',
              message: `✓ El pedido ${folio} de ${cliente} ha sido eliminado correctamente del sistema.`,
              type: 'success',
              onConfirm: null
            });
          } else {
            const errData = await res.json().catch(() => ({}));
            setAlertModal({
              show: true,
              title: 'Error al Eliminar',
              message: `No se pudo eliminar el pedido: ${errData.error || 'Respuesta inválida'}`,
              type: 'danger',
              onConfirm: null
            });
          }
        } catch (err) {
          console.error('Error en eliminación:', err);
          setAlertModal({
            show: true,
            title: 'Error de Conexión',
            message: 'Ocurrió un problema de conexión al intentar eliminar el pedido.',
            type: 'danger',
            onConfirm: null
          });
        }
      }
    });
  };

  // EFECTO: Cargar datos desde la base de datos al entrar
  useEffect(() => {
    fetchBackorders();
  }, []);

  const fetchBackorders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/backorders');
      const data = await response.json();
      setBackorders(data);
    } catch (error) {
      console.error('Error al cargar backorders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    // Obsoleto con el nuevo sistema de edición en cotizador
  };

  const filteredData = (backorders || []).filter(bo => {
    // Determinar si la orden pertenece a un cliente o a un prospecto
    const clientName = (bo.cliente || '').trim().toLowerCase();
    const prospectMatch = (prospects || []).find(p => p.name.trim().toLowerCase() === clientName);
    const isClientOrder = prospectMatch ? prospectMatch.isClient : true;

    // Pedidos (isNewClientFilter === true) -> Muestra solo Prospectos (isClientOrder === false)
    // Backorders (isNewClientFilter === false) -> Muestra solo Clientes (isClientOrder === true)
    const matchesType = isNewClientFilter ? !isClientOrder : isClientOrder;

    const searchStr = (filterCliente || "").toLowerCase();
    const matchesSearch = (bo.cliente || "").toLowerCase().includes(searchStr) || (bo.documento || "").toLowerCase().includes(searchStr);
    const isNotLost = bo.estado !== 'Perdido' && bo.estado !== 'Cancelado';
    return matchesType && matchesSearch && isNotLost;
  });

  // 2. Agrupar por Folio para tener pedidos reales (esto es lo que el usuario ve)
  const groupedOrders = filteredData.reduce((acc, curr) => {
    const folio = curr.documento || `AGRO-${curr.id}`;
    const existing = acc.find(o => o.documento === folio);
    if (existing) {
      existing.cantidad += (parseFloat(curr.cantidad) || 0);
      existing.pendiente += (parseFloat(curr.pendiente) || 0);
      return acc;
    }
    return [...acc, { ...curr, documento: folio }];
  }, []);

  // 3. Totales basados en pedidos agrupados
  const statTotal = groupedOrders.length;
  const statPending = groupedOrders.filter(o => o.pendiente > 0).length;
  const statCompleted = groupedOrders.filter(o => o.pendiente === 0).length;

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
      <ViewHeader 
        title={title} 
        subtitle={title === 'Pedidos' ? 'Gestión de cotizaciones y nuevas solicitudes.' : 'Seguimiento de pedidos pendientes y recurrentes.'} 
        icon={ClipboardList} 
        onBack={onBack}
      >
        {[
          { label: 'Total pedidos', val: statTotal, sub: 'Este mes', icon: ClipboardList, color: '#16a34a', bg: '#f0fdf4', statusKey: 'Todos' },
          { label: 'Pendientes', val: statPending, sub: 'Por preparar', icon: Package, color: '#f59e0b', bg: '#fff7ed', statusKey: 'Pendiente Entrega' },
          { label: 'Completados', val: statCompleted, sub: 'Este mes', icon: CheckCircle2, color: '#3b82f6', bg: '#eff6ff', statusKey: 'Completado' }
        ].map((stat, i) => {
          const isActive = filterEstado === stat.statusKey;
          return (
            <div 
              key={i} 
              onClick={() => setFilterEstado(stat.statusKey)}
              style={{
                background: '#fff',
                padding: '12px 20px',
                borderRadius: '16px',
                border: isActive ? `2px solid ${stat.color}` : '1.5px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minWidth: '180px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isActive ? 'translateY(-2px)' : 'none',
                boxShadow: isActive ? `0 10px 15px -3px ${stat.color}15, 0 4px 6px -4px ${stat.color}15` : 'none',
              }}
            >
              <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{stat.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </ViewHeader>

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '32px' }}>

        {/* CONTENEDOR UNIFICADO (ESTILO FINO) */}
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>

          {/* BARRA DE FILTROS SUTIL */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Buscar cliente o folio..."
                  value={filterCliente}
                  onChange={(e) => setFilterCliente(e.target.value)}
                  style={{ padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '280px', fontSize: '0.8rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                />
              </div>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600, outline: 'none', background: '#f8fafc', color: '#475569', cursor: 'pointer' }}
              >
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente Entrega">Solo Pendientes</option>
                <option value="Completado">Solo Completados</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => fetchBackorders()}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <Clock size={14} /> Actualizar
              </button>
            </div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>CLIENTE</th>
                  {(user?.role === 'Master' || user?.role === 'Admin' || user?.role === 'Administrador' || user?.role === 'Administrador Master') && <th>VENDEDOR</th>}
                  <th>FOLIO / DOCUMENTO</th>
                  <th>CANT. TOTAL</th>
                  <th>PENDIENTE</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      <div className="loading-spinner"></div> Cargando pedidos...
                    </td>
                  </tr>
                ) : groupedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No se encontraron pedidos.
                    </td>
                  </tr>
                ) : (
                  groupedOrders
                    .filter(o => {
                      if (filterEstado === 'Pendiente Entrega') return o.pendiente > 0;
                      if (filterEstado === 'Completado') return o.pendiente === 0;
                      return true;
                    })
                    .map(order => (
                      <tr key={order.documento}>
                        <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.cliente}</td>
                        {(user?.role === 'Master' || user?.role === 'Admin' || user?.role === 'Administrador' || user?.role === 'Administrador Master') &&
                          <td style={{ fontSize: '0.85rem', color: '#2d5a3f', fontWeight: 600 }}>{order.vendedor}</td>}
                        <td style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#16a34a' }}>{order.documento}</span>
                            <button
                              onClick={() => {
                                const curFolio = order.documento;
                                const items = backorders.filter(it => {
                                  const itFolio = it.documento || `AGRO-${it.id}`;
                                  return itFolio === curFolio;
                                });

                                if (items.length === 0) {
                                  alert("No se encontraron productos para este folio.");
                                  return;
                                }

                                const tV = items.reduce((s, it) => s + ((it.precio || 0) * (it.cantidad || 0)), 0);
                                const tax = tV * 0.16;

                                generatePremiumPDF({
                                  logoBase64: AGRIFLOW_LOGO,
                                  title: "DETALLE DE PEDIDO",
                                  filename: `AGRO-Pedido_${curFolio}.pdf`,
                                  headerDetails: [
                                    { label: 'Folio:', value: `#${curFolio}` },
                                    { label: 'Fecha de pedido:', value: new Date(items[0].createdAt || Date.now()).toLocaleDateString('es-MX') },
                                    { label: 'Entrega Est.:', value: items[0].fechaEntrega ? new Date(items[0].fechaEntrega).toLocaleDateString('es-MX') : 'N/A' }
                                  ],
                                  cards: [
                                    { title: "CLIENTE", value: order.cliente, sub: "Cliente registrado" },
                                    { title: "ATENDIÓ", value: order.vendedor || 'Sistema', sub: "Ejecutivo de ventas" },
                                    { title: "ENTREGA", value: "Dirección del Cliente", sub: "Instalaciones registradas" }
                                  ],
                                  table: {
                                    head: [['#', 'PRODUCTO', 'CANT.', 'PRECIO UNIT.', 'SUBTOTAL']],
                                    body: items.map((it, idx) => [
                                      idx + 1,
                                      it.producto || 'Sin descripción',
                                      it.cantidad || 0,
                                      `$${(it.precio || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}`,
                                      `$${((it.precio || 0) * (it.cantidad || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2})}`
                                    ])
                                  },
                                  summary: {
                                    left: [
                                      { label: "Total de productos:", value: items.length.toString() },
                                      { label: "Total de piezas:", value: items.reduce((s, it) => s + (it.cantidad || 0), 0).toString() }
                                    ],
                                    right: [
                                      { label: "Subtotal", value: `$${tV.toLocaleString('es-MX', {minimumFractionDigits: 2})}` },
                                      { label: "IVA (16%)", value: `$${tax.toLocaleString('es-MX', {minimumFractionDigits: 2})}` },
                                      { label: "TOTAL NETO", value: `$${(tV + tax).toLocaleString('es-MX', {minimumFractionDigits: 2})}`, isTotal: true, color: "#16a34a" }
                                    ]
                                  },
                                  bottomBlocks: [
                                    {
                                      title: 'NOTAS DE ENTREGA',
                                      content: "La entrega se realizará directamente en la dirección del cliente.\nFavor de comunicar 30 minutos antes de la llegada."
                                    }
                                  ]
                                });
                              }}
                              style={{ border: 'none', background: '#f8fafc', color: '#ef4444', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex' }}
                              title="Descargar PDF"
                            >
                              <Download size={15} />
                            </button>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontWeight: 700 }}>{order.cantidad}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ color: (order.pendiente > 0) ? '#f59e0b' : '#64748b', fontWeight: 700 }}>{order.pendiente}</span>
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '100px',
                              textAlign: 'center',
                              padding: '4px 0',
                              borderRadius: '6px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              letterSpacing: '0.3px',
                              textTransform: 'uppercase',
                              background: order.estado === 'Cotización' ? '#eff6ff' : (order.pendiente === 0 ? '#f1fcf4' : (order.pendiente < order.cantidad ? '#fff9f2' : '#f8fafc')),
                              color: order.estado === 'Cotización' ? '#3b82f6' : (order.pendiente === 0 ? '#10b981' : (order.pendiente < order.cantidad ? '#f59e0b' : '#94a3b8')),
                            }}
                          >
                            {order.estado === 'Cotización' ? 'Cotización' : (order.pendiente === 0 ? 'Completado' : (order.pendiente < order.cantidad ? 'Parcial' : 'Pendiente'))}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button
                              onClick={() => onEditOrder(order)}
                              style={{ border: 'none', background: 'none', color: '#2d5a3f', cursor: 'pointer' }}
                              title="Editar pedido en Cotizador"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => deleteBackorderFolio(order.documento, order.cliente)}
                              style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                              title="Eliminar"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación / Alerta Personalizado de Pedidos */}
      {alertModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '30px',
            width: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            animation: 'scaleUp 0.15s ease-out',
            position: 'relative'
          }}>
            <div style={{
              background: alertModal.type === 'success' 
                ? '#f0fdf4' 
                : (alertModal.type === 'confirm-danger' || alertModal.type === 'danger' ? '#fef2f2' : '#fef3c7'),
              color: alertModal.type === 'success' 
                ? '#16a34a' 
                : (alertModal.type === 'confirm-danger' || alertModal.type === 'danger' ? '#dc2626' : '#d97706'),
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              {alertModal.type === 'success' ? (
                <CheckCircle2 size={32} />
              ) : (alertModal.type === 'confirm-danger' || alertModal.type === 'danger' ? (
                <Trash2 size={32} />
              ) : (
                <AlertTriangle size={32} />
              ))}
            </div>
            
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 850,
              color: '#0f172a',
              marginBottom: '10px',
              margin: 0
            }}>
              {alertModal.title}
            </h3>
            
            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              marginBottom: '24px',
              marginTop: '10px'
            }}>
              {alertModal.message}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              {(alertModal.type === 'confirm' || alertModal.type === 'confirm-danger') && (
                <button
                  onClick={() => setAlertModal(prev => ({ ...prev, show: false }))}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancelar
                </button>
              )}
              
              <button
                onClick={() => {
                  setAlertModal(prev => ({ ...prev, show: false }));
                  if (typeof alertModal.onConfirm === 'function') {
                    alertModal.onConfirm();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: (alertModal.type === 'confirm-danger' || alertModal.type === 'danger') ? '#dc2626' : '#2d5a3f',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Módulo Inventario (Antes Cotizador)
function CotizadorModule({ onBack, onNavigate, products, setProducts, refreshAllData, user }) {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' o 'low'
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    category: 'Materiales',
    quantity: '',
    cost: '',
    margin: '',
    price: '',
    tax: 16,
    image: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleDownloadReport = () => {
    try {
      const totalVal = products.reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseFloat(p.quantity || 0)), 0);
      const lowStockCount = products.filter(p => parseInt(p.quantity) <= (parseInt(p.minStock) || 10)).length;
      
      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "INVENTARIO Y STOCK",
        filename: `AGRO-Reporte_Inventario_${new Date().toISOString().slice(0, 10)}.pdf`,
        headerDetails: [
          { label: 'Folio:', value: '#INV-' + new Date().getTime().toString().slice(-6) },
          { label: 'Fecha:', value: new Date().toLocaleDateString('es-MX') }
        ],
        cards: [
          { title: "PRODUCTOS", value: products.length.toString(), sub: "Registrados en sistema" },
          { title: "VALOR ALMACÉN", value: `$${totalVal.toLocaleString('es-MX', {minimumFractionDigits: 2})}`, sub: "Precio Venta" },
          { title: "STOCK BAJO", value: lowStockCount.toString(), sub: "Por debajo del mínimo" }
        ],
        table: {
          head: [['PRODUCTO', 'CATEGORÍA', 'STOCK', 'MIN', 'COSTO', 'PRECIO', 'IVA', 'VALOR TOTAL']],
          body: products.map(p => {
            const taxVal = (p.tax !== undefined && p.tax !== null && p.tax !== '') ? p.tax : 16;
            return [
              p.name,
              p.category || 'General',
              p.quantity,
              p.minStock || 10,
              `$${parseFloat(p.cost || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}`,
              `$${parseFloat(p.price || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}`,
              `${taxVal}%`,
              `$${(parseFloat(p.price || 0) * parseFloat(p.quantity || 0)).toLocaleString('es-MX', {minimumFractionDigits: 2})}`
            ];
          })
        },
        summary: {
          right: [
            { label: "VALOR TOTAL", value: `$${totalVal.toLocaleString('es-MX', {minimumFractionDigits: 2})}`, isTotal: true, color: "#16a34a" }
          ]
        },
        bottomBlocks: [
          {
            title: 'NOTAS DEL REPORTE',
            content: "Documento de control interno de AgriFlow Pro.\nEl valor total se calcula usando el Precio de Venta por el Stock disponible."
          }
        ]
      });
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Hubo un error al generar el reporte en PDF.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es muy pesada. Máximo 2MB para estabilidad del sistema.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Convertir a número para campos numéricos
    if (['quantity', 'cost', 'margin', 'tax', 'minStock'].includes(name)) {
      finalValue = value === "" ? "" : parseFloat(value);
    }

    let newData = { ...formData, [name]: finalValue };

    // Calculador Dinámico (Costo, Margen, Precio)
    if (['cost', 'margin', 'price'].includes(name)) {
      const cost = parseFloat(name === 'cost' ? finalValue : formData.cost) || 0;
      const margin = parseFloat(name === 'margin' ? finalValue : formData.margin) || 0;
      const price = parseFloat(name === 'price' ? finalValue : formData.price) || 0;

      if (name === 'cost' || name === 'margin') {
        // Calcular Precio basado en Costo + Margen
        const calculatedPrice = cost * (1 + margin / 100);
        newData.price = calculatedPrice.toFixed(2);
      } else if (name === 'price') {
        // Calcular Margen basado en Costo y Precio
        if (cost > 0) {
          const calculatedMargin = ((price / cost) - 1) * 100;
          newData.margin = calculatedMargin.toFixed(1);
        }
      }
    }
    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // ACTUALIZAR PRODUCTO (PUT)
        const response = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          const updated = await response.json();
          setProducts(prev => prev.map(p => p.id === editingId ? updated : p));
        }
      } else {
        // CREAR PRODUCTO (POST)
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          const created = await response.json();
          setProducts(prev => [...prev, created]);
          if (typeof refreshAllData === 'function') refreshAllData();
          alert('Producto creado exitosamente');
        } else {
          const errData = await response.json().catch(() => ({}));
          alert(`Error del servidor: ${errData.error || 'No se pudo crear el producto'}`);
        }
      }
      setEditingId(null);
      setShowForm(false);
      setFormData({ name: '', desc: '', category: 'Materiales', quantity: '', cost: '', margin: '', price: '', tax: 16, minStock: 10, image: '' });
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error de red al conectar con el inventario');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      } catch (err) {
        console.error('Error al eliminar producto:', err);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      desc: product.description || product.desc,
      category: product.category || 'Materiales',
      quantity: product.quantity,
      cost: product.cost,
      margin: product.margin,
      price: product.price,
      tax: product.tax || 16,
      minStock: product.minStock || 10,
      image: product.image || ''
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseFloat(p.quantity || 0)), 0);
  const lowStockCount = products.filter(p => parseInt(p.quantity) <= (parseInt(p.minStock) || 10)).length;

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
      <ViewHeader 
        title="Inventario" 
        subtitle="Control de stock y gestión de productos agroinsumos." 
        icon={Package} 
        onBack={onBack}
      >
        {[
          { id: 'all', label: 'Productos', val: products.length, sub: 'Catálogo activo', icon: Package, color: '#16a34a', bg: '#f0fdf4', clickable: true },
          { id: 'low', label: 'Stock Bajo', val: lowStockCount, sub: 'Requieren atención', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2', clickable: true },
          { id: 'total', label: 'Valor Total', val: `$${Math.round(totalValue / 1000)}k`, sub: 'En almacén', icon: DollarSign, color: '#3b82f6', bg: '#eff6ff', clickable: false }
        ].map((stat, i) => {
          const isSelected = stat.clickable && stockFilter === stat.id;
          return (
            <div
              key={i}
              onClick={stat.clickable ? () => setStockFilter(stat.id) : undefined}
              style={{
                background: '#fff',
                padding: '12px 20px',
                borderRadius: '16px',
                border: isSelected 
                  ? `2.5px solid ${stat.color}` 
                  : '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minWidth: '180px',
                cursor: stat.clickable ? 'pointer' : 'default',
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isSelected ? '0 10px 15px -3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{stat.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </ViewHeader>

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 32px' }}>


        {/* CONTENEDOR UNIFICADO (ESTILO FINO) */}
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {!showForm && (
                <>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Buscar producto o categoría..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '280px', fontSize: '0.8rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setFormData({ name: '', desc: '', category: 'Materiales', quantity: '', cost: '', margin: '', price: '', tax: 16, minStock: 10 });
                      setEditingId(null);
                      setShowForm(true);
                    }}
                    style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', background: '#2d5a3f', color: '#fff', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(45, 90, 63, 0.2)' }}>
                    <Plus size={14} /> Nuevo Producto
                  </button>
                </>
              )}
            </div>

            {!showForm && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleDownloadReport}
                  style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Download size={14} /> Reporte
                </button>
              </div>
            )}
          </div>

          {showForm ? (
            <div className="module-card">
              <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea name="desc" value={formData.desc} onChange={handleInputChange} className="search-input" style={{ width: '100%', minHeight: '80px', fontFamily: 'inherit' }} required />
                </div>
                <div className="form-group">
                  <label>Imagen del Producto</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {formData.image ? (
                        <img src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Package size={28} color="#cbd5e1" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      <label
                        htmlFor="image-upload"
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '12px' }}
                      >
                        <Upload size={18} color="#059669" />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Subir desde PC</span>
                      </label>
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>Formato JPG, PNG (Máx. 2MB)</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="image"
                    className="search-input"
                    style={{ width: '100%' }}
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="O pega la URL de una imagen aquí..."
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="select-input" style={{ width: '100%' }}>
                    <option value="Materiales">Materiales</option>
                    <option value="Insumos">Insumos</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Cantidad (Stock)</label>
                      <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Stock Mínimo</label>
                      <input type="number" name="minStock" value={formData.minStock} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
                    </div>
                  </div>
                  <div className="form-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={{ fontWeight: 800, color: '#1e293b' }}>Calculadora de Rentabilidad</label>
                      {formData.margin !== "" && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: formData.margin < 5 ? '#fef2f2' : formData.margin < 15 ? '#fffbeb' : '#f0fdf4',
                          color: formData.margin < 5 ? '#dc2626' : formData.margin < 15 ? '#b45309' : '#16a34a',
                          border: `1px solid ${formData.margin < 5 ? '#fecaca' : formData.margin < 15 ? '#fde68a' : '#bbf7d0'}`
                        }}>
                          {formData.margin < 5 ? 'RENTABILIDAD CRÍTICA' : formData.margin < 15 ? 'RENTABILIDAD BAJA' : 'RENTABILIDAD ÓPTIMA'}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem' }}>Costo Unitario ($)</label>
                        <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} className="search-input" style={{ width: '100%', fontSize: '0.9rem' }} step="0.01" required />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem' }}>Margen de Utilidad (%)</label>
                        <input type="number" name="margin" value={formData.margin} onChange={handleInputChange} className="search-input" style={{ width: '100%', fontSize: '0.9rem', fontWeight: 700, color: formData.margin < 5 ? '#dc2626' : '#1e293b' }} step="0.1" required />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.75rem' }}>Precio de Venta ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="search-input" style={{ width: '100%', fontSize: '0.9rem', fontWeight: 800, background: '#fff', borderColor: '#10b981' }} step="0.01" required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tasa de IVA (%)</label>
                  <select name="tax" value={formData.tax} onChange={handleInputChange} className="select-input" style={{ width: '100%' }}>
                    <option value={16}>16% (General)</option>
                    <option value={0}>0% (Exento)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ background: '#2d5a3f' }}>{editingId ? 'Actualizar Producto' : 'Guardar Producto'}</button>
                  <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="module-card">
              <div className="table-container">
                <table className="data-table" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                  <thead>
                    <tr style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0 16px', textAlign: 'left' }}>PRODUCTO</th>
                      <th style={{ padding: '0 16px', textAlign: 'center' }}>CATEGORÍA</th>
                      <th style={{ padding: '0 16px', textAlign: 'center' }}>STOCK</th>
                      <th style={{ padding: '0 16px', textAlign: 'center' }}>MIN</th>
                      <th style={{ padding: '0 16px', textAlign: 'right' }}>COSTO</th>
                      <th style={{ padding: '0 16px', textAlign: 'center' }}>MARGEN</th>
                      <th style={{ padding: '0 16px', textAlign: 'center' }}>IVA</th>
                      <th style={{ padding: '0 16px', textAlign: 'right' }}>PRECIO</th>
                      <th style={{ padding: '0 16px', textAlign: 'center' }}>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = (products || []).filter(p => {
                        // 1. Filtro de Stock Bajo
                        if (stockFilter === 'low') {
                          const quantity = parseInt(p.quantity || 0);
                          const minStock = parseInt(p.minStock || 10);
                          if (quantity > minStock) return false;
                        }

                        // 2. Filtro de búsqueda textual
                        const query = searchQuery.toLowerCase();
                        return (
                          (p.name || '').toLowerCase().includes(query) ||
                          (p.category || '').toLowerCase().includes(query) ||
                          (p.description || p.desc || '').toLowerCase().includes(query)
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                              {searchQuery 
                                ? 'No se encontraron productos coincidentes.' 
                                : (stockFilter === 'low' 
                                  ? 'No hay productos con stock bajo en este momento.' 
                                  : 'No hay productos registrados.')}
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((p) => (
                        <tr key={p.id} style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                          <td style={{ padding: '16px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {p.image ? (
                                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <Package size={20} color="#cbd5e1" />
                                )}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 700, color: '#1a2e21', fontSize: '0.95rem' }}>{p.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{p.description || p.desc || 'Sin descripción'}</span>

                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{ fontWeight: 600, color: '#1a2e21' }}>{p.category || 'General'}</span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: p.quantity < (p.minStock || 10) ? '#ef4444' : 'inherit' }}>{p.quantity}</span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#94a3b8' }}>{p.minStock || 10}</span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right', color: '#64748b', fontWeight: 500 }}>
                            ${parseFloat(p.cost || 0).toFixed(2)}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>{p.margin}%</span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span className={`badge ${Number(p.tax) === 0 ? 'badge-neutral' : 'badge-primary'}`} style={{ background: Number(p.tax) === 16 ? '#dbeafe' : '#f1f5f9', color: Number(p.tax) === 16 ? '#1e40af' : '#64748b' }}>
                              {p.tax}%
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <span style={{ fontWeight: 800, color: '#1a2e21', fontSize: '1rem' }}>${parseFloat(p.price || 0).toFixed(2)}</span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                              <button
                                onClick={() => handleEdit(p)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                                title="Editar"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                title="Eliminar"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. Módulo de Ventas
function KpisModule({ onBack, sellers, setSellers, refreshSellers, prospects, backorders, carteraList, user, products = [], onNavigate, handleDeliver }) {
  const [animate, setAnimate] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState(null);
  const [budgetVal, setBudgetVal] = React.useState('');
  const [openHistory, setOpenHistory] = React.useState(null);
  const [budgetType, setBudgetType] = React.useState('Anual');
  const [activeTab, setActiveTab] = React.useState('General');
  const [showFullRanking, setShowFullRanking] = React.useState(false);
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const [showPriorityModal, setShowPriorityModal] = React.useState(false);
  const [selectedProductBackorder, setSelectedProductBackorder] = React.useState(null);

  // --- COMPONENTES COMPARTIDOS DE GRÁFICOS ---
  const Sparkline = ({ color }) => (
    <svg width="100%" height="40" preserveAspectRatio="none" style={{ marginTop: 'auto', marginBottom: '16px' }}>
      <path d="M0,30 Q20,10 40,25 T80,20 T120,35 T160,15 T200,25 T240,10 T280,30 T320,5 L320,40 L0,40 Z" fill={`url(#grad-${color?.replace('#', '')})`} opacity="0.2" />
      <path d="M0,30 Q20,10 40,25 T80,20 T120,35 T160,15 T200,25 T240,10 T280,30 T320,5" fill="none" stroke={color} strokeWidth="2.5" />
      <defs>
        <linearGradient id={`grad-${color?.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );

  const DonutChart = ({ data, size = 160, strokeWidth = 25 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const strokeDasharray = `${(d.value / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -currentOffset;
          currentOffset += (d.value / 100) * circumference;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke={d.color} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
          );
        })}
      </svg>
    );
  };

  const MockBarChart = ({ data, color }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', marginTop: '16px', marginBottom: '16px' }}>
      {data.map((h, i) => (
        <div key={i} style={{ flex: 1, background: color, height: `${h}%`, borderRadius: '4px 4px 0 0' }}></div>
      ))}
    </div>
  );
  // -------------------------------------------

  const isAdmin = user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'admin' || user?.role === 'Administrador';

  React.useEffect(() => {
    refreshSellers();
  }, []);

  React.useEffect(() => {
    if (sellers?.length > 0) {
      setTimeout(() => setAnimate(true), 150);
    }
  }, [sellers]);

  // handleDeliver ha sido movido al componente App principal para ser compartido entre módulos.


  const handleSaveBudget = async (id) => {
    try {
      await fetch(`/api/ventas/${id}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: budgetVal })
      });
      setEditingBudget(null);
      refreshSellers();
    } catch (e) { console.error('Error saving budget', e); }
  };

  const displaySellers = (sellers || []).map(s => {
    const myProspects = (prospects || []).filter(p => (p.seller === s.name) || ((p.id % sellers.length) === s.id % sellers.length));
    let myEstimadas = myProspects.reduce((acc, p) => acc + (p.stage !== 'Venta Cerrada' && p.stage !== 'Perdido' ? parseFloat(p.budget || 0) : 0), 0);

    return {
      ...s,
      estimadas: myEstimadas,
      progress: s.budget > 0 ? Math.round((s.sales / s.budget) * 100) : 0,
      estimatedProgress: s.budget > 0 ? Math.round(((s.sales + myEstimadas) / s.budget) * 100) : 0
    };
  });

  const visibleSellers = isAdmin ? displaySellers : displaySellers.filter(s => s.email === user?.email || s.name === user?.name);

  const totalBudget = displaySellers.reduce((a, s) => a + (s.budget || 0), 0);
  const totalSales = displaySellers.reduce((a, s) => a + (s.sales || 0), 0);
  const totalEstimates = displaySellers.reduce((a, s) => a + (s.estimadas || 0), 0);
  const globalProgress = totalBudget > 0 ? Math.round((totalSales / totalBudget) * 100) : 0;

  const globalMaxVal = visibleSellers.length > 0 ? Math.max(...visibleSellers.map(s => Math.max(s.budget || 0, (s.sales || 0) + (s.estimadas || 0)))) : 100000;
  const rankedSellers = [...visibleSellers].sort((a, b) => (b.progress || 0) - (a.progress || 0));

  // Componente de Anillo Circular (Donut Chart)
  const CircularProgress = ({ real, estimated, size = 110, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const realR = Math.min(real, 100);
    const estR = Math.min(real + estimated, 100);
    const estOffset = animate ? circumference - (estR / 100) * circumference : circumference;
    const realOffset = animate ? circumference - (realR / 100) * circumference : circumference;

    return (
      <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.05))' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle stroke="#f1f5f9" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
          {/* Ring Estimado */}
          <circle stroke="#fde047" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} strokeDasharray={circumference} strokeDashoffset={estOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s' }} />
          {/* Ring Real */}
          <circle stroke="#4ade80" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} strokeDasharray={circumference} strokeDashoffset={realOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: '1' }}>{animate ? real : 0}%</span>
          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, marginTop: '2px', textTransform: 'uppercase' }}>Logrado</span>
        </div>
      </div>
    );
  }

  const projectionYear = totalSales * (52 / Math.max(1, Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000))));

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
      <ViewHeader 
        title="KPIs" 
        subtitle="Inteligencia de ventas, seguimiento de metas y proyecciones." 
        icon={Zap} 
        onBack={onBack}
      >
        {[
          { label: 'Logro Global', val: `${globalProgress}%`, sub: 'Ventas reales', icon: Target, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Objetivo Anual', val: `$${Math.round(totalBudget / 1000000)}M`, sub: 'Meta total', icon: DollarSign, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Proyección', val: `$${Math.round(projectionYear / 1000000)}M`, sub: 'Cierre est.', icon: Zap, color: '#f59e0b', bg: '#fff7ed' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#fff',
            padding: '12px 20px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            minWidth: '180px'
          }}>
            <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>
              <stat.icon size={18} color={stat.color} />
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </ViewHeader>

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '32px' }}>

        {/* TABS DE NAVEGACIÓN DE KPIs */}
        <div className="premium-tabs-container" style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', overflowX: 'auto' }}>
          {['General', 'Metas y Desempeño', 'Rendimiento Comercial', 'Cobranza y Cartera', 'Desempeño Individual', 'Backorders y Operación'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab ? '#ecfdf5' : 'transparent',
                color: activeTab === tab ? '#059669' : '#64748b',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'General' && isAdmin && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '20px', padding: '28px', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}><TrendingUp size={150} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}><DollarSign size={20} color="#cbd5e1" /></div>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, margin: 0 }}>Meta Global de Ingresos</p>
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>${totalBudget.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h3>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', borderRadius: '20px', padding: '28px', color: '#fff', boxShadow: '0 20px 25px -5px rgba(22, 163, 74, 0.25)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.15 }}><TrendingUp size={150} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}><TrendingUp size={20} color="#fff" /></div>
                <p style={{ fontSize: '0.9rem', color: '#bbf7d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, margin: 0 }}>Ventas Reales Depositadas</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>${totalSales.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h3>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>{globalProgress}% ALCANZADO</span>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '12px' }}><Users size={20} color="#15803d" /></div>
                <p style={{ fontSize: '0.9rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: 0 }}>Pipeline en Negociación</p>
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px', color: '#0f172a' }}>+ ${totalEstimates.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h3>
              <p style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={14} /> Dinero potencial escaneado de prospectos en progreso.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Metas y Desempeño' && (() => {
          const now = new Date();
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const diffMs = now - startOfYear;
          const weeksPassed = Math.max(1, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));

          // 1. Proyección de cierre de año
          const projectionYear = weeksPassed > 0 ? (totalSales / weeksPassed) * 52 : 0;
          const projectionVsBudget = totalBudget > 0 ? (projectionYear / totalBudget) * 100 : 0;

          // 2. Velocidad de Ventas (Ventas último mes / 4 semanas)
          const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const isWon = p => p.stage === 'Venta Completada' || p.status === 'Ganado' || p.stage === 'Venta Cerrada' || p.stage === 'Depósito (Venta)';
          const monthlySalesAmount = prospects
            .filter(p => (p.closedAt ? new Date(p.closedAt) >= startOfCurrentMonth : false) && isWon(p))
            .reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
          const velocity = monthlySalesAmount / 4.34; // Promedio semanas/mes

          return (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>

                {/* CARD: AVANCE DE META */}
                <div className="module-card" style={{ padding: '32px', background: '#fff', border: '1px solid #e2e8f0', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>% Avance de Meta</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{globalProgress}%</p>
                    </div>
                    <div style={{ padding: '10px', background: '#f0fdf4', borderRadius: '12px' }}><Target size={24} color="#16a34a" /></div>
                  </div>
                  <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${globalProgress}%`, background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                    <span style={{ color: '#64748b' }}>Actual: ${totalSales.toLocaleString()}</span>
                    <span style={{ color: '#16a34a' }}>Meta: ${totalBudget.toLocaleString()}</span>
                  </div>
                </div>

                {/* CARD: PROYECCIÓN ANUAL */}
                <div className="module-card" style={{ padding: '32px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', border: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Proyección Cierre 2026</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>${projectionYear.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}><Zap size={24} color="#facc15" /></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: projectionVsBudget >= 100 ? '#4ade80' : '#f87171' }}>
                      {projectionVsBudget.toFixed(1)}% del Objetivo Anual
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(Basado en {weeksPassed} semanas)</span>
                  </div>
                </div>

                {/* CARD: VELOCIDAD DE VENTAS */}
                <div className="module-card" style={{ padding: '32px', background: '#fff', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Velocidad de Ventas</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>${velocity.toLocaleString('es-MX', { maximumFractionDigits: 0 })} / sem</p>
                    </div>
                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '12px' }}><TrendingUp size={24} color="#6366f1" /></div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Promedio de ingresos generados por semana este mes.</p>
                </div>
              </div>

              {/* RANKING DE VENDEDORES */}
              <div className="module-card" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ padding: '10px', background: '#fff7ed', borderRadius: '12px' }}><Trophy size={24} color="#f97316" /></div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Ranking de Desempeño Comercial</h3>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ borderRadius: '12px 0 0 12px' }}>RANK</th>
                        <th>VENDEDOR</th>
                        <th style={{ textAlign: 'right' }}>VENTAS REALES</th>
                        <th style={{ textAlign: 'right' }}>META</th>
                        <th style={{ borderRadius: '0 12px 12px 0', textAlign: 'center' }}>% CUMPLIMIENTO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankedSellers.map((s, idx) => {
                        const isTop = idx < 3;
                        const medalColor = idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#92400e';
                        return (
                          <tr key={s.id} style={{ transition: 'all 0.2s', cursor: 'default' }}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: isTop ? medalColor : '#64748b' }}>
                                {idx === 0 ? <Trophy size={18} /> : <span>#{idx + 1}</span>}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569' }}>
                                  {s.name.charAt(0)}
                                </div>
                                <span style={{ fontWeight: 700, color: '#1e293b' }}>{s.name}</span>
                              </div>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>${(s.sales || 0).toLocaleString()}</td>
                            <td style={{ textAlign: 'right', color: '#64748b' }}>${(s.budget || 0).toLocaleString()}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '10px', maxWidth: '100px', overflow: 'hidden' }}>
                                  <div style={{ width: `${Math.min(s.progress, 100)}%`, height: '100%', background: s.progress >= 100 ? '#22c55e' : s.progress >= 50 ? '#fbbf24' : '#ef4444' }} />
                                </div>
                                <span style={{ fontWeight: 800, color: s.progress >= 100 ? '#16a34a' : '#1e293b', width: '45px' }}>{s.progress}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {activeTab === 'Rendimiento Comercial' && (() => {
          const now = new Date();
          const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

          const isCurrentMonth = date => date ? new Date(date) >= startOfCurrentMonth : true;
          const isLastMonth = date => { const d = new Date(date); return d >= startOfLastMonth && d < startOfCurrentMonth; };

          const isWonProspect = p => p.stage === 'Venta Completada' || p.status === 'Ganado' || p.stage === 'Venta Cerrada' || p.stage === 'Depósito (Venta)';
          const isWonBO = b => b.estado !== 'Cotización' && b.estado !== 'Perdido' && b.estado !== 'Cancelado';
          
          const boValue = (boArray) => {
            return expandOrderItems(boArray).reduce((sum, it) => sum + ((parseFloat(it.precio) || 0) * (it.pedidoOri || 0)), 0);
          };

          // PIPELINE ACTIVO (Global)
          const activeProspects = prospects.filter(p => !isWonProspect(p) && p.stage !== 'Perdido');
          const activeBOs = (backorders || []).filter(b => b.estado === 'Cotización');
          const valorPipeline = Math.round(activeProspects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0) + boValue(activeBOs));
          const trendPipeline = 0; 

          // TASA DE CONVERSIÓN GLOBAL
          const totalGanadosProspects = prospects.filter(isWonProspect).length;
          const totalGanadosBOs = (backorders || []).filter(isWonBO).length;
          const totalTratos = prospects.length + (backorders || []).filter(b => b.estado !== 'Cotización').length;
          const tasaConversion = totalTratos > 0 ? Math.round(((totalGanadosProspects + totalGanadosBOs) / totalTratos) * 100) : 0;
          const trendTasaConversion = 0;

          // GANADOS Y PERDIDOS (Mes actual vs Mes Anterior para comparar cierres)
          const ganadosProspectsAct = prospects.filter(p => (p.closedAt ? isCurrentMonth(p.closedAt) : isCurrentMonth(p.createdAt)) && isWonProspect(p));
          const ganadosBOsAct = (backorders || []).filter(b => isCurrentMonth(b.createdAt) && isWonBO(b));
          const ganadosActuales = [...ganadosProspectsAct, ...ganadosBOsAct];
          
          const ganadosProspectsAnt = prospects.filter(p => (p.closedAt ? isLastMonth(p.closedAt) : isLastMonth(p.createdAt)) && isWonProspect(p));
          const ganadosBOsAnt = (backorders || []).filter(b => isLastMonth(b.createdAt) && isWonBO(b));
          const ganadosAnteriores = [...ganadosProspectsAnt, ...ganadosBOsAnt];

          // Perdidos: ignoramos fecha para que SIEMPRE aparezcan si están en Perdido o Cancelado
          const perdidosProspectsAct = prospects.filter(p => p.stage === 'Perdido');
          const perdidosBOsAct = (backorders || []).filter(b => b.estado === 'Perdido' || b.estado === 'Cancelado');
          const perdidosActuales = [...perdidosProspectsAct, ...perdidosBOsAct];
          const perdidosAnteriores = [];

          const pagadosActuales = carteraList.filter(c => c.status === 'Pagado' && isCurrentMonth(c.createdAt));
          const pagadosAnteriores = carteraList.filter(c => c.status === 'Pagado' && isLastMonth(c.createdAt));

const ticketPromedio = pagadosActuales.length > 0 ? Math.round(pagadosActuales.reduce((sum, c) => sum + (c.amount || 0), 0) / pagadosActuales.length) : 0;
          const ticketPromedioAnt = pagadosAnteriores.length > 0 ? Math.round(pagadosAnteriores.reduce((sum, c) => sum + (c.amount || 0), 0) / pagadosAnteriores.length) : 0;
          const trendTicket = ticketPromedioAnt > 0 ? Math.round(((ticketPromedio - ticketPromedioAnt) / ticketPromedioAnt) * 100) : 0;

          const cicloVenta = ganadosActuales.length > 0 ? Math.round(ganadosActuales.reduce((sum, p) => sum + Math.max(1, (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24)), 0) / ganadosActuales.length) : 0;
          const cicloVentaAnt = ganadosAnteriores.length > 0 ? Math.round(ganadosAnteriores.reduce((sum, p) => sum + Math.max(1, (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24)), 0) / ganadosAnteriores.length) : 0;
          const trendCiclo = cicloVentaAnt > 0 ? Math.round(((cicloVenta - cicloVentaAnt) / cicloVentaAnt) * 100) : 0;
          const trendGanados = ganadosAnteriores.length > 0 ? Math.round(((ganadosActuales.length - ganadosAnteriores.length) / ganadosAnteriores.length) * 100) : (ganadosActuales.length > 0 ? 100 : 0);
          const trendPerdidos = perdidosAnteriores.length > 0 ? Math.round(((perdidosActuales.length - perdidosAnteriores.length) / perdidosAnteriores.length) * 100) : (perdidosActuales.length > 0 ? 100 : 0);

          const prospectStagesNames = ['Contacto', 'Agendar Cita', 'Cotizarle', 'Negociación', 'Depósito (Venta)', 'Recibir Pedido', 'Venta Completada', 'Venta Cerrada', 'Nuevo Cliente', 'Ganado', 'Perdido'];
          const clientStagesNames = ['Contacto', 'Negociación', 'Depósito (Venta)', 'Recibir Pedido', 'Por Menores', 'Venta Completada', 'Venta Cerrada', 'Nuevo Cliente', 'Ganado', 'Perdido', 'Cancelado'];

          const funnelProspectos = [
            { title: 'Contacto', stageFilter: ['Contacto'] },
            { title: 'Agendar Cita', stageFilter: ['Agendar Cita'] },
            { title: 'Cotizarle', stageFilter: ['Cotizarle'] },
            { title: 'Negociación', stageFilter: ['Negociación'] },
            { title: 'Depósito (Venta)', stageFilter: ['Depósito (Venta)'] },
            { title: 'Recibir Pedido', stageFilter: ['Recibir Pedido'] },
            { title: 'Venta Completada', stageFilter: ['Venta Completada', 'Venta Cerrada', 'Nuevo Cliente', 'Ganado'] },
            { title: 'Perdido', stageFilter: ['Perdido'] }
          ].map(f => {
            const amount = prospects.filter(p => !p.isClient).filter(p => {
              if (f.title === 'Venta Completada' && (isWonProspect(p) || p.stage === 'Nuevo Cliente' || p.status === 'Ganado')) return true;
              if (f.title === 'Contacto' && (!p.stage || p.stage === '' || !prospectStagesNames.includes(p.stage))) return true;
              return f.stageFilter.includes(p.stage);
            }).reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
            return { ...f, amount, count: prospects.filter(p => !p.isClient).filter(p => {
              if (f.title === 'Venta Completada' && (isWonProspect(p) || p.stage === 'Nuevo Cliente' || p.status === 'Ganado')) return true;
              if (f.title === 'Contacto' && (!p.stage || p.stage === '' || !prospectStagesNames.includes(p.stage))) return true;
              return f.stageFilter.includes(p.stage);
            }).length };
          });
          const totalProspectos = funnelProspectos.reduce((sum, f) => sum + f.amount, 0) || 1;

          const funnelClientes = [
            { title: 'Contacto', stageFilter: ['Contacto'] },
            { title: 'Negociación', stageFilter: ['Negociación'] },
            { title: 'Depósito (Venta)', stageFilter: ['Depósito (Venta)'] },
            { title: 'Recibir Pedido', stageFilter: ['Recibir Pedido'] },
            { title: 'Por Menores', stageFilter: ['Por Menores'] },
            { title: 'Venta Completada', stageFilter: ['Venta Completada', 'Venta Cerrada', 'Nuevo Cliente', 'Ganado'] },
            { title: 'Perdido', stageFilter: ['Perdido'] }
          ].map(f => {
            let amount = 0;
            // Solo logica de CRM (pipelines), no mezclar con backorders
            const filteredProspects = prospects.filter(p => p.isClient).filter(p => {
              if (f.title === 'Venta Completada' && (isWonProspect(p) || p.stage === 'Nuevo Cliente' || p.status === 'Ganado')) return true;
              if (f.title === 'Contacto' && (!p.stage || p.stage === '' || !clientStagesNames.includes(p.stage))) return true;
              return f.stageFilter.includes(p.stage);
            });
            amount += filteredProspects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
            
            return { ...f, amount, count: filteredProspects.length };
          });
          const totalClientes = funnelClientes.reduce((sum, f) => sum + f.amount, 0) || 1;

          const FunnelStage = ({ color, width, percentage, title, amount, count }) => (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', gap: '16px' }}>
              <div style={{ width: '200px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: width,
                  background: color,
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)'
                }}>
                  {percentage}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 700, display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {title} <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '12px', fontSize: '0.7rem' }}>{count}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>${amount.toLocaleString('es-MX')}</div>
              </div>
            </div>
          );

          return (
            <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
              <ViewHeader title="Rendimiento Comercial" onBack={() => setActiveTab('Dashboard')} />
              <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '40px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: '#6366f1', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)' }}>
                      <TrendingUp size={32} color="#fff" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-1.2px' }}>Rendimiento Comercial</h2>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '4px 0 0 0', fontWeight: 500 }}>Análisis de pipeline, tasas de conversión y desempeño de ventas.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {[
                      { label: 'Conversión', val: `${tasaConversion}%`, sub: 'Meta: 60%', icon: Target, color: '#16a34a', bg: '#f0fdf4' },
                      { label: 'Pipeline', val: `$${Math.round(valorPipeline / 1000)}k`, sub: 'Valor activo', icon: Zap, color: '#f59e0b', bg: '#fff7ed' },
                      { label: 'Ciclo Venta', val: `${cicloVenta}d`, sub: 'Promedio', icon: Clock, color: '#3b82f6', bg: '#eff6ff' }
                    ].map((stat, i) => (
                      <div key={i} style={{ background: '#fff', padding: '12px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '180px' }}>
                        <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>{(() => { const Icon = stat.icon; return <Icon size={18} color={stat.color} />; })()}</div>
                        <div>
                          <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{stat.sub}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Tasa de Conversión <Info size={14} color="#cbd5e1" />
                        </h4>
                        <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '8px' }}><TrendingUp size={16} color="#3b82f6" /></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{tasaConversion}%</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ color: trendTasaConversion >= 0 ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            {trendTasaConversion >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {Math.abs(trendTasaConversion)}%
                          </span>
                          <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>vs. mes anterior</span>
                        </div>
                      </div>
                      <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${Math.min(tasaConversion, 100)}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        <span>Meta: 60%</span>
                        <span>{Math.round((tasaConversion / 60) * 100)}% de la meta</span>
                      </div>
                      <Sparkline color="#3b82f6" />
                    </div>

                    {/* 2. Ticket Promedio */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Ticket Promedio <Info size={14} color="#cbd5e1" />
                        </h4>
                        <div style={{ background: '#fef9c3', padding: '6px', borderRadius: '8px' }}><DollarSign size={16} color="#eab308" /></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>${ticketPromedio.toLocaleString()}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ color: trendTicket >= 0 ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            {trendTicket >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {Math.abs(trendTicket)}%
                          </span>
                          <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>vs. mes anterior</span>
                        </div>
                      </div>
                      <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${Math.min(Math.round((ticketPromedio / 400000) * 100), 100)}%`, height: '100%', background: '#eab308', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        <span>Meta: $400,000</span>
                        <span>{Math.round((ticketPromedio / 400000) * 100)}% de la meta</span>
                      </div>
                      <Sparkline color="#eab308" />
                    </div>

                    {/* 3. Ciclo de Venta */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Ciclo de Venta <Info size={14} color="#cbd5e1" />
                        </h4>
                        <div style={{ background: '#f3e8ff', padding: '6px', borderRadius: '8px' }}><Calendar size={16} color="#a855f7" /></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{cicloVenta}</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>días</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ color: trendCiclo <= 0 ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            {trendCiclo <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />} {Math.abs(trendCiclo)} días
                          </span>
                          <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>vs. mes anterior</span>
                        </div>
                      </div>
                      <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${Math.min(Math.round((10 / Math.max(1, cicloVenta)) * 100), 100)}%`, height: '100%', background: '#a855f7', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        <span>Meta: 10 días</span>
                        <span>{Math.round((10 / Math.max(1, cicloVenta)) * 100)}% eficiencia de meta</span>
                      </div>
                      <Sparkline color="#a855f7" />
                    </div>

                    {/* 4. Valor del Pipeline */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Valor del Pipeline <Info size={14} color="#cbd5e1" />
                        </h4>
                        <div style={{ background: '#dcfce7', padding: '6px', borderRadius: '8px' }}><Package size={16} color="#22c55e" /></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>${valorPipeline.toLocaleString()}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ color: trendPipeline >= 0 ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            {trendPipeline >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {Math.abs(trendPipeline)}%
                          </span>
                          <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>vs. mes anterior</span>
                        </div>
                      </div>
                      <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${Math.min(Math.round((valorPipeline / 500000) * 100), 100)}%`, height: '100%', background: '#22c55e', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        <span>Meta: $500,000</span>
                        <span>{Math.round((valorPipeline / 500000) * 100)}% de la meta</span>
                      </div>
                      <Sparkline color="#22c55e" />
                    </div>

                  </div>

                  {/* BOTTOM ROW (3 columns) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '20px' }}>

                    {/* 1. Ganados vs Perdidos */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Ganados vs Perdidos <Info size={14} color="#cbd5e1" />
                      </h4>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ flex: 1, background: '#f0fdf4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>{ganadosActuales.length}</span>
                          <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase', margin: '4px 0', display: 'block' }}>Ganados</span>
                          <span style={{ fontSize: '0.7rem', color: trendGanados >= 0 ? '#16a34a' : '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            {trendGanados >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(trendGanados)}%
                          </span>
                          <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>vs. mes anterior</span>
                        </div>
                        <div style={{ flex: 1, background: '#fef2f2', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>{perdidosActuales.length}</span>
                          <span style={{ fontSize: '0.7rem', color: '#b91c1c', fontWeight: 800, textTransform: 'uppercase', margin: '4px 0', display: 'block' }}>Perdidos</span>
                          <span style={{ fontSize: '0.7rem', color: trendPerdidos > 0 ? '#ef4444' : '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            {trendPerdidos > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(trendPerdidos)}%
                          </span>
                          <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>vs. mes anterior</span>
                        </div>
                      </div>
                      {/* Mock Bar Chart */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', padding: '0 10px' }}>
                        {[3, 5, 1, 4, 6, 3].map((val, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '6px', height: `${val * 10}px`, background: val > 1 ? '#22c55e' : '#ef4444', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '0.55rem', color: '#64748b' }}>{['25 Abr', '02 May', '09 May', '16 May', '23 May', '30 May'][i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Distribución del Pipeline: Clientes */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Embudo: Clientes (Pedidos) <Info size={14} color="#cbd5e1" />
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', paddingLeft: '8px', flex: 1, justifyContent: 'center' }}>
                        {funnelClientes.filter(f => f.amount > 0).map((f, i) => {
                          const colors = ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#ef4444'];
                          const percentage = Math.round((f.amount / totalClientes) * 100) || 0;
                          const width = Math.max(15, percentage) + '%';
                          return <FunnelStage key={i} color={colors[i % colors.length]} width={width} percentage={percentage + '%'} title={f.title} amount={f.amount} count={f.count} />;
                        })}
                      </div>
                    </div>

                    {/* 3. Distribución del Pipeline: Prospectos */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Embudo: Prospectos <Info size={14} color="#cbd5e1" />
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', paddingLeft: '8px', flex: 1, justifyContent: 'center' }}>
                        {funnelProspectos.filter(f => f.amount > 0).map((f, i) => {
                          const colors = ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308', '#ef4444'];
                          const percentage = Math.round((f.amount / totalProspectos) * 100) || 0;
                          const width = Math.max(15, percentage) + '%';
                          return <FunnelStage key={i} color={colors[i % colors.length]} width={width} percentage={percentage + '%'} title={f.title} amount={f.amount} count={f.count} />;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}



        {activeTab === 'Cobranza y Cartera' && (() => {
          const now = new Date();
          const mappedCartera = (backorders || []).filter(b => (b.precio || 0) > 0).map(b => ({
            client: b.cliente,
            amount: (b.precio || 0) * (b.cantidad || 1),
            status: b.billingStatus || 'Pendiente',
            createdAt: b.createdAt
          }));

          const carteraPendiente = mappedCartera.filter(c => c.status !== 'Pagado');
          const carteraPagada = mappedCartera.filter(c => c.status === 'Pagado');

          const totalPendiente = carteraPendiente.reduce((sum, c) => sum + (c.amount || 0), 0);
          const totalPagado = carteraPagada.reduce((sum, c) => sum + (c.amount || 0), 0);
          const totalCartera = totalPendiente + totalPagado;

          const dso = totalPagado > 0 ? Math.round((totalPendiente / totalPagado) * 365) : 0;

          let age30 = 0, age60 = 0, age90 = 0, age90Plus = 0;
          const carteraPorCliente = {};

          carteraPendiente.forEach(c => {
            if (c.ageGroup === '1-30') age30 += c.amount || 0;
            else if (c.ageGroup === '31-60') age60 += c.amount || 0;
            else if (c.ageGroup === '61-90') age90 += c.amount || 0;
            else if (c.ageGroup === '+90') age90Plus += c.amount || 0;
            else {
              const ageDays = c.createdAt ? Math.floor((now - new Date(c.createdAt)) / (1000 * 60 * 60 * 24)) : 0;
              if (ageDays <= 30) age30 += c.amount || 0;
              else if (ageDays <= 60) age60 += c.amount || 0;
              else if (ageDays <= 90) age90 += c.amount || 0;
              else age90Plus += c.amount || 0;
            }

            if (!carteraPorCliente[c.client]) {
              carteraPorCliente[c.client] = { total: 0, plus90: 0, lastPayment: null };
            }
            carteraPorCliente[c.client].total += (c.amount || 0);
            if (c.ageGroup === '+90' || (!['1-30', '31-60', '61-90'].includes(c.ageGroup) && c.createdAt && Math.floor((now - new Date(c.createdAt)) / (1000 * 60 * 60 * 24)) > 90)) {
              carteraPorCliente[c.client].plus90 += (c.amount || 0);
            }
          });

          carteraPagada.forEach(c => {
            if (carteraPorCliente[c.client]) {
              const pDate = new Date(c.createdAt);
              if (!carteraPorCliente[c.client].lastPayment || pDate > carteraPorCliente[c.client].lastPayment) {
                carteraPorCliente[c.client].lastPayment = pDate;
              }
            }
          });

          const pct30 = totalPendiente > 0 ? Math.round((age30 / totalPendiente) * 100) : 0;
          const pct60 = totalPendiente > 0 ? Math.round((age60 / totalPendiente) * 100) : 0;
          const pct90 = totalPendiente > 0 ? Math.round((age90 / totalPendiente) * 100) : 0;
          const pct90Plus = totalPendiente > 0 ? Math.round((age90Plus / totalPendiente) * 100) : 0;

          const tasaRecuperacion = totalCartera > 0 ? Math.round((totalPagado / totalCartera) * 100) : 0;
          const exposicionCritica = age90Plus;

          const top5Clientes = Object.entries(carteraPorCliente)
            .map(([client, data]) => ({ client, ...data }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

          const clientesCriticosCount = Object.values(carteraPorCliente).filter(d => d.plus90 > 0).length;



          return (
            <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
              <ViewHeader title="Cobranza y Cartera" onBack={() => setActiveTab('Dashboard')} />

              <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '40px 32px' }}>

                {/* HEADER CON STATS (ESTILO PREMIUM) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: '#d97706', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(217, 119, 6, 0.3)' }}>
                      <FileText size={32} color="#fff" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-1.2px' }}>Cobranza y Cartera</h2>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '4px 0 0 0', fontWeight: 500 }}>Análisis de liquidez, antigüedad de saldos y recuperación.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    {[
                      { label: 'DSO', val: dso, sub: 'Días promedio', icon: Clock, color: '#ef4444', bg: '#fef2f2' },
                      { label: 'Recuperación', val: `${tasaRecuperacion}%`, sub: 'Tasa global', icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
                      { label: 'Crítico (+90)', val: `$${Math.round(exposicionCritica / 1000)}k`, sub: 'Vencido', icon: AlertTriangle, color: '#f59e0b', bg: '#fff7ed' }
                    ].map((stat, i) => (
                      <div key={i} style={{ background: '#fff', padding: '12px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '180px' }}>
                        <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>{(() => { const Icon = stat.icon; return <Icon size={18} color={stat.color} />; })()}</div>
                        <div>
                          <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{stat.sub}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOP 4 CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>

                  {/* 1. DSO */}
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 700 }}>DSO (Días Promedio de Cobro)</h4>
                      <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '8px' }}><Clock size={16} color="#3b82f6" /></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{dso}</span>
                        <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>días</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={12} /> 28 días</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>vs. mes anterior</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700 }}>Meta: 45 días</span>
                      <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>+{Math.max(0, dso - 45)} días vs objetivo</span>
                    </div>
                    <Sparkline color="#3b82f6" />
                    <div style={{ marginTop: 'auto', background: dso > 45 ? '#fef2f2' : '#f0fdf4', color: dso > 45 ? '#ef4444' : '#16a34a', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                      {dso > 45 ? <><AlertTriangle size={16} /> Riesgo alto de liquidez</> : <><CheckCircle2 size={16} /> Liquidez saludable</>}
                    </div>
                  </div>

                  {/* 2. Cartera por Antigüedad */}
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 700 }}>Cartera por Antigüedad</h4>
                      <div style={{ background: '#fffbeb', padding: '6px', borderRadius: '8px' }}><PieChart size={16} color="#d97706" /></div>
                    </div>
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DonutChart data={[
                          { value: pct30, color: '#10b981' },
                          { value: pct60, color: '#f59e0b' },
                          { value: pct90, color: '#f97316' },
                          { value: pct90Plus, color: '#ef4444' },
                        ]} size={110} strokeWidth={18} />
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>Total</span>
                          <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 800 }}>${(totalPendiente / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', whiteSpace: 'nowrap' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div> 0-30d</span>
                          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                            <span style={{ color: '#0f172a', fontSize: '0.75rem' }}>{pct30}%</span><br />
                            <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 600 }}>${(age30 / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', whiteSpace: 'nowrap' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div> 31-60d</span>
                          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                            <span style={{ color: '#0f172a', fontSize: '0.75rem' }}>{pct60}%</span><br />
                            <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 600 }}>${(age60 / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', whiteSpace: 'nowrap' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }}></div> 61-90d</span>
                          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                            <span style={{ color: '#0f172a', fontSize: '0.75rem' }}>{pct90}%</span><br />
                            <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 600 }}>${(age90 / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', whiteSpace: 'nowrap' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> +90d</span>
                          <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                            <span style={{ color: '#0f172a', fontSize: '0.75rem' }}>{pct90Plus}%</span><br />
                            <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 600 }}>${(age90Plus / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 'auto', background: '#fffbeb', color: '#d97706', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={16} /> {pct90Plus}% de la cartera tiene más de 90 días
                    </div>
                  </div>

                  {/* 3. Tasa de Recuperación */}
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#334155', fontWeight: 700 }}>Tasa de Recuperación</h4>
                      <div style={{ background: '#ecfccb', padding: '6px', borderRadius: '8px' }}><CheckCircle2 size={16} color="#65a30d" /></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{tasaRecuperacion}%</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={12} /> 8%</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>vs. mes anterior</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700 }}>Meta: 70%</span>
                      <span style={{ color: tasaRecuperacion >= 70 ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>{tasaRecuperacion - 70}% vs objetivo</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                      <div style={{ width: `${tasaRecuperacion}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                    </div>
                    <Sparkline color="#10b981" />
                    <div style={{ marginTop: 'auto', background: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={16} /> Recuperación en mejora
                    </div>
                  </div>

                  {/* 4. Exposición Crítica */}
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #fee2e2', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#991b1b', fontWeight: 800 }}>Exposición Crítica (+90 días)</h4>
                      <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '8px' }}><AlertTriangle size={16} color="#dc2626" /></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                      <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#b91c1c', lineHeight: 1 }}>${exposicionCritica.toLocaleString('es-MX')}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={12} /> 35%</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>vs. mes anterior</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700 }}>Clientes: {clientesCriticosCount}</span>
                      <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.75rem' }}>{pct90Plus}% del total cartera</span>
                    </div>
                    <MockBarChart data={[40, 60, 65, 75, 70, 85]} color="#fca5a5" />
                    <div style={{ marginTop: 'auto', background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={16} /> Alerta crítica de liquidez
                    </div>
                  </div>

                </div>

                {/* BOTTOM SECTION */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px' }}>

                  {/* Tabla Top Clientes */}
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: '#1e293b', fontWeight: 800 }}>Cartera por Cliente (Top 5 por Vencimiento)</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ color: '#64748b', fontSize: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '12px 0', fontWeight: 700 }}>Cliente</th>
                          <th style={{ padding: '12px 0', fontWeight: 700, textAlign: 'right' }}>Total Adeudo</th>
                          <th style={{ padding: '12px 0', fontWeight: 700, textAlign: 'right' }}>+90 días</th>
                          <th style={{ padding: '12px 0', fontWeight: 700, textAlign: 'right' }}>% Cartera</th>
                          <th style={{ padding: '12px 0', fontWeight: 700, textAlign: 'right' }}>Último Pago</th>
                        </tr>
                      </thead>
                      <tbody>
                        {top5Clientes.map((c, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                            <td style={{ padding: '12px 0', fontWeight: 700, color: '#0f172a' }}>{c.client}</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: '#475569' }}>${c.total.toLocaleString()}</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 800, color: '#dc2626' }}>${c.plus90.toLocaleString()}</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>{totalPendiente > 0 ? ((c.total / totalPendiente) * 100).toFixed(1) : 0}%</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>{c.lastPayment ? new Date(c.lastPayment).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      style={{ width: '100%', padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      onClick={() => setActiveTab('Cartera')}
                    >
                      Ver cartera completa <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Indicadores de Liquidez */}
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: '#1e293b', fontWeight: 800 }}>Indicadores de Liquidez</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Cartera Total</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', display: 'block', marginBottom: '8px' }}>${(totalCartera / 1000).toFixed(0)}k</span>
                        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}><ArrowUpRight size={10} style={{ display: 'inline' }} /> 12% vs. mes anterior</span>
                      </div>
                      <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Cartera Vencida</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b91c1c', display: 'block', marginBottom: '8px' }}>${(totalPendiente / 1000).toFixed(0)}k</span>
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}><ArrowUpRight size={10} style={{ display: 'inline' }} /> 18% vs. mes anterior</span>
                      </div>
                      <div style={{ background: '#fff1f2', padding: '16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '8px' }}>% Cartera Vencida</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', display: 'block', marginBottom: '8px' }}>{totalCartera > 0 ? Math.round((totalPendiente / totalCartera) * 100) : 0}%</span>
                        <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700 }}><ArrowUpRight size={10} style={{ display: 'inline' }} /> 4 pp vs. mes anterior</span>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Días Máx. Vencimiento</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', display: 'block', marginBottom: '8px' }}>{carteraPendiente.length > 0 ? Math.max(...carteraPendiente.map(c => Math.floor((now - new Date(c.createdAt)) / (1000 * 60 * 60 * 24)))) : 0} días</span>
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}><ArrowUpRight size={10} style={{ display: 'inline' }} /> 22 días vs. mes anterior</span>
                      </div>
                    </div>

                    <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#475569', fontWeight: 700 }}>Antigüedad de Saldos (días)</h4>
                    <div style={{ width: '100%', height: '16px', borderRadius: '8px', overflow: 'hidden', display: 'flex', marginBottom: '12px' }}>
                      <div style={{ width: `${pct30}%`, background: '#10b981', height: '100%' }}></div>
                      <div style={{ width: `${pct60}%`, background: '#f59e0b', height: '100%' }}></div>
                      <div style={{ width: `${pct90}%`, background: '#f97316', height: '100%' }}></div>
                      <div style={{ width: `${pct90Plus}%`, background: '#ef4444', height: '100%' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <div style={{ flex: 1, paddingRight: '10px' }}><span style={{ fontWeight: 800, color: '#0f172a' }}>0 - 30 días</span><br /><span style={{ color: '#64748b' }}>${age30.toLocaleString()} ({pct30}%)</span></div>
                      <div style={{ flex: 1, paddingRight: '10px' }}><span style={{ fontWeight: 800, color: '#0f172a' }}>31 - 60 días</span><br /><span style={{ color: '#64748b' }}>${age60.toLocaleString()} ({pct60}%)</span></div>
                      <div style={{ flex: 1, paddingRight: '10px' }}><span style={{ fontWeight: 800, color: '#0f172a' }}>61 - 90 días</span><br /><span style={{ color: '#64748b' }}>${age90.toLocaleString()} ({pct90}%)</span></div>
                      <div style={{ flex: 1 }}><span style={{ fontWeight: 800, color: '#0f172a' }}>+90 días</span><br /><span style={{ color: '#64748b' }}>${age90Plus.toLocaleString()} ({pct90Plus}%)</span></div>
                    </div>

                    <button
                      style={{ width: '100%', padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      onClick={() => setShowLiquidityModal(true)}
                    >
                      Ver análisis detallado <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {showLiquidityModal && (
                  <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="modal-content" style={{ maxWidth: '800px', width: '90%', borderRadius: '24px', padding: '32px', background: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px' }}>
                            <BarChart2 size={24} color="#3b82f6" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Análisis Profundo de Liquidez</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>Desglose técnico y proyección de cobranza.</p>
                          </div>
                        </div>
                        <button onClick={() => setShowLiquidityModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: '#64748b' }}>
                          <X size={20} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                          <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#1e293b' }}>Entendiendo el DSO</h4>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                            El <strong>Days Sales Outstanding (DSO)</strong> mide el tiempo promedio que tarda la empresa en cobrar sus facturas.
                            Actualmente es de <span style={{ color: '#3b82f6', fontWeight: 800 }}>{dso} días</span>.
                          </p>
                          <div style={{ marginTop: '16px', padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            <span style={{ color: '#0f172a', fontWeight: 800 }}>Fórmula:</span> (Cartera Pendiente / Ventas Totales) * 365
                          </div>
                        </div>
                        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                          <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#166534' }}>Proyección de Cobro</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ color: '#166534', fontWeight: 600 }}>Recuperable (0-30d)</span>
                              <span style={{ fontWeight: 800 }}>${age30.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ color: '#854d0e', fontWeight: 600 }}>En Riesgo (31-90d)</span>
                              <span style={{ fontWeight: 800 }}>${(age60 + age90).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ color: '#991b1b', fontWeight: 600 }}>Crítico (+90d)</span>
                              <span style={{ fontWeight: 800 }}>${age90Plus.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>Facturas de Mayor Exposición</h4>
                      <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                          <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                              <th style={{ padding: '12px' }}>Cliente</th>
                              <th style={{ padding: '12px' }}>Antigüedad</th>
                              <th style={{ padding: '12px', textAlign: 'right' }}>Monto</th>
                              <th style={{ padding: '12px', textAlign: 'center' }}>Riesgo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {carteraPendiente.sort((a, b) => b.amount - a.amount).slice(0, 10).map((c, i) => {
                              const isCritical = c.ageGroup === '+90';
                              return (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{c.client}</td>
                                  <td style={{ padding: '12px', color: '#64748b' }}>{c.ageGroup} días</td>
                                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>${c.amount.toLocaleString()}</td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, background: isCritical ? '#fef2f2' : '#f0fdf4', color: isCritical ? '#ef4444' : '#16a34a' }}>
                                      {isCritical ? 'CRÍTICO' : 'ESTÁNDAR'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                        <button onClick={() => setShowLiquidityModal(false)} style={{ flex: 1, background: '#0f172a', borderRadius: '12px', padding: '14px', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
                          Cerrar Análisis
                        </button>
                        <button onClick={() => alert('Generando reporte detallado...')} style={{ flex: 1, borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }}>
                          <Download size={18} /> Descargar Reporte
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {activeTab === 'Backorders y Operación' && (() => {
          const totalBackordersCantidad = backorders.reduce((sum, b) => sum + (b.cantidad || 0), 0);
          const totalBackordersPendiente = backorders.reduce((sum, b) => sum + (b.pendiente || 0), 0);
          const tasaCumplimiento = totalBackordersCantidad > 0 ? Math.round(((totalBackordersCantidad - totalBackordersPendiente) / totalBackordersCantidad) * 100) : 100;

          const productosEnBackorder = {};
          backorders.forEach(b => {
            if (b.pendiente > 0) {
              if (!productosEnBackorder[b.producto]) productosEnBackorder[b.producto] = 0;
              productosEnBackorder[b.producto] += (b.pendiente || 0);
            }
          });
          const topBackorderProduct = Object.entries(productosEnBackorder).sort((a, b) => b[1] - a[1])[0] || ['Ninguno', 0];

          const productosCriticos = products.filter(p => p.quantity < (p.minStock || 10)).length;
          const productosSinStock = products.filter(p => p.quantity === 0).length;
          const valorInventario = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.cost || 0)), 0);
          const totalProducts = products.length;

          // Categorías para el inventario
          const categories = [...new Set(products.map(p => p.category || 'General'))];
          const inventoryByCategory = categories.map(cat => {
            const catProds = products.filter(p => (p.category || 'General') === cat);
            const value = catProds.reduce((sum, p) => sum + ((p.quantity || 0) * (p.cost || 0)), 0);
            return { name: cat, value };
          }).sort((a, b) => b.value - a.value).slice(0, 4);

          const totalInvValue = inventoryByCategory.reduce((s, c) => s + c.value, 0) || 1;

          // Clasificación de Backorders basado en fechaEntrega
          const backordersPendientes = backorders.filter(b => b.pendiente > 0);
          
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          const manana = new Date(hoy);
          manana.setDate(manana.getDate() + 1);

          let criticos = 0; let riesgo = 0; let tiempo = 0;

          backordersPendientes.forEach(b => {
            if (!b.fechaEntrega) { tiempo++; return; }
            const fechaD = new Date(b.fechaEntrega);
            fechaD.setHours(0,0,0,0);
            if (fechaD < hoy) { criticos++; }
            else if (fechaD.getTime() === hoy.getTime() || fechaD.getTime() === manana.getTime()) { riesgo++; }
            else { tiempo++; }
          });
          
          // Calcular atraso promedio para el producto topBackorderProduct
          const topProductBackorders = backordersPendientes.filter(b => b.producto === topBackorderProduct[0]);
          let totalDiasAtrasoTop = 0; let topAtrasadosCount = 0;
          topProductBackorders.forEach(b => {
            if (!b.fechaEntrega) return;
            const fechaD = new Date(b.fechaEntrega);
            fechaD.setHours(0,0,0,0);
            if (fechaD < hoy) {
              const diffTime = Math.abs(hoy - fechaD);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              totalDiasAtrasoTop += diffDays;
              topAtrasadosCount++;
            }
          });
          const atrasoPromedioTop = topAtrasadosCount > 0 ? Math.round(totalDiasAtrasoTop / topAtrasadosCount) : 0;

          const donutData = [
            { label: 'Críticos', value: backordersPendientes.length > 0 ? Math.round((criticos / backordersPendientes.length) * 100) : 0, color: '#ef4444' },
            { label: 'En riesgo', value: backordersPendientes.length > 0 ? Math.round((riesgo / backordersPendientes.length) * 100) : 0, color: '#f59e0b' },
            { label: 'En tiempo', value: backordersPendientes.length > 0 ? Math.round((tiempo / backordersPendientes.length) * 100) : 0, color: '#22c55e' }
          ];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>

              {/* HEADER E INFO */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '16px' }}>
                    <Package size={28} color="#dc2626" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Backorders y Operación</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>Monitorea el cumplimiento de pedidos, backorders y nivel de inventario.</p>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} /> Última actualización: Hoy, {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* BANNER DE ATENCIÓN REQUERIDA */}
              <div style={{ background: '#fff', borderRadius: '24px', padding: '20px 32px', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle size={24} color="#dc2626" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991b1b' }}>Atención requerida</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#dc2626', fontWeight: 500 }}>Tienes pedidos atrasados y productos pendientes por surtir.</p>
                    </div>
                  </div>
                  <div style={{ width: '1px', height: '40px', background: '#fecaca' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: '#fef2f2', borderRadius: '10px' }}><Package size={18} color="#dc2626" /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{backordersPendientes.length}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>PEDIDOS ATRASADOS</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: '#fff1f2', borderRadius: '10px' }}><AlertCircle size={18} color="#e11d48" /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{productosSinStock}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>PRODUCTOS SIN STOCK</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPriorityModal(true)}
                  style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Análisis de Prioridad <ChevronRight size={18} />
                </button>
              </div>

              {/* KPI CARDS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>

                {/* 1. Tasa de Cumplimiento */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Tasa de Cumplimiento</h4>
                    <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '8px' }}><Check size={16} color="#16a34a" /></div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>{tasaCumplimiento}%</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Meta: 95%</p>
                  </div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ width: `${tasaCumplimiento}%`, height: '100%', background: '#16a34a', borderRadius: '3px' }}></div>
                  </div>
                  <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '12px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>
                    {tasaCumplimiento - 95}% vs objetivo
                  </div>
                </div>

                {/* 2. Donut Backorders */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Pedidos Pendientes</h4>
                    <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '8px' }}><Clock size={16} color="#3b82f6" /></div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '100px' }}>
                      <DonutChart data={donutData} size={100} strokeWidth={18} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Críticos</span>
                        <span style={{ fontWeight: 800, color: '#ef4444' }}>{criticos}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>En riesgo</span>
                        <span style={{ fontWeight: 800, color: '#f59e0b' }}>{riesgo}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>En tiempo</span>
                        <span style={{ fontWeight: 800, color: '#22c55e' }}>{tiempo}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('Backorders')}
                    style={{ marginTop: 'auto', background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textAlign: 'right', padding: '8px 0' }}>
                    Ver todos los pedidos {'>'}
                  </button>
                </div>

                {/* 3. Producto Crítico */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Producto Más Pendiente</h4>
                    <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '8px' }}><AlertTriangle size={16} color="#dc2626" /></div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}>{topBackorderProduct[0]}</h5>
                    <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.9rem' }}>{topBackorderProduct[1]} unidades pendientes</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>PEDIDOS</span>
                      <span style={{ fontSize: '1rem', fontWeight: 800 }}>{backordersPendientes.filter(b => b.producto === topBackorderProduct[0]).length}</span>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>ATRASO PROMEDIO</span>
                      <span style={{ fontSize: '1rem', fontWeight: 800 }}>{atrasoPromedioTop} días</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedProductBackorder(topBackorderProduct[0])}
                      style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      Detalle de pedidos
                    </button>
                    <button
                      onClick={() => onNavigate('Inventario')}
                      style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                      Reabastecer
                    </button>
                  </div>
                </div>

                {/* 4. Stock Crítico */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>Stock Crítico</h4>
                    <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '8px' }}><Package size={16} color="#16a34a" /></div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>{Math.max(productosCriticos, productosSinStock)}</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>productos en alerta</p>
                  </div>
                  <div style={{ marginTop: 'auto', padding: '12px', background: (productosCriticos > 0 || productosSinStock > 0) ? '#fffbeb' : '#f0fdf4', borderRadius: '12px', color: (productosCriticos > 0 || productosSinStock > 0) ? '#d97706' : '#16a34a', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {(productosCriticos > 0 || productosSinStock > 0) ? <AlertTriangle size={14} /> : <Check size={14} />}
                    {(productosCriticos > 0 || productosSinStock > 0) ? `Revisar ${productosSinStock} agotados y ${productosCriticos} bajos` : 'Sin riesgo de desabasto'}
                  </div>
                </div>

              </div>

              {/* BOTTOM SECTION: BACKORDERS & INVENTARIO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr', gap: '24px' }}>

                {/* BACKORDERS RECIENTES */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Backorders Recientes</h4>
                  <div style={{ flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                          <th style={{ padding: '12px 8px', fontWeight: 700 }}>Pedido</th>
                          <th style={{ padding: '12px 8px', fontWeight: 700 }}>Cliente</th>
                          <th style={{ padding: '12px 8px', fontWeight: 700 }}>Producto</th>
                          <th style={{ padding: '12px 8px', fontWeight: 700, textAlign: 'right' }}>Cant.</th>
                          <th style={{ padding: '12px 8px', fontWeight: 700, textAlign: 'center' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backordersPendientes.slice(0, 5).map((b, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '12px 8px', fontWeight: 800, color: '#2563eb' }}>#{b.documento || b.id}</td>
                            <td style={{ padding: '12px 8px', fontWeight: 700, color: '#1e293b' }}>{b.cliente || '---'}</td>
                            <td style={{ padding: '12px 8px', color: '#64748b' }}>{b.producto}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 800 }}>{b.pendiente}</td>
                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeliver(b)}
                                style={{ background: '#f0fdf4', color: '#16a34a', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Check size={14} /> ENTREGAR
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* INVENTARIO ANALYTICS */}
                <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 24px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Inventario</h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Valor del Inventario</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>${Math.round(valorInventario / 1000)}k</span>
                      <Sparkline color="#22c55e" />
                    </div>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Productos Activos</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{totalProducts}</span>
                      <Sparkline color="#3b82f6" />
                    </div>
                  </div>

                  <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', marginBottom: '16px' }}>Distribución del Inventario por Categoría</h5>
                  <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', display: 'flex', marginBottom: '24px' }}>
                    {inventoryByCategory.map((c, i) => {
                      const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7'];
                      return <div key={i} style={{ width: `${(c.value / totalInvValue) * 100}%`, background: colors[i], height: '100%' }}></div>
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {inventoryByCategory.map((c, i) => {
                      const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7'];
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i] }}></div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700 }}>
                              <span>{c.name}</span>
                              <span>{Math.round((c.value / totalInvValue) * 100)}%</span>
                            </div>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>${Math.round(c.value / 1000)}k valor</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ACCIONES RÁPIDAS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Acciones Rápidas</h4>
                  {[
                    { icon: Package, label: 'Gestión Completa de Pedidos', color: '#eff6ff', textColor: '#2563eb', onClick: () => onNavigate('Backorders') },
                    { icon: Briefcase, label: 'Control de Stock Crítico', color: '#f0fdf4', textColor: '#16a34a', onClick: () => onNavigate('Inventario') },
                    { icon: FileCheck2, label: 'Nueva Orden de Compra', color: '#f5f3ff', textColor: '#7c3aed', onClick: () => onNavigate('Cotizador') }
                  ].map((act, i) => {
                    const Icon = act.icon;
                    return (
                      <div
                        key={i}
                        onClick={act.onClick}
                        style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = act.textColor; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      >
                        <div style={{ background: act.color, padding: '10px', borderRadius: '12px' }}><Icon size={18} color={act.textColor} /></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', flex: 1 }}>{act.label}</span>
                        <ChevronRight size={16} color="#cbd5e1" />
                      </div>
                    );
                  })}

                  <div style={{ marginTop: 'auto', background: '#f8fafc', borderRadius: '20px', padding: '24px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><Calendar size={20} color="#64748b" /></div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Próxima revisión sugerida</span>
                    <span style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>02 Jun 2025</span>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>En 2 días</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}



        {/* Global Master Graph Panel */}
        {activeTab === 'General' && (() => {
          return (
            <div style={{ background: '#fff', borderRadius: '24px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>Espectro de Rendimiento Anual</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Comparativa dinámica de Representantes vs Presupuesto en miles de MXN.</p>
                </div>
                {/* Visual Legend Tags */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', padding: '6px 12px', borderRadius: '20px', border: '1px solid #bfdbfe' }}><div style={{ width: '12px', height: '12px', background: 'linear-gradient(to top, #60a5fa, #93c5fd)', borderRadius: '4px' }}></div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>Presupuesto (Meta)</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', padding: '6px 12px', borderRadius: '20px', border: '1px solid #bbf7d0' }}><div style={{ width: '12px', height: '12px', background: 'linear-gradient(to top, #4ade80, #86efac)', borderRadius: '4px' }}></div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Ingreso Cerrado (Real)</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fffbeb', padding: '6px 12px', borderRadius: '20px', border: '1px solid #fde68a' }}><div style={{ width: '12px', height: '12px', background: 'linear-gradient(to top, #fcd34d, #fde047)', borderRadius: '4px' }}></div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Pipeline (En Proceso)</span></div>
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, visibleSellers.length)}, minmax(80px, 1fr))`, gap: '30px', alignItems: 'flex-end', height: '350px', paddingBottom: '40px', paddingLeft: '70px', position: 'relative'
              }}>
                {/* Dynamic Gridlines */}
                {[1, 0.8, 0.6, 0.4, 0.2, 0].map(ratio => (
                  <div key={ratio} style={{ position: 'absolute', width: '100%', height: '1px', background: ratio === 0 ? '#cbd5e1' : '#f1f5f9', bottom: `${ratio * 100}%`, left: 0, zIndex: 0 }}>
                    <span style={{ position: 'absolute', left: '-10px', transform: 'translate(-100%, -50%)', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>
                      ${Math.round((globalMaxVal * ratio) / 1000)}k
                    </span>
                  </div>
                ))}

                {/* Glowing Bar Elements */}
                {visibleSellers.map((s, idx) => {
                  const budgetRatio = s.budget > 0 ? (s.budget / globalMaxVal) * 100 : 0;
                  const realRatio = (s.sales || 0) / globalMaxVal * 100;
                  const estRatio = (s.estimadas || 0) / globalMaxVal * 100;
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '10px', height: '100%', zIndex: 1, position: 'relative' }}>
                      {/* Meta Solid Bar */}
                      <div style={{
                        width: '24px', height: animate ? `${budgetRatio}%` : '0%', background: 'linear-gradient(to top, #60a5fa, #93c5fd)',
                        borderTopLeftRadius: '6px', borderTopRightRadius: '6px', position: 'relative', transition: 'height 1s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: '0 8px 20px 0 rgba(96, 165, 250, 0.35)'
                      }} title={`Meta Exigida: ${(s.budget || 0).toLocaleString('es-MX')}`}>
                      </div>

                      {/* Stacked Growth Bar (Sales + Pipeline) */}
                      <div style={{ width: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                        <div style={{ width: '100%', height: animate ? `${estRatio}%` : '0%', background: 'linear-gradient(to top, #fcd34d, #fde047)', transition: 'height 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', border: estRatio > 0 ? '1px solid #fde047' : 'none', borderBottom: 'none' }} title={`En Negociación (Pipeline): ${(s.estimadas || 0).toLocaleString('es-MX')}`}></div>
                        <div style={{ width: '100%', height: animate ? `${realRatio}%` : '0%', background: 'linear-gradient(to top, #4ade80, #86efac)', borderTopLeftRadius: estRatio === 0 ? '6px' : '0', borderTopRightRadius: estRatio === 0 ? '6px' : '0', transition: 'height 1s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: '0 8px 20px 0 rgba(74, 222, 128, 0.35)' }} title={`Ventas Consolidadas: ${(s.sales || 0).toLocaleString('es-MX')}`}></div>
                      </div>

                      <div style={{ position: 'absolute', bottom: '-35px', textAlign: 'center', width: '100%' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{s.name.split(' ')[0]}</span>
                        {s.progress >= 100 && <div style={{ fontSize: '1rem', marginTop: '4px' }}>⭐</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          );
        })()}

        {activeTab === 'Desempeño Individual' && (() => {
          return (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: '#eef2ff', padding: '10px', borderRadius: '12px' }}>
                  <Users size={24} color="#4f46e5" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Perfiles Individuales de Desempeño</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>Resumen del desempeño vs objetivo, pronóstico y principales indicadores.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
                  {visibleSellers.map((s, idx) => {
                    const rank = rankedSellers.findIndex(rs => rs.id === s.id) + 1;
                    const isExcellent = s.progress >= 85;
                    const isOnTrack = s.progress >= 50 && s.progress < 85;
                    const isAtRisk = s.progress < 50;
                    const statusColor = isExcellent ? '#22c55e' : (isOnTrack ? '#3b82f6' : '#f59e0b');
                    const statusBg = isExcellent ? '#f0fdf4' : (isOnTrack ? '#eff6ff' : '#fffbeb');
                    const statusText = isExcellent ? 'Excelente' : (isOnTrack ? 'En buen camino' : 'En riesgo');
                    const sellerProspects = (prospects || []).filter(p => (p.seller === s.name || p.sellerId === s.id));
                    const salesCount = sellerProspects.filter(p => p.stage === 'Venta Cerrada').length;
                    const negotiationsCount = sellerProspects.filter(p => p.stage !== 'Venta Cerrada' && p.stage !== 'Perdido').length;
                    const conversionRate = (salesCount + sellerProspects.filter(p => p.stage === 'Perdido').length) > 0 ? Math.round((salesCount / (salesCount + sellerProspects.filter(p => p.stage === 'Perdido').length)) * 100) : 0;
                    const avgTicket = salesCount > 0 ? (s.sales / salesCount) : 0;

                    return (
                      <div key={idx} style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `linear-gradient(135deg, ${statusColor}, ${statusColor}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{s.name}</h4>
                              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Briefcase size={12} /> Vendedor Oficial • AgriFlow
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fffbeb', border: '1px solid #fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#d97706' }}>{rank}</div>
                            <div style={{ background: statusBg, color: statusColor, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, border: `1px solid ${statusColor}22` }}>{statusText}</div>
                          </div>
                        </div>

                        {/* 2. Main Stats Area */}
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '24px', alignItems: 'center' }}>
                          <CircularProgress real={s.progress} estimated={Math.max(0, s.estimatedProgress - s.progress)} size={110} strokeWidth={12} />

                          <div>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '4px' }}>Acumulado Real</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>${(s.sales || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h3>
                          </div>

                          <div>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '4px' }}>Pronóstico (Pipeline)</p>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a', margin: 0 }}>${(s.estimadas || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h3>
                            <p style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <ArrowUpRight size={10} /> 12.4% <span style={{ color: '#94a3b8', fontWeight: 600 }}>vs mes ant.</span>
                            </p>
                          </div>
                        </div>

                        {/* 3. Progress and Trend Area */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>OBJETIVO ANUAL (PRESUPUESTO)</span>
                            </div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>${(s.budget || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h4>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                              <div style={{ width: `${Math.min(s.progress, 100)}%`, height: '100%', background: statusColor, borderRadius: '4px', transition: 'width 1s ease-out' }}></div>
                            </div>
                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'right', marginTop: '4px', fontWeight: 600 }}>{s.progress}% completado</p>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '8px' }}>TREND (ÚLTIMOS 6 MESES)</span>
                            <div style={{ height: '50px' }}>
                              <Sparkline color={statusColor} />
                            </div>
                          </div>
                        </div>

                        {/* 4. Mini Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 4px 0' }}>Ventas Ganadas</p>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>${(s.sales / 1.1).toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h5>
                            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>↑ 18.3%</span>
                          </div>
                          <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 4px 0' }}>Negociaciones</p>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{negotiationsCount}</h5>
                            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>+ {Math.floor(negotiationsCount / 4)}</span>
                          </div>
                          <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 4px 0' }}>Conversión</p>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{conversionRate}%</h5>
                            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>↑ 6 pp</span>
                          </div>
                          <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, margin: '0 0 4px 0' }}>Ticket Promedio</p>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>${avgTicket.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h5>
                            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>↑ 6.7%</span>
                          </div>
                        </div>

                        {/* 5. Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px', marginTop: 'auto' }}>
                          <button
                            onClick={() => setOpenHistory(openHistory === s.id ? null : s.id)}
                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FileText size={16} /> Ver Historial
                          </button>
                          <button
                            onClick={() => { setEditingBudget(s.id); setBudgetVal(s.budget); }}
                            style={{ padding: '12px', borderRadius: '12px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)' }}>
                            <Target size={16} /> Ajustar Plan y Meta
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {visibleSellers.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                      <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}><TrendingUp size={32} color="#94a3b8" /></div>
                      <h3 style={{ color: '#475569', fontSize: '1.3rem', fontWeight: 700 }}>No hay metas o desempeño que visualizar aún.</h3>
                      <p style={{ color: '#94a3b8' }}>Contacta a tu administrador para que configure tus objetivos de venta.</p>
                    </div>
                  )}
                </div>

                {/* COLUMNA DERECHA: SIDEBAR DE INSIGHTS & RANKING */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* RANKING MINI */}
                  <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                      <Trophy size={20} color="#f59e0b" />
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Ranking de Desempeño</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {rankedSellers.map((rs, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: i === 0 ? '#f59e0b' : '#64748b', width: '20px' }}>{i + 1}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{rs.name}</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{rs.progress}%</span>
                            </div>
                            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${rs.progress}%`, height: '100%', background: i === 0 ? '#22c55e' : (rs.progress > 50 ? '#3b82f6' : '#f59e0b'), borderRadius: '3px' }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* INSIGHTS CLAVE */}
                  <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                      <Zap size={20} color="#3b82f6" />
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Insights Clave</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={16} color="#16a34a" /></div>
                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}><strong>{rankedSellers[0]?.name}</strong> supera su objetivo. Lleva {rankedSellers[0]?.progress}% de cumplimiento.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AlertTriangle size={16} color="#d97706" /></div>
                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}><strong>{rankedSellers[rankedSellers.length - 1]?.name}</strong> necesita apoyo. Su conversión bajó 5 pp este mes.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><TrendingUp size={16} color="#2563eb" /></div>
                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}><strong>Ticket promedio</strong> en aumento. Promedio general ↑ 7.3% vs mes anterior.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('General')}
                      style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      Ver reporte completo <ChevronRight size={16} />
                    </button>
                  </div>

                </div>
              </div>

              {/* MODAL DE EDICIÓN DE BUDGET */}
              {editingBudget && (
                <div className="modal-overlay" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
                  <div className="modal-content" style={{ maxWidth: '450px', width: '90%', borderRadius: '24px', padding: '32px', background: '#fff' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: 800 }}>Ajustar Plan y Meta</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <select value={budgetType} onChange={e => setBudgetType(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                        <option value="Semanal">Semanal</option>
                        <option value="Mensual">Mensual</option>
                        <option value="Trimestral">Trimestral</option>
                        <option value="Semestral">Semestral</option>
                        <option value="Anual">Anual</option>
                      </select>
                      <input type="number" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700 }} placeholder="Monto Meta" value={budgetVal} onChange={e => setBudgetVal(e.target.value)} />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={() => handleSaveBudget(editingBudget)} style={{ flex: 1, padding: '14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Guardar Cambios</button>
                        <button onClick={() => setEditingBudget(null)} style={{ flex: 1, padding: '14px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })()}
        {openHistory && (() => {
          const s = visibleSellers.find(sv => sv.id === openHistory);
          if (!s) return null;
          // Usar la misma lógica de filtrado que en displaySellers para consistencia
          const sellerProspects = (prospects || []).filter(p =>
            (p.seller === s.name) ||
            (p.sellerId === s.id) ||
            (sellers.length > 0 && (p.id % sellers.length) === s.id % sellers.length)
          );
          const sellerSales = (carteraList || []).filter(c =>
            (c.seller === s.name) ||
            (c.client && sellerProspects.some(p => p.name === c.client))
          );

          return (
            <div className="modal-overlay" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)' }}>
              <div className="modal-content" style={{ maxWidth: '900px', width: '95%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '32px', background: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Historial de Desempeño: {s.name}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Análisis de actividades, ventas cerradas y pipeline actual.</p>
                    </div>
                  </div>
                  <button onClick={() => setOpenHistory(null)} style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '8px' }}>PROSPECTOS ACTIVOS</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>{sellerProspects.filter(p => p.stage !== 'Venta Cerrada' && p.stage !== 'Perdido').length}</span>
                  </div>
                  <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'block', marginBottom: '8px' }}>VENTAS CERRADAS</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a' }}>{sellerProspects.filter(p => p.stage === 'Venta Cerrada').length}</span>
                  </div>
                  <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                    <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '8px' }}>TASA CONVERSIÓN</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563eb' }}>{sellerProspects.length > 0 ? Math.round((sellerProspects.filter(p => p.stage === 'Venta Cerrada').length / sellerProspects.length) * 100) : 0}%</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Actividad Reciente en Pipeline</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {sellerProspects.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No hay actividades registradas.</p>}
                      {sellerProspects.slice(0, 5).map((p, pi) => (
                        <div key={pi} style={{ padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>{p.name}</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.stage} • ${parseFloat(p.budget || 0).toLocaleString()}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                            {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '---')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Pagos y Facturación</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {sellerSales.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No hay ventas registradas aún.</p>}
                      {sellerSales.slice(0, 5).map((c, ci) => (
                        <div key={ci} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{c.client}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a' }}>${(c.amount || 0).toLocaleString()}</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.status} • {new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        {showPriorityModal && (
          <div className="modal-overlay" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)' }}>
            <div className="modal-content" style={{ maxWidth: '800px', width: '90%', maxHeight: '85vh', overflowY: 'auto', borderRadius: '24px', padding: '32px', background: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={24} color="#dc2626" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Análisis de Prioridad Operativa</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>Pedidos con más de 3 días de atraso o ruptura de stock crítica.</p>
                  </div>
                </div>
                <button onClick={() => setShowPriorityModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {backorders.filter(b => b.pendiente > 0).slice(0, 8).map((b, i) => (
                  <div key={i} style={{ padding: '16px', background: i % 2 === 0 ? '#fff' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#dc2626', fontSize: '0.8rem' }}>
                        {i + 1}
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{b.cliente || 'Cliente Genérico'}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Pedido #{b.documento || b.id} • {b.producto}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: '#dc2626' }}>{b.pendiente} pzas</span>
                        <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>CRÍTICO</span>
                      </div>
                      <button
                        onClick={() => handleDeliver(b)}
                        style={{ padding: '8px 12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}>
                        Entregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate('Backorders')} style={{ width: '100%', marginTop: '24px', padding: '16px', background: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Ir a Gestión Completa
              </button>
            </div>
          </div>
        )}

        {selectedProductBackorder && (() => {
          const productBackorders = backorders.filter(b => b.producto === selectedProductBackorder && b.pendiente > 0);
          return (
            <div className="modal-overlay" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)' }}>
              <div className="modal-content" style={{ maxWidth: '600px', width: '90%', borderRadius: '24px', padding: '32px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Detalle por Producto</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>{selectedProductBackorder}</h3>
                  </div>
                  <button onClick={() => setSelectedProductBackorder(null)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>Total Pendiente</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#991b1b' }}>{productBackorders.reduce((s, b) => s + b.pendiente, 0)} unidades</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Clientes esperando este producto:</h4>
                    {productBackorders.map((b, i) => (
                      <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{b.cliente || 'Cliente Pendiente'}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{b.pendiente} pzas</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setSelectedProductBackorder(null)} style={{ width: '100%', marginTop: '24px', padding: '14px', background: '#f1f5f9', color: '#475569', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  Cerrar
                </button>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  );
}



function VentasModule({ onBack, onNavigate, setQuotingProspect, user, backorders = [], carteraList = [], prospects = [], refreshData, initialPipelineType = 'prospects' }) {
  const isAdmin = user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'Administrador' || user?.role === 'admin';
  const [activeTab, setActiveTab] = React.useState('pipeline');
  const [pipelineType, setPipelineType] = React.useState(initialPipelineType);
  const [callingTo, setCallingTo] = React.useState(null);
  const [isCalling, setIsCalling] = React.useState(false);
  const [showNotesModal, setShowNotesModal] = React.useState(false);
  const [editingNotesFor, setEditingNotesFor] = React.useState(null);
  const [currentNotes, setCurrentNotes] = React.useState('');
  const [showAppModal, setShowAppModal] = React.useState(false);
  const [appFor, setAppFor] = React.useState(null);
  const [appForm, setAppForm] = React.useState({ date: '', hour: '10', minute: '00', period: 'AM', method: 'Presencial' });
  const [showNegotiationModal, setShowNegotiationModal] = React.useState(false);
  const [negotiatingProspect, setNegotiatingProspect] = React.useState(null);
  const [discount, setDiscount] = React.useState(0);
  const [showSaleClosureModal, setShowSaleClosureModal] = React.useState(false);
  const [closingProspect, setClosingProspect] = React.useState(null);
  const [saleClosureForm, setSaleClosureForm] = React.useState({
    finalAmount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Transferencia',
    referenceNumber: '',
    invoiceRequired: false,
    rfc: '',
    deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    deliveryType: 'Envío domicilio',
    closureNotes: ''
  });
  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const [showLostModal, setShowLostModal] = React.useState(false);
  const [showAppSuccessModal, setShowAppSuccessModal] = React.useState(false);
  const [prospectToLose, setProspectToLose] = React.useState(null);
  const [locationProspect, setLocationProspect] = React.useState(null);
  const [locationForm, setLocationForm] = React.useState({ address: '', references: '', coordinates: '' });
  const [googleLink, setGoogleLink] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  // Estados para Nuevo Prospecto
  const [showNewProspectModal, setShowNewProspectModal] = React.useState(false);
  const [newProspectForm, setNewProspectForm] = React.useState({
    name: '',
    phone: '',
    email: '',
    interest: ''
  });

  // Estados para Por Menores
  const [showPorMenoresModal, setShowPorMenoresModal] = React.useState(false);
  const [porMenoresProspect, setPorMenoresProspect] = React.useState(null);
  const [porMenoresData, setPorMenoresData] = React.useState({
    stock: false,
    transport: false,
    rfc: '',
    cfdi: 'Gastos en general',
    extra: ''
  });

  // Estados para Registro de Pago
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentProspect, setPaymentProspect] = React.useState(null);
  const [paymentData, setPaymentData] = React.useState({
    method: 'Transferencia',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    amount: ''
  });

  if (!isAdmin) {
    return (
      <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: '#fff', padding: '60px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <AlertCircle size={64} color="#dc2626" style={{ margin: '0 auto 20px auto' }} />
          <h2 style={{ color: '#0f172a', marginBottom: '8px' }}>Acceso Restringido</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Solo personal administrativo puede ver el flujo de ventas.</p>
          <button className="btn-secondary" onClick={onBack}>Regresar al Dashboard</button>
        </div>
      </div>
    );
  }

  const prospectStages = [
    { name: 'Contacto', icon: Phone, color: '#10b981' },
    { name: 'Agendar Cita', icon: Calendar, color: '#10b981' },
    { name: 'Cotizarle', icon: FileText, color: '#10b981' },
    { name: 'Negociación', icon: TrendingUp, color: '#f59e0b' },
    { name: 'Depósito (Venta)', icon: DollarSign, color: '#059669' },
    { name: 'Recibir Pedido', icon: Package, color: '#3b82f6' },
    { name: 'Venta Completada', icon: CheckCircle2, color: '#059669' },
    { name: 'Perdido', icon: ShieldAlert, color: '#ef4444' }
  ];
  
  const clientStages = [
    { name: 'Contacto', icon: Phone, color: '#10b981' },
    { name: 'Negociación', icon: FileText, color: '#10b981' },
    { name: 'Depósito (Venta)', icon: DollarSign, color: '#059669' },
    { name: 'Recibir Pedido', icon: Package, color: '#3b82f6' },
    { name: 'Por Menores', icon: ClipboardList, color: '#10b981' },
    { name: 'Venta Completada', icon: CheckCircle2, color: '#059669' },
    { name: 'Perdido', icon: ShieldAlert, color: '#ef4444' }
  ];



  const handleCreateProspect = async () => {
    if (!newProspectForm.name) {
      alert("El nombre es requerido");
      return;
    }
    try {
      const resp = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProspectForm.name,
          phone: newProspectForm.phone,
          email: newProspectForm.email,
          interest: newProspectForm.interest,
          stage: 'Contacto',
          isClient: false,
          budget: 0
        })
      });
      if (resp.ok) {
        setShowNewProspectModal(false);
        setNewProspectForm({ name: '', phone: '', email: '', interest: '' });
        if (refreshData) refreshData();
      } else {
        alert("Error al crear prospecto");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    }
  };

  const updateProspectStage = async (id, newStage, isClientValue, isConversion = false) => {
    try {
      // 1. SI PASA A RECIBIR PEDIDO U OTRAS ETAPAS AVANZADAS, ACTIVAR LOGÍSTICA E INVENTARIO
      if (['Recibir Pedido', 'Por Menores', 'Depósito (Venta)'].includes(newStage)) {
        const p = (prospects || []).find(item => item.id === id);
        if (p) {
          const draftBOs = (backorders || []).filter(bo => bo.cliente === p.name && bo.estado === 'Cotización');
          
          const targetEstado = newStage === 'Depósito (Venta)' ? 'Facturación' : 'Entrega Pendiente';
          
          if (draftBOs.length > 0) {
            for (const bo of draftBOs) {
              // A. Activar en Logística/Facturación
              await fetch(`/api/backorders/${bo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...bo, estado: targetEstado })
              });
            }
          } else {
            // Fallback: Crear backorder genérico si no había cotización previa
            await fetch('/api/backorders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cliente: p.name,
                vendedor: user?.name || 'Sistema',
                producto: p.interest || 'Pedido desde Pipeline',
                documento: `AGRO-${Date.now().toString().slice(-6)}`,
                precio: p.budget || 0,
                cantidad: 1,
                pendiente: 1,
                estado: targetEstado,
                prioridad: 'Media',
                isNewClient: !isClientValue
              })
            });
          }
        }
      }

      // 2. ACTUALIZAR LA ETAPA EN BASE DE DATOS
      const resp = await fetch(`/api/prospects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage, isClient: isClientValue })
      });

      if (resp.ok) {
        if (isConversion) alert('¡Felicidades! Se ha convertido en cliente. Búscalo ahora en la pestaña "Clientes".');
        if (refreshData) refreshData();
      } else {
        alert('Error al actualizar el registro.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el servidor.');
    }
  };

  const handleRestartPipeline = async (p) => {
    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: p.name,
          phone: p.phone,
          email: p.email,
          interest: p.interest,
          location: p.location,
          budget: p.budget,
          notes: (p.notes || '') + '\n\n[Sistema]: Pipeline reiniciado desde un negocio perdido.',
          stage: 'Contacto',
          isClient: false
        })
      });
      if (res.ok) {
        if (refreshData) refreshData();
        alert('Se ha reiniciado el pipeline. El registro anterior se conservó como Perdido en el historial.');
      } else {
        alert('Error al reiniciar pipeline.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
  };

  const moveToCartera = async (p) => {
    try {
      const resp = await fetch('/api/cartera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: p.name, seller: user.name || 'Admin', amount: p.budget || 0, ageGroup: '1-30', status: 'Pendiente' })
      });
      if (resp.ok) {
        await fetch(`/api/prospects/${p.id}`, { method: 'DELETE' });
        if (refreshData) refreshData();
        alert(`Gestión terminada: ${p.name} se movió a Cartera Vencida.`);
      } else {
        alert('Error al mover a Cartera.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotesFor) return;
    try {
      const resp = await fetch(`/api/prospects/${editingNotesFor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: currentNotes })
      });
      if (resp.ok) {
        setShowNotesModal(false);
        if (refreshData) refreshData();
      } else {
        alert('Error al guardar las notas.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
  };

  const handleCompleteSale = async () => {
    if (!closingProspect) return;
    try {
      const resp = await fetch(`/api/prospects/${closingProspect.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'Recibir Pedido',
          isClient: false,
          status: 'Ganado',
          budget: parseFloat(saleClosureForm.finalAmount) || 0,
          closureDate: saleClosureForm.date,
          paymentMethod: saleClosureForm.paymentMethod,
          referenceNumber: saleClosureForm.referenceNumber,
          invoiceRequired: saleClosureForm.invoiceRequired,
          rfc: saleClosureForm.rfc,
          deliveryDate: saleClosureForm.deliveryDate,
          deliveryType: saleClosureForm.deliveryType,
          closureNotes: saleClosureForm.closureNotes,
          lastActivity: `Venta cerrada por $${saleClosureForm.finalAmount} via ${saleClosureForm.paymentMethod} (Ref: ${saleClosureForm.referenceNumber})`
        })
      });
      if (resp.ok) {
        // AUTOMATIZACIÓN: Crear el pedido para logística automáticamente
        await fetch('/api/backorders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documento: saleClosureForm.referenceNumber || `AGRO-${Date.now().toString().slice(-6)}`,
            fecha: new Date().toISOString().split('T')[0],
            cliente: closingProspect.name,
            codigo: 'AGRO-CRM',
            producto: closingProspect.interest || 'Pedido de Venta desde CRM',
            cantidad: 1,
            pendiente: 1,
            precio: parseFloat(saleClosureForm.finalAmount) || 0,
            estado: 'Pendiente',
            isNewClient: true
          })
        });

        // Actualizar el estado de facturación/pago del backorder recién creado (se hace un fetch rápido a todos para obtener el último y actualizarlo, o el backend lo hace. Como no podemos modificar backend, enviaremos los campos en la creación aunque el backend solo lo hace en PUT. Espera, el Backend POST /api/backorders no acepta billingStatus. ¡Pero el PUT sí! 
        // Mejor hacer que el Facturación actualice billingStatus en Backorders mediante el PUT /api/backorders/:id)

        setShowSaleClosureModal(false);
        if (refreshData) refreshData();
        alert(`¡Felicidades! Venta cerrada con ${closingProspect.name}. El pedido ya fue enviado a Logística.`);
      } else {
        alert('Error al registrar la venta.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
  };
  const convertFinalToClient = async (p) => {
    try {
      const resp = await fetch(`/api/prospects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isClient: true, stage: 'Nuevo Cliente' })
      });
      if (resp.ok) {
        if (refreshData) refreshData();
        alert(`¡Felicidades! ${p.name} se ha convertido formalmente en Cliente de AgriFlow.`);
      } else { alert('Error al convertir.'); }
    } catch (e) {
      console.error(e);
      alert('Error de red.');
    }
  };

  const updateLocation = async () => {
    if (!locationProspect) return;
    try {
      const resp = await fetch(`/api/prospects/${locationProspect.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: locationForm.address,
          deliveryReferences: locationForm.references,
          coordinates: locationForm.coordinates
        })
      });
      if (resp.ok) {
        setShowLocationModal(false);
        if (refreshData) refreshData();
        alert('Ubicación de entrega guardada correctamente.');
      }
    } catch (e) { console.error(e); }
  };


  const searchLocation = async (query) => {
    if (!query || query.trim() === '') {
      alert('Por favor, ingresa una dirección para buscar.');
      return;
    }

    setIsSearching(true);
    try {
      console.log('Iniciando búsqueda para:', query);
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);

      if (!resp.ok) throw new Error('Error en la respuesta del servidor de mapas');

      const data = await resp.json();

      if (data && data.length > 0) {
        const place = data[0];
        setLocationForm(prev => ({
          ...prev,
          address: place.display_name,
          coordinates: `${place.lat}, ${place.lon}`
        }));
        // Feedback visual inmediato
        console.log('Ubicación encontrada:', place.display_name);
      } else {
        alert('No pudimos encontrar esa dirección exacta. Intenta agregando la ciudad o el código postal.');
      }
    } catch (e) {
      console.error('Error detallado en búsqueda:', e);
      alert('Hubo un problema al conectar con el servicio de mapas. Verifica tu conexión a internet.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleGoogleLinkPaste = (url) => {
    if (!url) return;
    setGoogleLink(url);

    // Regex para extraer coordenadas de URLs de Google Maps
    // Ej: .../@20.5222851,-100.8307739,15z...
    const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    if (coordsMatch) {
      const lat = coordsMatch[1];
      const lng = coordsMatch[2];
      const coords = `${lat}, ${lng}`;

      // Intentar extraer nombre del lugar si existe en la URL
      // Ej: .../place/Nombre+del+Lugar/...
      let extractedAddress = '';
      const placeMatch = url.match(/\/place\/([^\/]+)/);
      if (placeMatch) {
        extractedAddress = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      }

      setLocationForm(prev => ({
        ...prev,
        coordinates: coords,
        address: extractedAddress || prev.address
      }));

      alert('¡Ubicación detectada correctamente desde Google Maps!');
    } else if (url.includes('maps.app.goo.gl')) {
      alert('Nota: Los enlaces cortos (maps.app.goo.gl) son difíciles de leer automáticamente por seguridad. Por favor, intenta copiar el enlace largo del navegador si es posible.');
    }
  };



  const openAppointmentModal = (p) => {
    setAppFor(p);
    if (p.appointmentDate) {
      const parts = p.appointmentDate.split('T');
      const date = parts[0] || '';
      const timeStr = parts[1] || '10:00';
      const [h24, min] = timeStr.split(':');
      let h = parseInt(h24);
      const period = h >= 12 ? 'PM' : 'AM';
      if (h > 12) h -= 12;
      if (h === 0) h = 12;
      setAppForm({
        date,
        hour: String(h).padStart(2, '0'),
        minute: min,
        period,
        method: p.appointmentMethod || 'Presencial'
      });
    } else {
      setAppForm({ date: '', hour: '10', minute: '00', period: 'AM', method: 'Presencial' });
    }
    setShowAppModal(true);
  };

  const handleSaveAppointment = async () => {
    if (!appFor) return;
    if (!appForm.date) {
      alert('Por favor selecciona una fecha para la cita.');
      return;
    }
    try {
      let h24 = parseInt(appForm.hour);
      if (appForm.period === 'PM' && h24 < 12) h24 += 12;
      if (appForm.period === 'AM' && h24 === 12) h24 = 0;
      const timeStr = `${String(h24).padStart(2, '0')}:${appForm.minute}`;

      const resp = await fetch(`/api/prospects/${appFor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentDate: `${appForm.date}T${timeStr}`,
          appointmentMethod: appForm.method,
          meetingDone: false
        })
      });
      if (resp.ok) {
        setShowAppModal(false);
        if (refreshData) refreshData();
        setShowAppSuccessModal(true);
      } else {
        alert('Error al agendar la cita.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
  };

  const handleCompleteAppointment = async (p) => {
    console.log('Marcando cita como completada para:', p.name);
    try {
      const resp = await fetch(`/api/prospects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingDone: true
        })
      });
      if (resp.ok) {
        console.log('Cita marcada como completada con éxito');
        if (refreshData) await refreshData();
        alert('¡Cita completada con éxito!');
      } else {
        const errData = await resp.json();
        console.error('Error del servidor:', errData);
        alert('Error al completar la cita: ' + (errData.details || 'Error desconocido'));
      }
    } catch (e) {
      console.error('Error de red:', e);
      alert('Error de conexión al intentar completar la cita.');
    }
  };

  const updateProspectData = async (id, data) => {
    try {
      const resp = await fetch(`/api/prospects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (resp.ok && refreshData) refreshData();
    } catch (e) {
      console.error('Error updating prospect data:', e);
    }
  };

  const handleDownloadQuote = (p) => {
    generatePremiumPDF({
      logoBase64: AGRIFLOW_LOGO,
      title: "COTIZACIÓN COMERCIAL",
      filename: `AGRO-Cotizacion_${p.name.replace(/\s+/g, '_')}.pdf`,
      headerDetails: [
        { label: 'Folio:', value: '#COT-' + new Date().getTime().toString().slice(-6) },
        { label: 'Ejecutivo:', value: user?.name || 'Sistema' },
        { label: 'Fecha:', value: new Date().toLocaleDateString('es-MX') }
      ],
      cards: [
        { title: "PROSPECTO / CLIENTE", value: p.name, sub: p.phone || 'Sin teléfono' },
        { title: "CONTACTO", value: p.email || 'Sin correo', sub: "Vía de comunicación" },
        { title: "INTERÉS PRINCIPAL", value: p.interest || 'Servicios', sub: "Categoría" }
      ],
      table: {
        head: [['DESCRIPCIÓN DEL SERVICIO / PRODUCTO', 'MONEDA', 'MONTO ESTIMADO']],
        body: [
          [p.interest || 'Servicio General', 'MXN', `$${(p.budget || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}`]
        ]
      },
      summary: {
        right: [
          { label: "MONTO APROXIMADO", value: `$${(p.budget || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}`, isTotal: true, color: "#16a34a" }
        ]
      },
      bottomBlocks: [
        {
          title: 'TÉRMINOS Y CONDICIONES',
          content: "Esta cotización es una estimación preliminar y tiene una vigencia de 15 días naturales.\nLos precios y condiciones pueden variar hasta la formalización del pedido."
        }
      ]
    });
  };

  const renderKanban = () => {
    const config = pipelineType === 'prospects' ? prospectStages : clientStages;

    // Filtrar prospectos: 
    // 1. Por tipo (Prospecto vs Cliente)
    // 2. EXCLUSIÓN: Si ya tiene un backorder (pedido), lo quitamos de la etapa de 'Negociación' 
    //    porque ya se está manejando en el módulo de Facturación.
    const items = (prospects || []).filter(p => {
      const isCorrectType = !!p.isClient === (pipelineType === 'clients');
      if (!isCorrectType) return false;

      // Mostrar siempre en el Pipeline, incluso si ya tienen una cotización guardada
      return true;
    });

    return (
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '30px', minHeight: '65vh' }}>
        {config.map((stage, idx) => {
          // Lógica de mapeo para no perder datos viejos
          const stageItems = items.filter(p => {
            const currentStage = p.stage || '';

            // Si es la primera columna, atrapar todo lo que NO coincida con las demás
            if (idx === 0) {
              const otherStages = config.slice(1).map(s => s.name);
              // Si el stage es 'Contacto' o está vacío o no está en la lista de otros stages, va aquí
              return currentStage === stage.name || currentStage === 'Contacto' || currentStage === '' || !otherStages.includes(currentStage);
            }

            // Mapeo específico para etapas viejas
            if (stage.name === 'Cotizarle' && currentStage === 'Evaluación') return true;

            return currentStage === stage.name;
          });

          return (
            <div key={stage.name} style={{ minWidth: '300px', flex: 1, background: 'rgba(248, 250, 252, 0.5)', borderRadius: '24px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: stage.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => { const Icon = stage.icon; return <Icon size={16} color="white" />; })()}
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{stage.name}</h4>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', background: '#fff', padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>{stageItems.length}</span>
              </div>

              {idx === 0 && pipelineType === 'prospects' && (
                <button onClick={() => setShowNewProspectModal(true)} style={{ width: '100%', marginBottom: '16px', padding: '12px', borderRadius: '12px', border: '1.5px dashed #10b981', background: '#f0fdf4', color: '#15803d', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Plus size={16} /> Nuevo Prospecto
                </button>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {stageItems.length === 0 ? (
                  <div style={{ padding: '24px', border: '2px dashed #cbd5e1', borderRadius: '18px', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.3)' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 600 }}>Sin {pipelineType === 'clients' ? 'órdenes' : 'prospectos'} activas en esta etapa.</p>
                  </div>
                ) : (
                  stageItems.map(p => (
                    <div key={p.id} className="kanban-card" style={{ background: '#fff', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative', transition: 'transform 0.2s' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <p style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', fontSize: '0.95rem' }}>{p.name}</p>
                          {stage.name === 'Contacto' && <Phone size={14} color="#64748b" />}
                        </div>
                        {stage.name === 'Contacto' ? (
                          <p style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 700, marginTop: '4px' }}>📞 {p.phone || 'Sin teléfono'}</p>
                        ) : (
                          <>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>${(p.budget || 0).toLocaleString('es-MX')} MXN</p>
                            {p.appointmentDate && !p.meetingDone && (
                              <div style={{ position: 'relative', marginTop: '8px', padding: '12px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                                <button
                                  onClick={() => openAppointmentModal(p)}
                                  style={{ position: 'absolute', top: '8px', right: '8px', background: '#fff', border: '1px solid #dbeafe', width: '24px', height: '24px', borderRadius: '6px', color: '#1d4ed8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                  title="Reprogramar Cita"
                                >
                                  <Pencil size={10} />
                                </button>
                                <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Calendar size={12} /> {new Date(p.appointmentDate).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} • {new Date(p.appointmentDate).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: '#3b82f6', fontWeight: 600 }}>{p.appointmentMethod}</p>
                              </div>
                            )}

                          </>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {Math.floor((new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24))} días
                          </span>
                          {(p.stage !== stage.name && p.stage) && (
                            <span style={{ fontSize: '0.65rem', color: '#3b82f6', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>Prev: {p.stage}</span>
                          )}
                        </div>
                      </div>

                      {stage.name === 'Contacto' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => { setCallingTo(p); setIsCalling(true); }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}
                          >
                            <Phone size={16} fill="white" /> Contactar
                          </button>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setEditingNotesFor(p);
                                setCurrentNotes(p.notes || '');
                                setShowNotesModal(true);
                              }}
                              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Bitácora
                            </button>

                            {idx < config.length - 1 && (
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx + 1].name, p.isClient)}
                                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                              >
                                A {config[idx + 1].name}
                              </button>
                            )}
                          </div>
                        </div>
                      ) : stage.name === 'Agendar Cita' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {!p.appointmentDate && !p.meetingDone ? (
                            <button
                              onClick={() => openAppointmentModal(p)}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                              <Calendar size={16} /> Programar Reunión
                            </button>
                          ) : p.appointmentDate ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleCompleteAppointment(p)}
                                disabled={p.meetingDone}
                                style={{
                                  flex: 0.8, padding: '10px', borderRadius: '12px',
                                  border: p.meetingDone ? 'none' : '1.5px solid #93c5fd',
                                  background: p.meetingDone ? '#dcfce7' : 'transparent',
                                  color: p.meetingDone ? '#166534' : '#1d4ed8',
                                  fontWeight: 800, fontSize: '0.75rem',
                                  cursor: p.meetingDone ? 'default' : 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                              >
                                {p.meetingDone ? <Check size={20} strokeWidth={3} /> : 'Cita Completada'}
                              </button>
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx + 1].name, p.isClient)}
                                disabled={!p.meetingDone}
                                style={{
                                  flex: 1.2, padding: '10px', borderRadius: '12px', border: 'none',
                                  background: p.meetingDone ? '#0f172a' : '#e2e8f0',
                                  color: p.meetingDone ? '#fff' : '#94a3b8',
                                  fontWeight: 800, fontSize: '0.75rem',
                                  cursor: p.meetingDone ? 'pointer' : 'not-allowed',
                                  boxShadow: p.meetingDone ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none'
                                }}
                              >
                                A {config[idx + 1].name}
                              </button>
                            </div>
                          ) : (
                            <div style={{ height: 0 }} />
                          )}
                          <div style={{ display: 'flex', gap: '8px' }}>

                            <button
                              onClick={() => { setEditingNotesFor(p); setCurrentNotes(p.notes || ''); setShowNotesModal(true); }}
                              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Bitácora
                            </button>
                          </div>
                        </div>
                      ) : stage.name === 'Negociación' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <button
                            onClick={() => {
                              setNegotiatingProspect(p);
                              setDiscount(0);
                              setShowNegotiationModal(true);
                            }}
                            style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1.5px solid #3b82f6', background: 'transparent', color: '#1d4ed8', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' }}
                          >
                            <div style={{ background: '#dbeafe', padding: '5px', borderRadius: '8px', display: 'flex' }}>
                              <Settings size={14} color="#1d4ed8" />
                            </div>
                            <span>Ajustar Detalles</span>
                          </button>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <button
                              onClick={() => updateProspectStage(p.id, 'Depósito (Venta)', p.isClient)}
                              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <CheckCircle2 size={16} /> Enviar a Facturación
                            </button>

                            <div style={{ display: 'flex', gap: '6px' }}>

                              <button
                                onClick={() => {
                                  setProspectToLose(p);
                                  setShowLostModal(true);
                                }}
                                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                              >
                                ✕ Perder Negocio
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => { setEditingNotesFor(p); setCurrentNotes(p.notes || ''); setShowNotesModal(true); }}
                            style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          >
                            <MessageSquare size={14} /> Bitácora
                          </button>
                        </div>
                      ) : stage.name === 'Recibir Pedido' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setLocationProspect(p);
                              setLocationForm({ address: p.address || '', references: p.deliveryReferences || '', coordinates: p.coordinates || '' });
                              setShowLocationModal(true);
                            }}
                            style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1.5px solid #3b82f6', background: 'transparent', color: '#1d4ed8', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >
                            <div style={{ background: '#dbeafe', padding: '5px', borderRadius: '8px', display: 'flex' }}>
                              <MapPin size={14} color="#1d4ed8" />
                            </div>
                            <span>📍 Ubicación de Entrega</span>
                          </button>

                          <div style={{ display: 'flex', gap: '6px' }}>

                            <button
                              onClick={() => updateProspectStage(p.id, config[idx + 1].name, p.isClient)}
                              style={{ flex: 1, padding: '12px', borderRadius: '14px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                              <Truck size={16} /> {p.isClient ? 'A Por Menores' : 'Confirmar Entrega'}
                            </button>
                          </div>
                        </div>
                      ) : stage.name === 'Venta Completada' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '16px', border: '1px solid #10b981', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#065f46', fontWeight: 800 }}>✅ PEDIDO ENTREGADO</p>
                          </div>
                          <button
                            onClick={() => convertFinalToClient(p)}
                            style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', background: '#059669', color: '#fff', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(5, 150, 105, 0.2)' }}
                          >
                            <Users size={18} /> Convertir a Cliente
                          </button>
                        </div>
                      ) : (stage.name === 'Cotizarle' || stage.name === 'Cotización') ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                            <button
                              onClick={() => { setQuotingProspect(p); onNavigate('Cotizador', p.name, pipelineType); }}
                              style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1.5px solid #3b82f6', background: 'transparent', color: '#1d4ed8', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' }}
                            >
                              <div style={{ background: '#dbeafe', padding: '5px', borderRadius: '8px', display: 'flex' }}>
                                <FileText size={14} color="#1d4ed8" />
                              </div>
                              <span>Cotizador Profesional</span>
                            </button>
                            <p style={{ margin: '8px 0 0 0', fontSize: '0.65rem', color: '#64748b', textAlign: 'center', fontWeight: 600 }}>Cargar productos desde catálogo</p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>

                            <button
                              onClick={() => updateProspectStage(p.id, config[idx + 1].name, p.isClient)}
                              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              A {config[idx + 1]?.name}
                            </button>
                          </div>
                          <button
                            onClick={() => { setEditingNotesFor(p); setCurrentNotes(p.notes || ''); setShowNotesModal(true); }}
                            style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Bitácora
                          </button>
                        </div>
                      ) : stage.name === 'Por Menores' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(() => {
                              const myBOs = (backorders || []).filter(bo => bo.cliente === p.name && (bo.estado === 'Entrega Pendiente' || bo.estado === 'Parcial'));
                              const expandedMyBOs = expandOrderItems(myBOs);
                              const totalItems = expandedMyBOs.reduce((sum, b) => sum + (b.pedidoOri || 0), 0);
                              const missingItems = expandedMyBOs.reduce((sum, b) => sum + (b.pendiente || 0), 0);
                              const deliveredItems = totalItems - missingItems;
                              
                              if (totalItems > 0) {
                                return (
                                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>RESUMEN DE ENTREGA</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                      <div><span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>{deliveredItems}</span><br/><span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>ENTREGADOS</span></div>
                                      <div><span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f59e0b' }}>{missingItems}</span><br/><span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>FALTANTES</span></div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      ) : stage.name === 'Depósito (Venta)' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ background: '#fefce8', padding: '12px', borderRadius: '16px', border: '1px solid #fef08a', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#a16207', fontWeight: 800 }}>💰 PENDIENTE DE PAGO</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#854d0e', fontWeight: 900 }}>${(p.budget || 0).toLocaleString('es-MX')}</p>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>

                            {idx < config.length - 1 && (
                              <button
                                disabled={stage.name === 'Cita Agendada' && p.appointmentDate && new Date(p.appointmentDate) > new Date()}
                                onClick={() => updateProspectStage(p.id, config[idx + 1].name, p.isClient)}
                                style={{
                                  flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                                  background: (stage.name === 'Cita Agendada' && p.appointmentDate && new Date(p.appointmentDate) > new Date()) ? '#cbd5e1' : '#0f172a',
                                  color: '#fff', fontWeight: 700, fontSize: '0.75rem',
                                  cursor: (stage.name === 'Cita Agendada' && p.appointmentDate && new Date(p.appointmentDate) > new Date()) ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {stage.name === 'Cita Agendada' ? (p.appointmentDate && new Date(p.appointmentDate) > new Date() ? 'Esperar Cita' : 'Cita Completada') : `A ${config[idx + 1].name}`}
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => handleRestartPipeline(p)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#dcfce7', color: '#166534', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Reiniciar Pipeline
                          </button>
                          <button
                            onClick={() => { setEditingNotesFor(p); setCurrentNotes(p.notes || ''); setShowNotesModal(true); }}
                            style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Bitácora
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const pagadas = (prospects || []).filter(p => p.stage === 'Venta Completada');

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <ViewHeader 
        title="Flujos de Tráfico" 
        subtitle="Gobernanza comercial: De la primera llamada al depósito final." 
        icon={TrendingUp} 
        onBack={onBack}
      >
        <div style={{ display: 'flex', marginLeft: 'auto', background: '#fff', padding: '6px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <button onClick={() => setActiveTab('pipeline')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'pipeline' ? '#ecfdf5' : 'transparent', color: activeTab === 'pipeline' ? '#059669' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>
            Tableros (Pipelines)
          </button>
          <button onClick={() => setActiveTab('registros')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'registros' ? '#ecfdf5' : 'transparent', color: activeTab === 'registros' ? '#059669' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>
            Histórico Liquidado
          </button>
        </div>
      </ViewHeader>

      <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '32px 20px' }}>

        {activeTab === 'pipeline' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <button onClick={() => setPipelineType('prospects')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: pipelineType === 'prospects' ? '#10b981' : 'transparent', color: pipelineType === 'prospects' ? '#fff' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>Prospectos</button>
                <button onClick={() => setPipelineType('clients')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: pipelineType === 'clients' ? '#10b981' : 'transparent', color: pipelineType === 'clients' ? '#fff' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>Clientes</button>
              </div>
            </div>

            {renderKanban()}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 800, color: '#1e293b' }}>Registro Histórico de Pagos</h3>
            </div>
            <table className="data-table">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th>CLIENTE O RAZÓN SOCIAL</th>
                  <th>MONTO TOTAL</th>
                  <th>VENDEDOR ASIGNADO</th>
                  <th>ESTATUS FINAL</th>
                </tr>
              </thead>
              <tbody>
                {pagadas.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>No hay ventas liquidadas registradas.</td></tr>
                ) : pagadas.map(c => (
                  <tr key={c.id}>
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: '#0f172a' }}>{c.name}</td>
                    <td style={{ padding: '16px 24px', fontWeight: 900, fontSize: '1.1rem' }}>${(c.budget || 0).toLocaleString('es-MX')}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>{c.seller || user?.name || 'Asesor Comercial'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: '#dcfce7', color: '#166534', fontWeight: 800, fontSize: '0.75rem' }}>
                        <CheckCircle2 size={14} /> LIQUIDADO
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE NUEVO PROSPECTO */}
      {showNewProspectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#10b981' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Nuevo Prospecto</h3>
              <button onClick={() => setShowNewProspectModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Nombre completo *</label>
                <input type="text" value={newProspectForm.name} onChange={e => setNewProspectForm({ ...newProspectForm, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none' }} placeholder="Ej. Juan Pérez" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Teléfono</label>
                <input type="tel" value={newProspectForm.phone} onChange={e => setNewProspectForm({ ...newProspectForm, phone: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none' }} placeholder="Ej. 55 1234 5678" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Correo electrónico</label>
                <input type="email" value={newProspectForm.email} onChange={e => setNewProspectForm({ ...newProspectForm, email: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none' }} placeholder="Ej. juan@correo.com" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Interés o Cultivo</label>
                <input type="text" value={newProspectForm.interest} onChange={e => setNewProspectForm({ ...newProspectForm, interest: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none' }} placeholder="Ej. Fertilizante para maíz" />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleCreateProspect} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.3)' }}>
                  Crear Prospecto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE LLAMADA PROFESIONAL */}
      {isCalling && callingTo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ background: '#fff', width: '420px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>

            {/* Header del Modal */}
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Realizar Llamada</h3>
              <button onClick={() => setIsCalling(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            {/* Contenido de la llamada */}
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 12px 0' }}>Llamando a:</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>{callingTo.name}</h2>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', margin: '0 0 32px 0', fontFamily: 'monospace' }}>{callingTo.phone}</p>

              {/* Animación de Llamada */}
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 32px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#22c55e', opacity: 0.15, animation: 'pulse-call 2s infinite' }}></div>
                <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', background: '#22c55e', opacity: 0.1, animation: 'pulse-call 2s infinite 0.5s' }}></div>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 1 }}>
                  <Phone size={28} color="white" fill="white" style={{ animation: 'shake 0.5s infinite' }} />
                </div>
              </div>

              <p style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px' }}>LLAMANDO...</p>
            </div>

            {/* Acciones */}
            <div style={{ padding: '24px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setIsCalling(false)}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(239,68,68,0.2)' }}
              >
                <LogOut size={20} style={{ transform: 'rotate(180deg)' }} /> Colgar Llamada
              </button>
            </div>
          </div>

          <style>{`
            @keyframes pulse-call {
              0% { transform: scale(1); opacity: 0.5; }
              100% { transform: scale(2.5); opacity: 0; }
            }
            @keyframes shake {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(-10deg); }
              75% { transform: rotate(10deg); }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* MODAL DE NOTAS / BITÁCORA */}
      {showNotesModal && editingNotesFor && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Bitácora de Seguimiento</h3>
              <button onClick={() => setShowNotesModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>CLIENTE / PROSPECTO</p>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{editingNotesFor.name}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Acuerdos y Próximos Pasos:</label>
                <textarea
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  placeholder="Escribe aquí los compromisos, acuerdos o tareas pendientes con este cliente..."
                  style={{ width: '100%', minHeight: '180px', padding: '16px', borderRadius: '16px', border: '1,5px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#10b981'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleSaveNotes}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Guardar Bitácora
                </button>
                <button
                  onClick={() => setShowNotesModal(false)}
                  style={{ padding: '14px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Regresar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE AGENDAR CITA */}
      {showAppModal && appFor && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#3b82f6' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Agendar Reunión</h3>
              <button onClick={() => setShowAppModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>PROSPECTO</p>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{appFor.name}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Fecha</label>
                  <input type="date" value={appForm.date} onChange={e => setAppForm({ ...appForm, date: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Hora</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <select value={appForm.hour} onChange={e => setAppForm({ ...appForm, hour: e.target.value })} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', background: '#fff' }}>
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <select value={appForm.minute} onChange={e => setAppForm({ ...appForm, minute: e.target.value })} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', background: '#fff' }}>
                      {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={appForm.period} onChange={e => setAppForm({ ...appForm, period: e.target.value })} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', background: '#fff', fontWeight: 700 }}>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Medio / Lugar</label>
                <select value={appForm.method} onChange={e => setAppForm({ ...appForm, method: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', background: '#fff' }}>
                  <option value="Presencial">Presencial (Oficina / Campo)</option>
                  <option value="Zoom">Zoom / Video Llamada</option>
                  <option value="WhatsApp">WhatsApp Call</option>
                  <option value="Teléfono">Llamada Telefónica</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleSaveAppointment}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59,130,246,0.3)' }}
                >
                  Agendar y Mover
                </button>
                <button
                  onClick={() => setShowAppModal(false)}
                  style={{ padding: '14px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE POR MENORES (LOGÍSTICA Y VALIDACIÓN) */}
      {showPorMenoresModal && porMenoresProspect && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '550px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '10px' }}>
                  <FileCheck2 size={20} color="#fff" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e3a8a' }}>Logística y Validación</h3>
              </div>
              <button onClick={() => setShowPorMenoresModal(false)} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1d4ed8' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Cliente / Razón Social</p>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{porMenoresProspect.name}</p>
              </div>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={18} /> Validaciones Físicas</h4>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '12px', transition: '0.2s', boxShadow: porMenoresData.stock ? '0 0 0 2px #10b981' : 'none' }}>
                  <input type="checkbox" checked={porMenoresData.stock} onChange={e => setPorMenoresData({ ...porMenoresData, stock: e.target.checked })} style={{ width: '20px', height: '20px', accentColor: '#10b981' }} />
                  <span style={{ fontWeight: 600, color: porMenoresData.stock ? '#065f46' : '#475569' }}>Stock Físico Confirmado y Apartado</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', transition: '0.2s', boxShadow: porMenoresData.transport ? '0 0 0 2px #3b82f6' : 'none' }}>
                  <input type="checkbox" checked={porMenoresData.transport} onChange={e => setPorMenoresData({ ...porMenoresData, transport: e.target.checked })} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                  <span style={{ fontWeight: 600, color: porMenoresData.transport ? '#1d4ed8' : '#475569' }}>Transporte / Logística Coordinada</span>
                </label>
              </div>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}><Receipt size={18} /> Datos de Facturación</h4>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>RFC del Cliente</label>
                    <input type="text" value={porMenoresData.rfc} onChange={e => setPorMenoresData({ ...porMenoresData, rfc: e.target.value.toUpperCase() })} placeholder="Ej. XAXX010101000" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Uso de CFDI</label>
                    <select value={porMenoresData.cfdi} onChange={e => setPorMenoresData({ ...porMenoresData, cfdi: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, background: '#fff' }}>
                      <option value="Gastos en general">G03 - Gastos general</option>
                      <option value="Adquisición de mercancías">G01 - Adquisición</option>
                      <option value="Por definir">P01 - Por definir</option>
                    </select>
                  </div>
                </div>

                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Observaciones / Acuerdos Extra</label>
                <textarea value={porMenoresData.extra} onChange={e => setPorMenoresData({ ...porMenoresData, extra: e.target.value })} placeholder="Instrucciones especiales de entrega, horarios, etc..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 500, minHeight: '80px', resize: 'none', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={async () => {
                    const checklistText = `--- CHECKLIST DE PORMENORES ---\n[${porMenoresData.stock ? 'X' : ' '}] Stock Físico Apartado\n[${porMenoresData.transport ? 'X' : ' '}] Transporte Confirmado\n[RFC]: ${porMenoresData.rfc || 'No capturado'}\n[CFDI]: ${porMenoresData.cfdi}\n\nObservaciones Extra: ${porMenoresData.extra}`;
                    const jsonMetadata = `\nCHECKLIST_JSON:${JSON.stringify(porMenoresData)}`;
                    const finalNotes = checklistText + jsonMetadata;

                    try {
                      const resp = await fetch(`/api/prospects/${porMenoresProspect.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notes: finalNotes })
                      });
                      if (resp.ok) {
                        setShowPorMenoresModal(false);
                        if (refreshData) refreshData();
                      } else {
                        alert('Error al guardar validación');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('Error de conexión');
                    }
                  }}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#1d4ed8', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(29, 78, 216, 0.3)' }}
                >
                  Guardar Validación
                </button>
                <button
                  onClick={() => setShowPorMenoresModal(false)}
                  style={{ padding: '14px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE REGISTRO DE PAGO (DEPÓSITO) */}
      {showPaymentModal && paymentProspect && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#10b981', padding: '8px', borderRadius: '10px' }}>
                  <DollarSign size={20} color="#fff" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#064e3b' }}>Registro de Pago</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'rgba(16, 185, 129, 0.1)', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#059669' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Cobro a Cliente</p>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{paymentProspect.name}</h2>
                <div style={{ display: 'inline-block', padding: '8px 16px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#854d0e', fontWeight: 800 }}>MONTO TOTAL:</span>
                  <span style={{ fontSize: '1.3rem', color: '#a16207', fontWeight: 900, marginLeft: '8px' }}>${parseFloat(paymentData.amount).toLocaleString('es-MX')}</span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Método de Pago</label>
                    <select value={paymentData.method} onChange={e => setPaymentData({ ...paymentData, method: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, background: '#fff' }}>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Fecha de Pago</label>
                    <input type="date" value={paymentData.date} onChange={e => setPaymentData({ ...paymentData, date: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }} />
                  </div>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Número de Referencia / Folio</label>
                  <input type="text" value={paymentData.reference} onChange={e => setPaymentData({ ...paymentData, reference: e.target.value })} placeholder="Ej. 1234567890" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={async () => {
                    try {
                      const resp = await fetch('/api/cartera', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          client: paymentProspect.name,
                          seller: paymentProspect.seller || user?.name || 'Admin',
                          amount: parseFloat(paymentData.amount) || 0,
                          ageGroup: 'Liquidado',
                          status: 'Pagado'
                        })
                      });

                      if (resp.ok) {
                        // Mover el prospecto a 'Recibir Pedido'
                        await fetch(`/api/prospects/${paymentProspect.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ stage: 'Recibir Pedido' })
                        });

                        // Actualizar backorders asociados para activar Logística
                        const draftBOs = (backorders || []).filter(bo => bo.cliente === paymentProspect.name && (bo.estado === 'Cotización' || bo.estado === 'Facturación' || bo.estado === 'Pendiente'));
                        for (const bo of draftBOs) {
                          await fetch(`/api/backorders/${bo.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...bo, estado: 'Entrega Pendiente', billingStatus: 'Pagado' })
                          });
                        }

                        if (refreshData) refreshData();
                        setShowPaymentModal(false);
                        alert('¡Pago registrado exitosamente! La venta ha pasado a Logística (Recibir Pedido).');
                      } else {
                        alert('Error al registrar el pago');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('Error de red');
                    }
                  }}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <CheckCircle2 size={18} /> Confirmar y Archivar
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  style={{ padding: '14px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE NEGOCIACIÓN / AJUSTE DE DETALLES (PREMIUM REDESIGN) */}
      {showNegotiationModal && negotiatingProspect && (() => {
        const currentBackorders = backorders.filter(bo => bo.cliente === negotiatingProspect.name);
        const originalTotal = currentBackorders.reduce((sum, bo) => sum + ((bo.precio || 0) * (bo.cantidad || 0)), 0);
        const discountAmount = originalTotal * (discount / 100);
        const calculatedBudget = originalTotal - discountAmount;

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, transition: 'all 0.3s ease' }}>
            <div style={{ background: '#fff', width: '700px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column' }}>

              {/* Elegant Header */}
              <div style={{ padding: '28px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '12px' }}>
                    <TrendingUp size={24} color="#f59e0b" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Negociación y Cierre</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Ajuste de presupuesto y condiciones</p>
                  </div>
                </div>
                <button onClick={() => setShowNegotiationModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '32px', maxHeight: '75vh', overflowY: 'auto', background: '#f8fafc' }}>
                {/* Client Info Card */}
                <div style={{ marginBottom: '28px', background: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ display: 'inline-block', padding: '4px 10px', background: '#fef3c7', color: '#92400e', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, marginBottom: '8px' }}>CLIENTE SELECCIONADO</span>
                      <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>{negotiatingProspect.name}</h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CÓDIGO</span>
                      <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>#{negotiatingProspect.id.toString().slice(-6)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items Table */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Package size={20} color="#f59e0b" /> Detalle del Pedido Actual
                  </h4>
                  <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead style={{ background: '#f1f5f9' }}>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '16px 20px', color: '#475569', fontWeight: 700 }}>PRODUCTO</th>
                          <th style={{ textAlign: 'center', padding: '16px 20px', color: '#475569', fontWeight: 700 }}>CANT.</th>
                          <th style={{ textAlign: 'right', padding: '16px 20px', color: '#475569', fontWeight: 700 }}>PRECIO UNIT.</th>
                          <th style={{ textAlign: 'right', padding: '16px 20px', color: '#475569', fontWeight: 700 }}>SUBTOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBackorders.length === 0 ? (
                          <tr>
                            <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                              <div style={{ marginBottom: '12px' }}><Package size={32} opacity={0.3} /></div>
                              No hay productos registrados para este cliente. <br />
                              <button onClick={() => { setQuotingProspect(negotiatingProspect); onNavigate('Cotizador', negotiatingProspect.name, pipelineType); }} style={{ marginTop: '16px', color: '#3b82f6', border: '1px solid #3b82f6', background: 'none', fontWeight: 800, cursor: 'pointer', padding: '8px 16px', borderRadius: '10px' }}>Configurar Pedido Ahora</button>
                            </td>
                          </tr>
                        ) : (
                          currentBackorders.map((bo, idx) => (
                            <tr key={idx} style={{ borderBottom: idx === currentBackorders.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                              <td style={{ padding: '16px 20px', fontWeight: 700, color: '#1e293b' }}>{bo.producto}</td>
                              <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 600 }}>{bo.cantidad}</td>
                              <td style={{ padding: '16px 20px', textAlign: 'right', color: '#64748b' }}>${(bo.precio || 0).toLocaleString()}</td>
                              <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>${((bo.precio || 0) * (bo.cantidad || 0)).toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      {currentBackorders.length > 0 && (
                        <tfoot style={{ background: '#f8fafc', borderTop: '2px solid #f1f5f9' }}>
                          <tr>
                            <td colSpan="3" style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Subtotal de Productos</td>
                            <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>${originalTotal.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>

                {/* Negotiation & Totals Area */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                  {/* Discount Control */}
                  <div style={{ background: '#fff', padding: '24px', borderRadius: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h5 style={{ margin: '0 0 20px 0', fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={18} color="#f59e0b" /> Aplicar Descuento
                    </h5>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Porcentaje de Descuento</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', padding: '16px 45px 16px 16px', borderRadius: '16px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', transition: 'border-color 0.2s' }}
                          onFocus={e => e.target.style.borderColor = '#f59e0b'}
                          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                        <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#94a3b8', fontSize: '1.2rem' }}>%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[0, 5, 10, 15].map(val => (
                        <button
                          key={val}
                          onClick={() => setDiscount(val)}
                          style={{ flex: 1, padding: '8px', borderRadius: '10px', border: discount === val ? 'none' : '1px solid #e2e8f0', background: discount === val ? '#f59e0b' : '#fff', color: discount === val ? '#fff' : '#64748b', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Visualizer (Receipt Style) */}
                  <div style={{ background: '#0f172a', padding: '24px', borderRadius: '28px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h5 style={{ margin: '0 0 20px 0', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Resumen de Cierre</h5>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Subtotal:</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>${originalTotal.toLocaleString()}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Descuento ({discount}%):</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f87171' }}>-${discountAmount.toLocaleString()}</span>
                      </div>

                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px', borderStyle: 'dashed', borderWidth: '1px 0 0 0' }}></div>

                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '1px' }}>TOTAL NEGOCIADO</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#94a3b8' }}>$</span>
                        <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#10b981', letterSpacing: '-1px' }}>
                          {calculatedBudget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ padding: '28px 32px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '16px' }}>
                <button
                  onClick={async () => {
                    await updateProspectData(negotiatingProspect.id, { budget: calculatedBudget });
                    setShowNegotiationModal(false);
                    alert('¡Negociación finalizada y presupuesto actualizado!');
                  }}
                  style={{ flex: 1, padding: '20px', borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Confirmar y Cerrar Trato
                </button>
                <button
                  onClick={() => setShowNegotiationModal(false)}
                  style={{ padding: '20px 32px', borderRadius: '20px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
                >
                  Seguir Negociando
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE CIERRE DE VENTA (ENTERPRISE VERSION) */}
      {showSaleClosureModal && closingProspect && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '650px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column' }}>

            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '10px', borderRadius: '12px' }}>
                  <CheckCircle2 size={24} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Finalizar Transacción</h3>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase' }}>Cierre operativo de trato ganado</p>
                </div>
              </div>
              <button onClick={() => setShowSaleClosureModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '32px', background: '#f8fafc', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Left Column: Financial & Invoicing */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <h5 style={{ margin: '0 0 16px 0', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DollarSign size={16} color="#059669" /> Cierre Financiero
                    </h5>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Monto Final Acordado</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          value={saleClosureForm.finalAmount}
                          onChange={(e) => setSaleClosureForm({ ...saleClosureForm, finalAmount: e.target.value })}
                          style={{ width: '100%', padding: '14px 14px 14px 34px', borderRadius: '14px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}
                        />
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#94a3b8' }}>$</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Método</label>
                        <select
                          value={saleClosureForm.paymentMethod}
                          onChange={(e) => setSaleClosureForm({ ...saleClosureForm, paymentMethod: e.target.value })}
                          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 700, fontSize: '0.85rem', background: '#fff' }}
                        >
                          <option value="Transferencia">Transferencia</option>
                          <option value="Tarjeta">Tarjeta</option>
                          <option value="Efectivo">Efectivo</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>No. de Referencia</label>
                        <input
                          type="text"
                          placeholder="Folio / Auth"
                          value={saleClosureForm.referenceNumber}
                          onChange={(e) => setSaleClosureForm({ ...saleClosureForm, referenceNumber: e.target.value })}
                          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 700, fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Receipt size={16} color="#059669" /> Datos Fiscales
                      </h5>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={saleClosureForm.invoiceRequired}
                          onChange={(e) => setSaleClosureForm({ ...saleClosureForm, invoiceRequired: e.target.checked })}
                          style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                        />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>¿Factura?</span>
                      </label>
                    </div>

                  </div>
                </div>

                {/* Right Column: Logistics & Internal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                    <h5 style={{ margin: '0 0 16px 0', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={16} color="#059669" /> Entrega y Logística
                    </h5>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Tipo de Despacho</label>
                      <select
                        value={saleClosureForm.deliveryType}
                        onChange={(e) => setSaleClosureForm({ ...saleClosureForm, deliveryType: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 700, fontSize: '0.85rem', background: '#fff' }}
                      >
                        <option value="Envío domicilio">Envío a Domicilio</option>
                        <option value="Recolección">Recolección en Bodega</option>
                        <option value="Flete por cobrar">Flete por cobrar</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Fecha Prometida de Entrega</label>
                      <input
                        type="date"
                        value={saleClosureForm.deliveryDate}
                        onChange={(e) => setSaleClosureForm({ ...saleClosureForm, deliveryDate: e.target.value })}
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}
                      />
                    </div>
                  </div>

                  <div style={{ background: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0', flex: 1 }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClipboardList size={16} color="#059669" /> Notas de Cierre (Estrategia)
                    </h5>
                    <textarea
                      placeholder="Ej: Se cerró gracias a la garantía extendida..."
                      value={saleClosureForm.closureNotes}
                      onChange={(e) => setSaleClosureForm({ ...saleClosureForm, closureNotes: e.target.value })}
                      style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 600, fontSize: '0.85rem', resize: 'none' }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 32px', background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '16px' }}>
              <button
                onClick={handleCompleteSale}
                style={{ flex: 1, padding: '18px', borderRadius: '18px', border: 'none', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.4)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FileCheck2 size={24} /> FINALIZAR Y REGISTRAR VENTA GANADA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE UBICACIÓN Y LOGÍSTICA */}
      {showLocationModal && locationProspect && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '500px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)' }}>

            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '10px', borderRadius: '12px' }}>
                  <MapPin size={24} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Logística de Entrega</h3>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>GESTIÓN DE UBICACIÓN PARA REPARTO</p>
                </div>
              </div>
              <button onClick={() => setShowLocationModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* INTEGRACIÓN CON GOOGLE MAPS DIRECTO */}
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '28px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Maps_icon_%282015-2020%29.svg" width="20" alt="GM" />
                  Paso 1: Buscar en Google Maps
                </h4>
                <button
                  onClick={() => window.open('https://www.google.com/maps', '_blank')}
                  style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#fff', color: '#1d4ed8', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #dbeafe' }}
                >
                  <MapPin size={18} /> ABRIR GOOGLE MAPS
                </button>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>Paso 2: Pegar Enlace Compartido</h4>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Pega aquí el link de Google Maps..."
                      value={googleLink}
                      onChange={(e) => handleGoogleLinkPaste(e.target.value)}
                      style={{ width: '100%', padding: '16px 16px 16px 40px', borderRadius: '18px', border: '2px solid #bae6fd', outline: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                    />
                    <Search size={18} color="#0ea5e9" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                  <p style={{ margin: '10px 0 0 0', fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>Al pegar el link, AgriFlow extraerá Dirección y Coordenadas automáticamente.</p>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Dirección Completa (Confirmada)</label>
                <textarea
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                  placeholder="Calle, Número, Colonia, Municipio..."
                  style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 600, fontSize: '0.9rem', resize: 'none', height: '80px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Referencias (Portón, Fachada, etc.)</label>
                <input
                  type="text"
                  value={locationForm.references}
                  onChange={(e) => setLocationForm({ ...locationForm, references: e.target.value })}
                  placeholder="Ej: Portón verde frente a la escuela"
                  style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Coordenadas Google Maps (Opcional)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={locationForm.coordinates}
                    onChange={(e) => setLocationForm({ ...locationForm, coordinates: e.target.value })}
                    placeholder="20.1234, -101.5678"
                    style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                  />
                  <button
                    onClick={() => {
                      const query = locationForm.coordinates || locationForm.address;
                      if (query) window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                    }}
                    style={{ padding: '0 15px', borderRadius: '16px', border: 'none', background: '#f1f5f9', color: '#1d4ed8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Ver en Google Maps"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 32px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={updateLocation}
                style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', background: '#1d4ed8', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 6px rgba(29, 78, 216, 0.2)' }}
              >
                Guardar Información de Logística
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// 5. Módulo Prospectos
function ProspectosModule({ onBack, prospects, setProspects, refreshProspects, onNavigate, mode = 'prospects', autoEditProspectId, setAutoEditProspectId, backorders = [] }) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isNewClientWizard, setIsNewClientWizard] = useState(false);
  const [successModal, setSuccessModal] = useState({ show: false, title: '', message: '' });
  const [historyModal, setHistoryModal] = useState({ show: false, clientName: '', orders: [] });
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', interest: '', location: '', budget: '', stage: mode === 'clients' ? 'Venta Cerrada' : 'Contacto'
  });

  const displayList = (Array.isArray(prospects) ? prospects : []).filter(p =>
    mode === 'clients' ? p.isClient : !p.isClient
  );

  useEffect(() => {
    refreshProspects();

    // Cierre automático solicitado por el usuario para Rancho Las 3 Marías
    const rancho = displayList.find(p => p.name.toUpperCase().includes('RANCHO LAS 3 MARIAS'));
    if (rancho && rancho.stage === 'Negociación') {
      const closeRancho = async () => {
        try {
          // 1. Mover etapa a Cierre
          await fetch(`/api/prospects/${rancho.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...rancho, stage: 'Venta Cerrada', isClient: true })
          });

          // 2. Crear Backorder para Facturación
          await fetch('/api/backorders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cliente: rancho.name,
              producto: 'Insumos Agrícolas (Cierre Directo)',
              documento: `AGRO-${Date.now().toString().slice(-4)}`,
              precio: 120000,
              cantidad: 1,
              pendiente: 1,
              estado: 'Entrega Pendiente',
              prioridad: 'Alta'
            })
          });

          refreshProspects();
        } catch (err) { console.error('Error al cerrar trato del Rancho:', err); }
      };
      closeRancho();
    }
  }, []);

  useEffect(() => {
    if (autoEditProspectId && Array.isArray(prospects)) {
      const p = prospects.find(item => item.id === autoEditProspectId);
      if (p) {
        setEditingId(p.id);
        setIsNewClientWizard(true);
        setFormData({
          name: p.name || '',
          phone: p.phone || '',
          email: p.email || '',
          interest: p.interest || '',
          location: p.location || '',
          budget: p.budget || '',
          stage: p.stage || (mode === 'clients' ? 'Venta Cerrada' : 'Contacto')
        });
        setShowForm(true);
        if (typeof setAutoEditProspectId === 'function') {
          setAutoEditProspectId(null);
        }
      }
    }
  }, [autoEditProspectId, prospects]);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/prospects');
      const data = await res.json();
      setProspects(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/prospects/${editingId}` : '/api/prospects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget) || 0,
          isClient: mode === 'clients' || formData.stage === 'Venta Cerrada' || formData.stage === 'Venta Completada'
        })
      });

      if (res.ok) {
        const saved = await res.json();
        
        // Lógica de Automatización: Si el trato se cierra, crear automáticamente el Backorder
        if (formData.stage === 'Venta Cerrada' && (!editingId || (prospects.find(p => p.id === editingId)?.stage !== 'Venta Cerrada'))) {
          try {
            await fetch('/api/backorders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cliente: formData.name,
                producto: formData.interest || 'Pedido de Venta',
                documento: `AGRO-${Date.now().toString().slice(-4)}`,
                precio: parseFloat(formData.budget) || 0,
                cantidad: 1,
                pendiente: 1,
                estado: 'Entrega Pendiente',
                prioridad: 'Alta'
              })
            });
          } catch (backErr) {
            console.error('Error al generar backorder automático:', backErr);
          }
        }

        if (editingId) {
          setProspects((Array.isArray(prospects) ? prospects : []).map(p => p.id === editingId ? saved : p));
          if (isNewClientWizard) {
            setSuccessModal({
              show: true,
              title: '¡Operación Exitosa!',
              message: '✓ Pedido realizado e información completada.'
            });
          } else {
            closeForm();
          }
        } else {
          setProspects([saved, ...(Array.isArray(prospects) ? prospects : [])]);
          closeForm();
        }
      }
    } catch (err) { console.error(err); }
  };

  const openEdit = (prospect) => {
    setEditingId(prospect.id);
    setFormData({
      name: prospect.name || '',
      phone: prospect.phone || '',
      email: prospect.email || '',
      interest: prospect.interest || '',
      location: prospect.location || '',
      budget: prospect.budget || '',
      stage: prospect.stage || 'Contacto'
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setIsNewClientWizard(false);
    setFormData({ name: '', phone: '', email: '', interest: '', location: '', budget: '', stage: 'Contacto' });
  };

  const updateStage = async (prospect, newStage) => {
    try {
      const isClosing = newStage === 'Venta Cerrada' || newStage === 'Venta Completada';
      const res = await fetch(`/api/prospects/${prospect.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prospect,
          stage: newStage,
          isClient: isClosing || prospect.isClient
        })
      });

      if (res.ok) {
        const updated = await res.json();
        
        if (newStage === 'Venta Cerrada') {
          await fetch('/api/backorders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cliente: prospect.name,
              producto: prospect.interest || 'Pedido de Venta',
              documento: `AGRO-${Date.now().toString().slice(-4)}`,
              precio: parseFloat(prospect.budget) || 0,
              cantidad: 1,
              pendiente: 1,
              estado: 'Entrega Pendiente',
              prioridad: 'Alta'
            })
          });
        }
        
        refreshProspects();
      }
    } catch (err) { console.error('Error al actualizar etapa:', err); }
  };

  const deleteProspect = async (id) => {
    if (window.confirm('¿Eliminar este prospecto definitivamente?')) {
      try {
        const res = await fetch(`/api/prospects/${id}`, { method: 'DELETE' });
        if (res.ok) setProspects(prev => prev.filter(p => p.id !== id));
      } catch (err) { console.error(err); }
    }
  };

  const clientFinancials = mode === 'clients' ? {
    pending: displayList.filter(p => p.stage === 'Venta Cerrada').reduce((s, p) => s + (Number(p.budget) || 0), 0),
    completed: displayList.filter(p => p.stage === 'Venta Completada').reduce((s, p) => s + (Number(p.budget) || 0), 0)
  } : null;

  const pipelineValue = mode === 'prospects' ? displayList.reduce((s, p) => s + (Number(p.budget) || 0), 0) : 0;

  const stages = mode === 'clients' ? [
    { label: 'Total Clientes', count: displayList.length },
    { label: 'Cartera Pendiente', count: `$${clientFinancials.pending.toLocaleString('es-MX')}` },
    { label: 'Ingresos Realizados', count: `$${clientFinancials.completed.toLocaleString('es-MX')}` },
  ] : [
    { label: 'Total Prospectos', count: displayList.length },
    { label: 'En Negociación', count: displayList.filter(p => p.stage === 'Negociación').length },
    { label: 'Valor del Pipeline', count: `$${pipelineValue.toLocaleString('es-MX')}` },
  ];

  if (loading) return <div className="module-container" style={{ padding: '80px', textAlign: 'center' }}><h3>Cargando datos...</h3></div>;

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <ViewHeader 
        title={mode === 'clients' ? 'Clientes' : 'Prospectos'} 
        subtitle={mode === 'clients' ? 'Listado oficial de clientes' : 'Gestión del embudo de ventas'} 
        icon={mode === 'clients' ? Briefcase : Users} 
        onBack={onBack}
      >
        {!showForm && (
          <button
            className="btn-primary"
            style={{ background: '#2d5a3f', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 15px -3px rgba(45, 90, 63, 0.3)' }}
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> {mode === 'clients' ? 'Nuevo Cliente' : 'Nuevo Prospecto'}
          </button>
        )}
      </ViewHeader>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 40px' }}>
        {showForm ? (
          <div className="module-card" style={{ padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: '#0f172a' }}>
              {isNewClientWizard ? 'Información del cliente nuevo' : (editingId ? 'Editar Prospecto' : 'Nuevo Prospecto')}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div className="form-group">
                <label style={{ fontWeight: 700, color: '#475569' }}>Nombre del Cliente / Empresa</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="search-input" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px' }} required disabled={isNewClientWizard} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#475569' }}>Teléfono</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="search-input" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#475569' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="search-input" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px' }} />
                </div>
              </div>
              {!isNewClientWizard && (
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#475569' }}>Interés (Producto / Servicio)</label>
                  <input type="text" name="interest" value={formData.interest} onChange={handleInputChange} className="search-input" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px' }} required={!isNewClientWizard} />
                </div>
              )}
              <div className="form-group">
                <label style={{ fontWeight: 700, color: '#475569' }}>Ubicación</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="search-input" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px' }} />
              </div>
              {!isNewClientWizard && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ fontWeight: 700, color: '#475569' }}>Presupuesto Estimado ($)</label>
                    <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="search-input" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 700, color: '#475569' }}>Etapa Inicial</label>
                    <select name="stage" value={formData.stage} onChange={handleInputChange} className="select-input" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px' }}>
                      <option value="Contacto">Contacto</option>
                      <option value="Evaluación">Evaluación</option>
                      <option value="Negociación">Negociación</option>
                    </select>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                <button type="submit" className="btn-primary" style={{ background: '#2d5a3f', padding: '14px 28px', borderRadius: '12px', fontWeight: 700 }}>
                  {isNewClientWizard ? 'Guardar Información' : (editingId ? 'Guardar Cambios' : 'Guardar Prospecto')}
                </button>
                <button type="button" className="btn-secondary" onClick={closeForm} style={{ padding: '14px 28px', borderRadius: '12px', fontWeight: 700 }}>Cancelar</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Stages Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              {stages.map((stage, idx) => (
                <div key={idx} className="module-card" style={{ textAlign: 'center', padding: '16px', borderTop: '4px solid #10b981', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, display: 'block', marginBottom: '2px', color: '#0f172a' }}>{stage.count}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              {displayList.map((prospect) => {
                const prospectOrders = (backorders || []).filter(bo => bo.cliente === prospect.name);
                return (
                <div key={prospect.id} className="module-card" 
                  style={{ 
                    padding: '32px', 
                    background: '#fff', 
                    borderRadius: '24px', 
                    border: mode === 'clients' ? '1px solid #e2e8f0' : '1px solid #f1f5f9', 
                    position: 'relative', 
                    transition: 'all 0.3s ease', 
                    boxShadow: mode === 'clients' ? '0 10px 15px -3px rgba(0,0,0,0.03)' : '0 10px 15px -3px rgba(0,0,0,0.05)',
                    borderLeft: mode === 'clients' ? '6px solid #2d5a3f' : '6px solid #10b981'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = mode === 'clients' ? '0 10px 15px -3px rgba(0,0,0,0.03)' : '0 10px 15px -3px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ maxWidth: '100%', textAlign: 'left', paddingRight: '85px' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#0f172a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{prospect.name}</h3>
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>


                        {/* Quick Stage Actions */}
                        {!prospect.isClient ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {prospect.stage === 'Contacto' && (
                              <button onClick={() => updateStage(prospect, 'Evaluación')} style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0d9488', padding: '8px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer' }}>Evaluar →</button>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => {
                                if (typeof onNavigate === 'function') {
                                  onNavigate('productos', prospect.name);
                                }
                              }} 
                              style={{ background: '#2d5a3f', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Plus size={14} /> Nueva Orden
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '16px', right: '16px' }}>
                    <button
                      onClick={() => openEdit(prospect)}
                      style={{ padding: '8px', borderRadius: '10px', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}
                      title="Editar"
                    ><Pencil size={16} /></button>
                    <button
                      onClick={() => deleteProspect(prospect.id)}
                      style={{ padding: '8px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', cursor: 'pointer', transition: 'all 0.2s' }}
                      title="Eliminar"
                    ><Trash2 size={16} /></button>
                  </div>


                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#475569', fontSize: '0.95rem' }}>
                      <Phone size={18} color={mode === 'clients' ? '#2d5a3f' : '#10b981'} />
                      <span style={{ fontWeight: 600 }}>{prospect.phone || 'Sin teléfono'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#475569', fontSize: '0.95rem' }}>
                      <Mail size={18} color={mode === 'clients' ? '#2d5a3f' : '#10b981'} />
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{prospect.email || 'Sin correo'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#475569', fontSize: '0.95rem' }}>
                      <Package size={18} color={mode === 'clients' ? '#2d5a3f' : '#10b981'} />
                      <span style={{ fontWeight: 600 }}>{mode === 'clients' ? 'Insumos Habituales: ' : 'Interés: '} {prospect.interest}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '4px' }}>
                        {mode === 'clients' ? 'Historial de Compras' : 'Potencial de Negocio'}
                      </p>
                      <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: mode === 'clients' ? '#2d5a3f' : '#10b981', margin: 0, letterSpacing: '-0.02em' }}>
                        ${(prospect.budget || 0).toLocaleString('es-MX')}
                      </h4>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} /> {prospect.location || 'N/A'}
                    </div>
                  </div>

                  {/* Historial de Compras (Pedidos) */}
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                    <button 
                      onClick={() => setHistoryModal({ show: true, clientName: prospect.name, orders: prospectOrders })}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                    >
                      <ClipboardList size={16} /> Ver Historial de Pedidos
                    </button>
                  </div>
                </div>
              )})}
            </div>

          </>
        )}
      </div>

      {/* Modal Historial de Pedidos */}
      {historyModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Historial de Pedidos</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{historyModal.clientName}</p>
              </div>
              <button onClick={() => setHistoryModal({ show: false, clientName: '', orders: [] })} style={{ background: '#e2e8f0', border: 'none', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#cbd5e1'} onMouseLeave={e => e.currentTarget.style.background = '#e2e8f0'}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px 32px', overflowY: 'auto' }}>
              {historyModal.orders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', fontWeight: 600 }}>No hay pedidos registrados para este cliente.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {historyModal.orders.map((order, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 100px', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{order.documento}</span>
                        <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>{order.producto}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        {order.cantidad} unid. a ${(order.precio || 0).toLocaleString()}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          padding: '6px 12px', 
                          borderRadius: '12px',
                          display: 'inline-block',
                          background: order.estado === 'Entregado' ? '#dcfce7' : (order.estado === 'Cancelado' || order.estado === 'Perdido' ? '#fee2e2' : (order.estado === 'Parcial' ? '#fef3c7' : '#dbeafe')),
                          color: order.estado === 'Entregado' ? '#166534' : (order.estado === 'Cancelado' || order.estado === 'Perdido' ? '#991b1b' : (order.estado === 'Parcial' ? '#92400e' : '#1e40af')),
                          border: `1px solid ${order.estado === 'Entregado' ? '#bbf7d0' : (order.estado === 'Cancelado' || order.estado === 'Perdido' ? '#fecaca' : (order.estado === 'Parcial' ? '#fde68a' : '#bfdbfe'))}`
                        }}>
                          {order.estado || 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito Personalizado */}
      {successModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '30px',
            width: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            <div style={{
              background: '#f0fdf4',
              color: '#16a34a',
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle2 size={32} />
            </div>
            
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 850,
              color: '#0f172a',
              marginBottom: '10px',
              margin: 0
            }}>
              {successModal.title}
            </h3>
            
            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              marginBottom: '24px',
              marginTop: '10px'
            }}>
              {successModal.message}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  setSuccessModal({ show: false, title: '', message: '' });
                  closeForm();
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#2d5a3f',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// 6. Módulo de Cartera (Cuentas por Cobrar)
function CarteraModule({ onBack, backorders, refreshCartera, sellers = [] }) {
  const [searchClient, setSearchClient] = useState('');
  const [hoverSegment, setHoverSegment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cartera Vencida');
    
    worksheet.columns = [
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Vendedor', key: 'vendedor', width: 20 },
      { header: 'Folio', key: 'folio', width: 15 },
      { header: 'Monto', key: 'monto', width: 15 },
      { header: 'Antigüedad', key: 'antigüedad', width: 15 },
      { header: 'Fecha Registro', key: 'fecha', width: 20 },
    ];

    activeDebt.forEach(b => {
      worksheet.addRow({
        cliente: b.cliente,
        vendedor: b.vendedor,
        folio: b.documento,
        monto: (b.precio || 0) * (b.cantidad || 1),
        antigüedad: calculateAging(b.createdAt),
        fecha: new Date(b.createdAt).toLocaleDateString()
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `AGRO-Cartera_Vencida_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const calculateAging = (dateStr) => {
    if (!dateStr) return '1-30';
    const diffTime = Math.abs(new Date() - new Date(dateStr));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 30) return '1-30';
    if (diffDays <= 60) return '31-60';
    if (diffDays <= 90) return '61-90';
    return '+90';
  };

  const activeDebt = (backorders || [])
    .filter(b => b.billingStatus !== 'Pagado' && (b.precio || 0) > 0)
    .filter(b => b.cliente.toLowerCase().includes(searchClient.toLowerCase()));

  const totals = activeDebt.reduce((acc, b) => {
    const group = calculateAging(b.createdAt);
    const amount = (b.precio || 0) * (b.cantidad || 1);
    if (group === '1-30') acc.m1 += amount;
    else if (group === '31-60') acc.m2 += amount;
    else if (group === '61-90') acc.m3 += amount;
    else acc.m4 += amount;
    acc.total += amount;
    return acc;
  }, { m1: 0, m2: 0, m3: 0, m4: 0, total: 0 });

  const sellersDebt = activeDebt.reduce((acc, b) => {
    if (!acc[b.vendedor]) acc[b.vendedor] = { name: b.vendedor, total: 0, m4: 0 };
    const amount = (b.precio || 0) * (b.cantidad || 1);
    acc[b.vendedor].total += amount;
    if (calculateAging(b.createdAt) === '+90') acc[b.vendedor].m4 += amount;
    return acc;
  }, {});

  const sellersArray = Object.values(sellersDebt).sort((a, b) => b.total - a.total);

  useEffect(() => {
    refreshCartera();
  }, []);

  const summary = [
    { label: '1-30 días', amount: totals.m1, color: '#10b981' },
    { label: '31-60 días', amount: totals.m2, color: '#f97316' },
    { label: '61-90 días', amount: totals.m3, color: '#f87171' },
    { label: '+90 días', amount: totals.m4, color: '#ef4444' },
  ];

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      <ViewHeader 
        title="Cartera Vencida" 
        subtitle="Análisis y seguimiento de cuentas pendientes." 
        icon={AlertTriangle} 
        onBack={onBack}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 2
              }}
            />
            <div style={{ background: '#fff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontSize: '0.85rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>
              <Calendar size={16} color="#10b981" /> 
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>
          <button 
            onClick={handleExportExcel}
            style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </ViewHeader>

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 40px' }}>

        {/* Fila de Tarjetas Compactas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#10b981', borderRadius: '16px', padding: '20px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, opacity: 0.9 }}>Total Vencido</p>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '4px 0' }}>${totals.total.toLocaleString()}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', opacity: 0.8 }}>
              <CreditCard size={14} /> 100% de la deuda
            </div>
          </div>

          {summary.map((item, idx) => (
            <div key={idx} className="module-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', background: `${item.color}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {idx === 0 ? <Clock size={16} color={item.color} /> :
                    idx === 1 ? <FileText size={16} color={item.color} /> :
                      idx === 2 ? <FileWarning size={16} color={item.color} /> :
                        <FileX size={16} color={item.color} />}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{item.label}</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>${item.amount.toLocaleString()}</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>{totals.total > 0 ? Math.round((item.amount / totals.total) * 100) : 0}%</p>
            </div>
          ))}
        </div>

        {/* Sección Media Compacta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div className="module-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '20px' }}>Distribución</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  {(() => {
                    let offset = 0;
                    return summary.map((s, i) => {
                      const p = totals.total > 0 ? (s.amount / totals.total) * 100 : 0;
                      if (p === 0) return null;
                      const currentOffset = offset;
                      offset += p;
                      return <circle key={i} cx="18" cy="18" r="16" fill="none" stroke={s.color} strokeWidth="4" strokeDasharray={`${p} 100`} strokeDashoffset={`-${currentOffset}`} />;
                    });
                  })()}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>100%</p>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {summary.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }}></div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>${s.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="module-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '20px' }}>Resumen de Cobranza</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>Periodo Saludable (1-30d)</span>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#166534' }}>${totals.m1.toLocaleString()}</span>
                </div>
                <div style={{ height: '6px', background: '#dcfce7', borderRadius: '3px' }}>
                  <div style={{ width: `${totals.total > 0 ? (totals.m1 / totals.total) * 100 : 0}%`, height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
                </div>
              </div>
              <div style={{ background: '#fff1f2', padding: '16px', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 700 }}>Riesgo Crítico (+90d)</span>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#991b1b' }}>${totals.m4.toLocaleString()}</span>
                </div>
                <div style={{ height: '6px', background: '#fee2e2', borderRadius: '3px' }}>
                  <div style={{ width: `${totals.total > 0 ? (totals.m4 / totals.total) * 100 : 0}%`, height: '100%', background: '#ef4444', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fila Inferior Compacta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
          <div className="module-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Consolidado por Vendedor</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sellersArray.map((s, i) => {
                const pct = totals.total > 0 ? (s.total / totals.total) * 100 : 0;
                const barColor = pct > 30 ? '#ef4444' : pct > 15 ? '#f97316' : '#10b981';
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{s.name}</span>
                    <span style={{ fontSize: '0.85rem', textAlign: 'right', fontWeight: 700 }}>${s.total.toLocaleString()}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '15px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: barColor }}>{Math.round(pct)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="module-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Monitoreo</h3>
            <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr style={{ background: '#f8fafc', fontSize: '0.75rem' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Cliente</th>
                    <th style={{ textAlign: 'right', padding: '12px' }}>Monto</th>
                    <th style={{ textAlign: 'center', padding: '12px' }}>Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDebt.map(b => {
                    const age = calculateAging(b.createdAt);
                    const risk = age === '+90' ? { label: 'C', color: '#ef4444' } :
                      age === '61-90' ? { label: 'A', color: '#f97316' } :
                        age === '31-60' ? { label: 'M', color: '#3b82f6' } :
                          { label: 'B', color: '#10b981' };

                    return (
                      <tr key={b.id}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{b.cliente}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{b.documento}</div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '0.85rem' }}>${((b.precio || 0) * (b.cantidad || 1)).toLocaleString()}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ background: `${risk.color}15`, color: risk.color, padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900 }}>{risk.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

// 7. Módulo de Reportes

// 7. Módulo de Reportes
function ReportesModule({ onBack, sellers, carteraList, backorders, activities, prospects, products }) {
  const reports = [
    { id: 'estadocuenta', title: 'Estado de Cuenta de Cliente', desc: 'Saldos, abonos y antigüedad por cliente' },
    { id: 'rendimiento', title: 'Comisiones por Vendedor', desc: 'Ventas logradas y cálculo de comisiones' },
    { id: 'valuacion', title: 'Valuación de Inventario', desc: 'Valor total del almacén y rotación' },
    { id: 'flujo', title: 'Proyección de Flujo', desc: 'Cuentas por cobrar y prospectos por cerrar' },
    { id: 'logistica', title: 'Logística y Entregas', desc: 'Backorders y entregas pendientes' },
    { id: 'topproductos', title: 'Rentabilidad y Top Productos', desc: 'Productos estrella y utilidades' },
    { id: 'efectividadcrm', title: 'Efectividad Comercial', desc: 'Tasa de bateo y desempeño CRM' },
    { id: 'resumen', title: 'Resumen Ejecutivo', desc: 'Dashboard mensual de la empresa' },
  ];

  const generatePDF = (reportId) => {
    const now = new Date().toLocaleString('es-MX');

    if (reportId === 'estadocuenta') {
      const activeDebt = (backorders || []).filter(b => b.billingStatus !== 'Pagado' && (b.precio || 0) > 0);
      const total = activeDebt.reduce((s, b) => s + ((b.precio || 0) * (b.cantidad || 1)), 0);
      
      const calculateAging = (dateStr) => {
        if (!dateStr) return '1-30';
        const diffDays = Math.ceil(Math.abs(new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) return '1-30'; if (diffDays <= 60) return '31-60'; if (diffDays <= 90) return '61-90'; return '+90';
      };

      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "ESTADO DE CUENTA (CUENTAS POR COBRAR)",
        filename: `AGRO-EstadoCuenta_${new Date().toISOString().split('T')[0]}.pdf`,
        headerDetails: [{ label: 'Generado:', value: now }],
        cards: [
          { title: "FACTURAS VENCIDAS", value: activeDebt.length.toString(), sub: "Documentos pendientes" },
          { title: "DEUDA TOTAL", value: `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "MXN" }
        ],
        table: {
          head: [['FECHA', 'CLIENTE', 'VENDEDOR', 'ANTIGÜEDAD', 'MONTO']],
          body: activeDebt.map(b => [
            new Date(b.createdAt).toLocaleDateString(),
            b.cliente,
            b.vendedor || 'N/A',
            calculateAging(b.createdAt),
            `$${((b.precio || 0) * (b.cantidad || 1)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
          ])
        },
        summary: { right: [{ label: "SALDO TOTAL POR COBRAR", value: `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, isTotal: true, color: "#dc2626" }] }
      });
    } else if (reportId === 'rendimiento') {
      const totalSales = (sellers || []).reduce((s, x) => s + (x.sales || 0), 0);
      const totalComissions = (sellers || []).reduce((s, x) => s + ((x.sales || 0) * 0.05), 0); // 5% example
      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "RENDIMIENTO Y COMISIONES",
        filename: `AGRO-Rendimiento_${new Date().toISOString().split('T')[0]}.pdf`,
        headerDetails: [{ label: 'Generado:', value: now }],
        cards: [
          { title: "VENTAS GLOBALES", value: `$${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "MXN" },
          { title: "COMISIONES A PAGAR", value: `$${totalComissions.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Aprox (5%)" }
        ],
        table: {
          head: [['VENDEDOR', 'VENTAS LOGRADAS', 'PRESUPUESTO', 'COMISIÓN (5%)']],
          body: (sellers || []).map(s => [
            s.name,
            `$${(s.sales || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            `$${(s.budget || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            `$${((s.sales || 0) * 0.05).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
          ])
        },
        summary: { right: [{ label: "TOTAL COMISIONES", value: `$${totalComissions.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, isTotal: true, color: "#16a34a" }] }
      });
    } else if (reportId === 'valuacion') {
      const totalCost = (products || []).reduce((s, p) => s + ((p.quantity || 0) * (p.cost || p.price * 0.6 || 0)), 0);
      const totalValue = (products || []).reduce((s, p) => s + ((p.quantity || 0) * (p.price || 0)), 0);
      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "VALUACIÓN DE INVENTARIO",
        filename: `AGRO-Valuacion_${new Date().toISOString().split('T')[0]}.pdf`,
        headerDetails: [{ label: 'Generado:', value: now }],
        cards: [
          { title: "VALOR COSTO", value: `$${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Capital invertido" },
          { title: "VALOR VENTA", value: `$${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Ingreso potencial" }
        ],
        table: {
          head: [['CÓDIGO', 'PRODUCTO', 'STOCK', 'COSTO UNIT.', 'VALOR TOTAL']],
          body: (products || []).filter(p => (p.quantity || 0) > 0).map(p => [
            String(p.id).padStart(4, '0'),
            p.name,
            p.quantity.toString(),
            `$${(p.cost || p.price * 0.6 || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            `$${((p.quantity || 0) * (p.cost || p.price * 0.6 || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
          ])
        },
        summary: { right: [{ label: "VALOR TOTAL INVENTARIO", value: `$${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, isTotal: true, color: "#0f172a" }] }
      });
    } else if (reportId === 'flujo') {
      const activeDebt = (backorders || []).filter(b => b.billingStatus !== 'Pagado' && (b.precio || 0) > 0);
      const expectedInvoices = activeDebt.reduce((s, b) => s + ((b.precio || 0) * (b.cantidad || 1)), 0);
      const expectedPipeline = (prospects || []).filter(p => p.budget > 0 && !['Perdido', 'Cancelado', 'Venta Completada', 'Venta Cerrada', 'Ganado', 'Nuevo Cliente'].includes(p.stage)).reduce((s, p) => s + parseFloat(p.budget || 0), 0);
      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "PROYECCIÓN DE FLUJO DE EFECTIVO",
        filename: `AGRO-FlujoEfectivo_${new Date().toISOString().split('T')[0]}.pdf`,
        headerDetails: [{ label: 'Generado:', value: now }],
        cards: [
          { title: "POR COBRAR (FACTURADO)", value: `$${expectedInvoices.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Cartera actual" },
          { title: "POR CERRAR (PIPELINE)", value: `$${expectedPipeline.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Alta probabilidad" }
        ],
        table: {
          head: [['TIPO', 'CLIENTE / PROSPECTO', 'ESTADO', 'MONTO ESPERADO']],
          body: [
            ...activeDebt.map(b => ['Factura Vencida', b.cliente, b.documento || 'Sin folio', `$${((b.precio || 0) * (b.cantidad || 1)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`]),
            ...(prospects || []).filter(p => p.budget > 0 && !['Perdido', 'Cancelado', 'Venta Completada', 'Venta Cerrada', 'Ganado', 'Nuevo Cliente'].includes(p.stage)).map(p => ['Prospecto', p.name, p.stage, `$${parseFloat(p.budget || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`])
          ]
        },
        summary: { right: [{ label: "FLUJO DE EFECTIVO PROYECTADO", value: `$${(expectedInvoices + expectedPipeline).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, isTotal: true, color: "#16a34a" }] }
      });
    } else if (reportId === 'logistica') {
      const totalValue = (backorders || []).reduce((sum, b) => sum + ((b.precio || 0) * (b.cantidad || 0)), 0);
      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "LOGÍSTICA Y ENTREGAS (BACKORDERS)",
        filename: `AGRO-Logistica_${new Date().toISOString().split('T')[0]}.pdf`,
        headerDetails: [{ label: 'Generado:', value: now }],
        cards: [
          { title: "LÍNEAS PENDIENTES", value: backorders.length.toString(), sub: "En ruta o almacén" },
          { title: "VALOR EN RIESGO", value: `$${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Mercancía detenida" }
        ],
        table: {
          head: [['FECHA ENTREGA', 'CLIENTE', 'PRODUCTO', 'PEND.', 'ESTADO']],
          body: (backorders || []).map(b => [
            b.fechaEntrega ? new Date(b.fechaEntrega).toLocaleDateString() : 'Sin fecha',
            b.cliente,
            b.producto,
            b.pendiente.toString(),
            b.estado
          ])
        },
        summary: { right: [{ label: "VALOR DE BACKORDERS", value: `$${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, isTotal: true, color: "#d97706" }] }
      });
        } else if (reportId === 'topproductos') {
      const salesMap = {};
      (backorders || []).filter(b => b.billingStatus !== 'Cancelado').forEach(b => {
        if (!salesMap[b.producto]) salesMap[b.producto] = 0;
        salesMap[b.producto] += (b.cantidad || 0);
      });
      
      const productStats = (products || []).map(p => {
        const sold = salesMap[p.name] || 0;
        const profitPerUnit = (p.price || 0) - (p.cost || (p.price * 0.6) || 0);
        return { ...p, sold, totalProfit: sold * profitPerUnit };
      }).sort((a, b) => b.sold - a.sold).slice(0, 15);
      
      const totalUnits = productStats.reduce((s, p) => s + p.sold, 0);
      const totalGrossProfit = productStats.reduce((s, p) => s + p.totalProfit, 0);

      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "RENTABILIDAD Y TOP PRODUCTOS",
        filename: `AGRO-TopProductos_${new Date().toISOString().split('T')[0]}.pdf`,
        headerDetails: [{ label: 'Generado:', value: now }],
        cards: [
          { title: "UNIDADES VENDIDAS (TOP 15)", value: totalUnits.toString(), sub: "Artículos desplazados" },
          { title: "UTILIDAD BRUTA ESTIMADA", value: `$${totalGrossProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Margen generado" }
        ],
        table: {
          head: [['PRODUCTO', 'UNIDADES VENDIDAS', 'COSTO ESTIMADO', 'PRECIO VENTA', 'UTILIDAD GENERADA']],
          body: productStats.map(p => [
            p.name,
            p.sold.toString(),
            `$${(p.cost || p.price * 0.6 || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            `$${(p.price || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            `$${p.totalProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
          ])
        },
        summary: { right: [{ label: "UTILIDAD DEL TOP 15", value: `$${totalGrossProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, isTotal: true, color: "#16a34a" }] }
      });
    } else if (reportId === 'efectividadcrm') {
      const wonStages = ['Venta Completada', 'Venta Cerrada', 'Ganado', 'Nuevo Cliente', 'Depósito (Venta)'];
      const lostStages = ['Perdido', 'Cancelado'];
      
      const totalProspects = (prospects || []).length;
      const wonProspects = (prospects || []).filter(p => wonStages.includes(p.stage));
      const lostProspects = (prospects || []).filter(p => lostStages.includes(p.stage));
      
      const closedTotal = wonProspects.length + lostProspects.length;
      const winRate = closedTotal > 0 ? Math.round((wonProspects.length / closedTotal) * 100) : 0;
      
      const wonBudget = wonProspects.reduce((s, p) => s + parseFloat(p.budget || 0), 0);

      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "EFECTIVIDAD COMERCIAL Y CRM",
        filename: `AGRO-EfectividadCRM_${new Date().toISOString().split('T')[0]}.pdf`,
        headerDetails: [{ label: 'Generado:', value: now }],
        cards: [
          { title: "TASA DE BATEO (CIERRES)", value: `${winRate}%`, sub: `${wonProspects.length} ganados de ${closedTotal} cerrados` },
          { title: "PRESUPUESTO GANADO", value: `$${wonBudget.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Valor de negocios cerrados" }
        ],
        table: {
          head: [['PROSPECTO', 'INTERÉS', 'ETAPA', 'PRESUPUESTO', 'ESTADO']],
          body: (prospects || []).map(p => {
            let status = 'En Proceso';
            if (wonStages.includes(p.stage)) status = 'Ganado';
            if (lostStages.includes(p.stage)) status = 'Perdido';
            return [
              p.name,
              p.interest || 'General',
              p.stage,
              `$${parseFloat(p.budget || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
              status
            ];
          })
        },
        summary: { right: [{ label: "PROSPECTOS TOTALES", value: totalProspects.toString(), isTotal: true, color: "#0f172a" }] }
      });
} else if (reportId === 'resumen') {
      const totalSales = (sellers || []).reduce((s, x) => s + (x.sales || 0), 0);
      const totalDebt = (backorders || []).filter(b => b.billingStatus !== 'Pagado' && (b.precio || 0) > 0).reduce((s, b) => s + ((b.precio || 0) * (b.cantidad || 1)), 0);
      const totalCost = (products || []).reduce((s, p) => s + ((p.quantity || 0) * (p.cost || p.price * 0.6 || 0)), 0);
      generatePremiumPDF({
        logoBase64: AGRIFLOW_LOGO,
        title: "RESUMEN EJECUTIVO DIRECCIÓN",
        filename: `AGRO-ResumenEjecutivo_${new Date().toISOString().split('T')[0]}.pdf`,
        headerDetails: [{ label: 'Generado:', value: now }],
        cards: [
          { title: "VENTAS LOGRADAS", value: `$${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "YTD" },
          { title: "VALOR INVENTARIO", value: `$${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Costo total" },
          { title: "CARTERA VENCIDA", value: `$${totalDebt.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, sub: "Por recuperar" }
        ],
        table: {
          head: [['INDICADOR', 'MONTO ACTUAL', 'ESTADO']],
          body: [
            ['Total Ventas', `$${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 'OK'],
            ['Total Inventario (Costo)', `$${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 'OK'],
            ['Total Cartera Vencida', `$${totalDebt.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, totalDebt > totalSales * 0.2 ? 'RIESGO' : 'OK'],
            ['Backorders (Retrasos)', `${backorders.length} pedidos`, backorders.length > 10 ? 'ATENCIÓN' : 'OK']
          ]
        },
        summary: { right: [{ label: "ACTIVO LÍQUIDO APROX", value: `$${(totalSales + totalCost).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, isTotal: true, color: "#7e22ce" }] }
      });
    }
  };

  const generateExcel = async (reportId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte AgriFlow');

    try {
      const imageId = workbook.addImage({ base64: AGRIFLOW_LOGO, extension: 'png' });
      worksheet.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 80, height: 80 } });
    } catch (e) { }

    const reportTitles = {
      estadocuenta: 'Estado de Cuenta de Cliente',
      rendimiento: 'Comisiones por Vendedor',
      valuacion: 'Valuación y Rotación de Inventario',
      flujo: 'Proyección de Flujo de Efectivo',
      logistica: 'Reporte de Logística y Entregas',
      resumen: 'Resumen Ejecutivo'
    };

    const titleCell = worksheet.getCell('B2');
    titleCell.value = `AgriFlow Pro - ${reportTitles[reportId] || 'Reporte'}`;
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF2D5A3F' } };

    const dateCell = worksheet.getCell('B3');
    dateCell.value = `Generado el: ${new Date().toLocaleString('es-MX')}`;
    dateCell.font = { name: 'Arial', size: 10, color: { argb: 'FF666666' } };

    worksheet.getColumn(1).width = 12;
    worksheet.getColumn(2).width = 40;
    for (let i = 0; i < 6; i++) worksheet.addRow([]);

    let headers = [];
    let rows = [];
    let filename = `AGRO-Reporte_${reportId}_${new Date().toISOString().split('T')[0]}.xlsx`;

    if (reportId === 'estadocuenta') {
      const calculateAging = (dateStr) => {
        if (!dateStr) return '1-30';
        const diffDays = Math.ceil(Math.abs(new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) return '1-30'; if (diffDays <= 60) return '31-60'; if (diffDays <= 90) return '61-90'; return '+90';
      };
      const activeDebt = (backorders || []).filter(b => b.billingStatus !== 'Pagado' && (b.precio || 0) > 0);
      headers = ['Fecha', 'Cliente', 'Vendedor', 'Antigüedad', 'Monto'];
      rows = activeDebt.map(b => [new Date(b.createdAt).toLocaleDateString(), b.cliente, b.vendedor || 'N/A', calculateAging(b.createdAt), (b.precio || 0) * (b.cantidad || 1)]);
    } else if (reportId === 'rendimiento') {
      headers = ['Vendedor', 'Ventas', 'Presupuesto', 'Comisión (5%)'];
      rows = (sellers || []).map(s => [s.name, s.sales, s.budget, s.sales * 0.05]);
    } else if (reportId === 'valuacion') {
      headers = ['Código', 'Producto', 'Stock', 'Costo Unit', 'Valor Total'];
      rows = (products || []).filter(p => (p.quantity || 0) > 0).map(p => [String(p.id).padStart(4, '0'), p.name, p.quantity, (p.cost || p.price * 0.6 || 0), p.quantity * (p.cost || p.price * 0.6 || 0)]);
    } else if (reportId === 'flujo') {
      headers = ['Tipo', 'Cliente', 'Estado', 'Monto'];
      rows = [
        ...(backorders || []).filter(b => b.billingStatus !== 'Pagado' && (b.precio || 0) > 0).map(b => ['Factura Vencida', b.cliente, b.documento, (b.precio || 0) * (b.cantidad || 1)]),
        ...(prospects || []).filter(p => p.budget > 0 && !['Perdido', 'Cancelado', 'Venta Completada', 'Venta Cerrada', 'Ganado', 'Nuevo Cliente'].includes(p.stage)).map(p => ['Prospecto', p.name, p.stage, parseFloat(p.budget || 0)])
      ];
    } else if (reportId === 'logistica') {
      headers = ['Fecha Entrega', 'Cliente', 'Producto', 'Pendientes', 'Estado'];
      rows = (backorders || []).map(b => [b.fechaEntrega ? new Date(b.fechaEntrega).toLocaleDateString() : '', b.cliente, b.producto, b.pendiente, b.estado]);
        } else if (reportId === 'topproductos') {
      const salesMap = {};
      (backorders || []).filter(b => b.billingStatus !== 'Cancelado').forEach(b => {
        if (!salesMap[b.producto]) salesMap[b.producto] = 0;
        salesMap[b.producto] += (b.cantidad || 0);
      });
      const productStats = (products || []).map(p => {
        const sold = salesMap[p.name] || 0;
        const profitPerUnit = (p.price || 0) - (p.cost || (p.price * 0.6) || 0);
        return { ...p, sold, totalProfit: sold * profitPerUnit };
      }).sort((a, b) => b.sold - a.sold);
      headers = ['Producto', 'Unidades Vendidas', 'Costo Estimado', 'Precio Venta', 'Utilidad Generada'];
      rows = productStats.map(p => [p.name, p.sold, (p.cost || p.price * 0.6 || 0), (p.price || 0), p.totalProfit]);
    } else if (reportId === 'efectividadcrm') {
      const wonStages = ['Venta Completada', 'Venta Cerrada', 'Ganado', 'Nuevo Cliente', 'Depósito (Venta)'];
      const lostStages = ['Perdido', 'Cancelado'];
      headers = ['Prospecto', 'Teléfono', 'Interés', 'Etapa', 'Presupuesto', 'Estado'];
      rows = (prospects || []).map(p => {
        let status = 'En Proceso';
        if (wonStages.includes(p.stage)) status = 'Ganado';
        if (lostStages.includes(p.stage)) status = 'Perdido';
        return [p.name, p.phone || 'N/A', p.interest || 'General', p.stage, parseFloat(p.budget || 0), status];
      });
} else if (reportId === 'resumen') {
      const totalSales = (sellers || []).reduce((s, x) => s + (x.sales || 0), 0);
      const totalDebt = (backorders || []).filter(b => b.billingStatus !== 'Pagado' && (b.precio || 0) > 0).reduce((s, b) => s + ((b.precio || 0) * (b.cantidad || 1)), 0);
      const totalCost = (products || []).reduce((s, p) => s + ((p.quantity || 0) * (p.cost || p.price * 0.6 || 0)), 0);
      headers = ['Indicador', 'Monto', 'Estado'];
      rows = [
        ['Total Ventas', totalSales, 'OK'],
        ['Total Inventario (Costo)', totalCost, 'OK'],
        ['Total Cartera Vencida', totalDebt, totalDebt > totalSales * 0.2 ? 'RIESGO' : 'OK'],
        ['Backorders', backorders.length, backorders.length > 10 ? 'ATENCIÓN' : 'OK']
      ];
    }

    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D5A3F' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    });
    rows.forEach(r => worksheet.addRow(r));
    worksheet.columns.forEach(col => col.width = 25);
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };
  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
      <ViewHeader 
        title="Reportes" 
        subtitle="Exporta información detallada de tus operaciones en PDF y Excel" 
        icon={FileText} 
        onBack={onBack} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {reports.map((report, idx) => (
          <div key={idx} className="module-card" style={{ display: 'flex', gap: '20px', padding: '24px' }}>
            <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={24} color="#22c55e" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>{report.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>{report.desc}</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={async () => await generatePDF(report.id)}
                  style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#2d5a3f', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                >
                  <Download size={16} /> Descargar PDF
                </button>
                <button
                  onClick={() => generateExcel(report.id)}
                  style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#2d5a3f', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                >
                  <Download size={16} /> Descargar Excel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Módulo de Productos
function ProductosModule({ onBack, onNavigate, returnView = 'Ventas', quotingProspect, setQuotingProspect, manualClientName, setManualClientName, fechaEntrega, setFechaEntrega, cart, setCart, addToCart, removeFromCart, updateCartQty, products, setProducts, user, refreshData, prospects, backorders, editingFolio, setEditingFolio, setAutoEditProspectId }) {
  // Filtrar para mostrar solo los que ya son oficialmente Clientes (isClient === true)
  const validDropdownClients = (() => {
    const valid = (prospects || []).filter(p => {
      if (!p.name) return false;
      const nameLower = p.name.trim().toLowerCase();
      if (nameLower === 'venta directa') return false;

      return p.isClient === true;
    });

    // Quitar duplicados por nombre
    const seen = new Set();
    const unique = [];
    for (const c of valid) {
      const nameLower = c.name.trim().toLowerCase();
      if (!seen.has(nameLower)) {
        seen.add(nameLower);
        unique.push(c);
      }
    }
    return unique;
  })();

  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'confirm', // 'confirm' or 'success'
    onConfirm: null,
    showProspectsBtn: false,
    onProspectsClick: null
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);

  const showSuccessModal = (message, showProspectsBtn = false, onProspectsClick = null) => {
    setAlertModal({
      show: true,
      title: '¡Operación Exitosa!',
      message: message,
      type: 'success',
      showProspectsBtn: showProspectsBtn,
      onProspectsClick: onProspectsClick,
      onConfirm: () => {
        setQuotingProspect(null);
        setManualClientName('');
        setEditingFolio(null);
        setCart([]);
        if (typeof refreshData === 'function') refreshData(); // Forzar actualización de stock en UI
      }
    });
  };

  const handleFinalizeQuote = async () => {
    if (cart.length === 0) return;

    try {
      // 1. Determinar el Folio (Si estamos editando, usamos el anterior)
      let folio = editingFolio;
      let previousEstado = null;
      let previousIsNewClient = null;
      if (editingFolio) {
        // Encontrar los items anteriores de este folio para devolverlos al inventario si tenían cantidades pendientes
        const originalItems = backorders.filter(it => (it.documento || `AGRO-${it.id}`) === editingFolio);
        for (const it of originalItems) {
          if (it.pendiente > 0) {
            const product = products.find(p => p.name === it.producto);
            if (product) {
              await fetch(`/api/products/${product.id}/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ incrementBy: it.pendiente })
              });
            }
          }
        }
        // Encontrar el estado original y tipo de cliente del pedido antes de borrarlo
        const originalItem = originalItems[0];
        if (originalItem) {
          previousEstado = originalItem.estado;
          previousIsNewClient = originalItem.isNewClient;
        }
        // Eliminar items anteriores de este folio antes de re-guardar
        await fetch(`/api/backorders/by-folio/${editingFolio}`, { method: 'DELETE' });
      } else {
        folio = `AGRO-${Math.floor(Math.random() * 90) + 10}${Date.now().toString().slice(-4)}`;
      }

      // 2. Procesar Items (Backorders e Inventario)
      for (const item of cart) {
        // Registrar en Backorders
        await fetch('/api/backorders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: quotingProspect ? quotingProspect.name : manualClientName || 'Venta Directa',
            vendedor: user?.name,
            producto: item.name,
            documento: folio,
            precio: item.price,
            cantidad: item.qty,
            pendiente: item.qty,
            estado: previousEstado ? previousEstado : (quotingProspect || manualClientName ? 'Cotización' : 'Entrega Pendiente'),
            prioridad: 'Media',
            isNewClient: previousIsNewClient !== null ? previousIsNewClient : (() => {
              const nameToCheck = (quotingProspect?.name || manualClientName || '').trim().toLowerCase();
              if (!nameToCheck) return true;
              if (quotingProspect && (quotingProspect.isClient || quotingProspect.stage === 'Venta Cerrada' || quotingProspect.stage === 'Venta Completada')) {
                return false;
              }
              const prospectMatch = (prospects || []).find(p => p.name.trim().toLowerCase() === nameToCheck);
              if (prospectMatch && (prospectMatch.isClient || prospectMatch.stage === 'Venta Cerrada' || prospectMatch.stage === 'Venta Completada')) {
                return false;
              }
              const hasOrders = (backorders || []).some(
                bo => bo.cliente.trim().toLowerCase() === nameToCheck && bo.estado !== 'Cotización'
              );
              if (hasOrders) {
                return false;
              }
              return true;
            })(),
            fechaEntrega: fechaEntrega || null
          })
        });
      }

      // DESCONTAR INVENTARIO SIEMPRE AL FINALIZAR UN PEDIDO O BACKORDER
      for (const item of cart) {
        await fetch(`/api/products/${item.id}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decrementBy: item.qty })
        });
      }

      if (quotingProspect) {
        // ACTUALIZACIÓN DE PIPELINE SEGÚN TIPO DE CLIENTE
        const itemsList = cart.map(item => `${item.name} (${item.qty})`).join(', ');
        const isActuallyClient = quotingProspect.isClient || quotingProspect.stage === 'Venta Cerrada' || quotingProspect.stage === 'Venta Completada';

        // Si estamos editando un pedido existente, no queremos alterar la etapa actual a "Negociación"
        const targetStage = editingFolio ? quotingProspect.stage : (isActuallyClient ? quotingProspect.stage : 'Negociación');

        await fetch(`/api/prospects/${quotingProspect.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interest: itemsList.substring(0, 200),
            budget: cartTotal,
            stage: targetStage,
            lastQuoteDate: new Date().toISOString()
          })
        });

        // Registrar actividad específica para el Dashboard si es cotización nueva
        if (!editingFolio) {
          const activityText = isActuallyClient
            ? `Re-pedido solicitado: ${quotingProspect.name}`
            : `Nueva negociación iniciada: ${quotingProspect.name}`;

          await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: isActuallyClient ? 'order' : 'prospect',
              title: isActuallyClient ? 'Pedido Cartera' : 'Cotización Nueva',
              subtitle: activityText,
              rawDate: new Date().toISOString()
            })
          });
        }

        // 2. Generar PDF Profesional (Actualmente desactivado)
        /*
        generatePremiumPDF({
          logoBase64: AGRIFLOW_LOGO,
          title: "COTIZACIÓN FORMAL DE PRODUCTOS",
          filename: `Cotizacion_${quotingProspect.name.replace(/\s+/g, '_')}.pdf`,
          headerDetails: [
            { label: 'Vendedor:', value: user?.name || 'Sistema' },
            { label: 'Fecha:', value: new Date().toLocaleDateString('es-MX') }
          ],
          cards: [
            { title: "PROSPECTO", value: quotingProspect.name, sub: "Cliente en negociación" }
          ],
          table: {
            head: [['DESCRIPCIÓN DEL PRODUCTO', 'CANTIDAD', 'PRECIO UNIT.', 'SUBTOTAL']],
            body: cart.map(item => [
              item.name,
              item.qty,
              `$${item.price.toLocaleString('es-MX', {minimumFractionDigits: 2})}`,
              `$${(item.qty * item.price).toLocaleString('es-MX', {minimumFractionDigits: 2})}`
            ])
          },
          summary: {
            right: [
              { label: "TOTAL NETO", value: `$${cartTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}`, isTotal: true, color: "#16a34a" }
            ]
          },
          bottomBlocks: [
            { title: 'NOTAS', content: 'Esta cotización tiene una vigencia de 15 días.' }
          ]
        });
        */

        const successMessage = editingFolio
          ? `✓ Pedido ${folio} actualizado correctamente para ${quotingProspect.name}.`
          : `✓ Cotización registrada para ${quotingProspect.name}.`;
        
        showSuccessModal(successMessage);
        return;
      } else if (manualClientName) {
        if (!editingFolio) {
          // CREAR NUEVO PROSPECTO AUTOMÁTICAMENTE SI FUE MANUAL Y ES NUEVA COTIZACIÓN
          const itemsList = cart.map(item => `${item.name} (${item.qty})`).join(', ');

          const pResp = await fetch('/api/prospects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: manualClientName,
              interest: itemsList.substring(0, 200),
              budget: cartTotal,
              stage: 'Negociación',
              isClient: false
            })
          });
          let newProspectId = null;
          try {
            const createdP = await pResp.json();
            newProspectId = createdP.id;
          } catch (err) {
            console.error('Error parsing created prospect:', err);
          }

          // Registrar actividad
          await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'prospect',
              title: 'Cotización Nueva',
              subtitle: `Nueva negociación iniciada: ${manualClientName}`,
              rawDate: new Date().toISOString()
            })
          });

          showSuccessModal(
            `📄 Pedido registrado para cliente nuevo.`,
            true,
            () => {
              setQuotingProspect(null);
              setManualClientName('');
              setEditingFolio(null);
              setCart([]);
              if (typeof refreshData === 'function') refreshData();
              if (newProspectId && typeof setAutoEditProspectId === 'function') {
                setAutoEditProspectId(newProspectId);
              }
              onNavigate('Prospectos');
            }
          );
        } else {
          showSuccessModal(`✓ Pedido ${folio} actualizado correctamente.`);
        }
        return;
      }

      // MODO VENTA DIRECTA (MOSTRADOR SIN CLIENTE REGISTRADO)
      await fetch('/api/ventas/add-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerName: user?.name,
          amount: cartTotal
        })
      });

      showSuccessModal(`🎉 ¡Operación finalizada con éxito por ${user?.name}!\nInventario actualizado y Backorders generados.\nTotal: $${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`);
    } catch (err) {
      console.error(err);
      onNavigate(returnView);
    }
  };

  const handleBack = () => {
    if (quotingProspect) {
      setQuotingProspect(null);
      onNavigate(returnView);
    } else {
      onBack();
    }
  };

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const name = product.name || '';
    const category = product.category || 'Materiales';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas las categorías' || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px', gap: '0px' }}>
      {!quotingProspect && (
        <ViewHeader 
          title="COTIZADOR" 
          subtitle="Gestión de productos y cotizaciones." 
          icon={FileText} 
          onBack={handleBack} 
        />
      )}
      {quotingProspect && (
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #16a34a 100%)', color: '#fff', padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 15px -1px rgba(22, 163, 74, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
              <Users size={28} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Cliente en Atención</p>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{quotingProspect.name}</h2>
            </div>
          </div>
          <button onClick={() => { setQuotingProspect(null); onNavigate('Ventas'); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Cancelar Sesión</button>
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!quotingProspect && (
          <div className="module-card" style={{
            marginBottom: '0px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '28px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#059669" /> Seleccionar Cliente para Cotizar
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <select
                  className="select-input"
                  style={{
                    flex: 1,
                    height: '52px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    padding: '0 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer'
                  }}
                  value={quotingProspect?.name || ""}
                  onChange={(e) => {
                    const p = prospects.find(pr => pr.name === e.target.value);
                    setQuotingProspect(p || null);
                    setManualClientName('');
                  }}
                >
                  <option value="">-- Seleccionar cliente de la lista --</option>
                  {validDropdownClients.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', color: '#1e293b', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', opacity: 0.6 }}>O</div>
                <input
                  type="text"
                  placeholder="Nombre de cliente nuevo..."
                  className="search-input"
                  style={{
                    flex: 1,
                    height: '52px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    padding: '0 20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                  }}
                  value={manualClientName}
                  onChange={(e) => {
                    setManualClientName(e.target.value);
                    setQuotingProspect(null);
                  }}
                />
                <input
                  type="date"
                  placeholder="Fecha de Entrega"
                  title="Fecha Estimada de Entrega (Opcional)"
                  style={{
                    height: '52px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    padding: '0 20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                    color: fechaEntrega ? '#0f172a' : '#64748b',
                    outline: 'none',
                    fontWeight: 600,
                    width: '180px'
                  }}
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px', alignItems: 'start' }}>
          <div className="module-card">
            {/* Search and Filter */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div className="search-field-wrapper" style={{ flex: 1 }}>
                <Search size={18} className="search-field-icon" style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="search-field-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%' }}
                />
              </div>
              <select
                className="select-input"
                style={{ width: '200px' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>Todas las categorías</option>
                <option>Materiales</option>
                <option>Insumos</option>
              </select>
            </div>

            {/* Product List Table */}
            <div className="table-container">
              <table className="data-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>PRODUCTO</th>
                    <th>CATEGORÍA</th>
                    <th>COSTO</th>
                    <th>PRECIO</th>
                    <th>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                        No se encontraron productos.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {p.image ? (
                                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <Package size={24} color="#cbd5e1" />
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>{p.name}</span>
                              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{p.description || p.desc || 'Sin descripción'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-neutral">{p.category || 'N/A'}</span>
                        </td>
                        <td style={{ textAlign: 'right', color: '#64748b' }}>${p.cost?.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#1a2e21' }}>${p.price?.toFixed(2)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                            <input
                              type="number"
                              min="1"
                              placeholder="0"
                              value={quantities[p.id] || ""}
                              onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                              style={{ width: '60px', padding: '8px', borderRadius: '8px', border: '1.5px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#1e293b' }}
                            />
                            <button
                              onClick={() => {
                                const q = parseInt(quantities[p.id]);
                                if (q > 0) {
                                  addToCart(p, q);
                                  handleQuantityChange(p.id, ""); // Limpiar después de agregar
                                }
                              }}
                              className="btn-primary"
                              style={{ padding: '8px 16px', fontSize: '0.85rem', height: 'auto', borderRadius: '10px' }}
                              title="Agregar al carrito"
                            >
                              Agregar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shopping Cart Side Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Shopping Cart Side Panel */}
            <div className="module-card" style={{ padding: '20px', height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Carrito de cotización</h3>
                <ShoppingCart size={20} color="#16a34a" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '140px' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ width: '100px', height: '100px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <div style={{ position: 'relative' }}>
                        <ShoppingCart size={40} color="#16a34a" />
                        <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#fff', borderRadius: '50%', padding: '2px' }}>
                          <Leaf size={20} color="#16a34a" fill="#16a34a" />
                        </div>
                      </div>
                    </div>
                    <h4 style={{ color: '#1e293b', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0' }}>Tu carrito está vacío</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>Agrega productos de la lista para comenzar tu cotización.</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1 }}>{item.name}</div>
                        <button
                          onClick={() => removeFromCart(index)}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                          title="Quitar todo"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '2px 6px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <button
                            onClick={() => updateCartQty(index, (item.qty || 1) - 1)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.qty || 1}</span>
                          <button
                            onClick={() => updateCartQty(index, (item.qty || 1) + 1)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>${item.price?.toFixed(2)} c/u</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2d5a3f' }}>${((item.qty || 1) * item.price).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ borderTop: '2px solid #e2e8f0', marginTop: '20px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2d5a3f' }}>${cartTotal.toFixed(2)}</span>
                </div>

                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', background: quotingProspect ? '#059669' : '#2d5a3f', height: '50px', fontSize: '1rem', borderRadius: '14px', gap: '10px' }}
                  onClick={() => setAlertModal({
                    show: true,
                    title: editingFolio ? '¿Actualizar Pedido?' : '¿Finalizar Cotización?',
                    message: editingFolio 
                      ? `¿Estás seguro de que deseas actualizar los productos del pedido ${editingFolio}? Se guardarán todos tus cambios actuales.`
                      : '¿Deseas guardar el registro y crear los documentos correspondientes en el sistema?',
                    type: 'confirm',
                    onConfirm: () => handleFinalizeQuote()
                  })}
                  disabled={cart.length === 0}
                >
                  {quotingProspect ? <><FileText size={20} /> Finalizar Cotización</> : 'Finalizar Cotización'}
                </button>
              </div>
            </div>

            {/* Estado de Cuenta / Pendientes Section */}
            <div className="module-card" style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', height: 'fit-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Clock size={20} color="#16a34a" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Estado de Cuenta / Pendientes</h3>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px', padding: '8px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {quotingProspect || manualClientName
                  ? `Historial de: ${quotingProspect?.name || manualClientName}`
                  : "Seleccione un cliente para ver su historial."}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {(!quotingProspect && !manualClientName) ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '0.85rem' }}>
                    Esperando selección de cliente...
                  </div>
                ) : (
                  backorders.filter(bo => bo.cliente === (quotingProspect?.name || manualClientName)).length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '0.85rem', background: '#fff', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                      Sin cotizaciones pendientes.
                    </div>
                  ) : (
                    backorders
                      .filter(bo => bo.cliente === (quotingProspect?.name || manualClientName))
                      .map((bo, idx) => (
                        <div key={idx} style={{ padding: '12px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{bo.producto}</span>
                            <span className={`badge ${bo.estado === 'Completado' ? 'badge-success' : 'badge-process'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                              {bo.estado}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                            <span>Cant: {bo.cantidad}</span>
                            <span>Faltan: <strong style={{ color: '#ef4444' }}>{bo.pendiente}</strong></span>
                          </div>
                        </div>
                      ))
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación / Alerta Personalizado */}
      {alertModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '30px',
            width: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            animation: 'scaleUp 0.15s ease-out',
            position: 'relative'
          }}>
            <div style={{
              background: alertModal.type === 'success' ? '#f0fdf4' : '#fef3c7',
              color: alertModal.type === 'success' ? '#16a34a' : '#d97706',
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              {alertModal.type === 'success' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
            </div>
            
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 850,
              color: '#0f172a',
              marginBottom: '10px',
              margin: 0
            }}>
              {alertModal.title}
            </h3>
            
            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              marginBottom: '24px',
              marginTop: '10px'
            }}>
              {alertModal.message}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              {alertModal.type === 'confirm' && (
                <button
                  onClick={() => setAlertModal(prev => ({ ...prev, show: false }))}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancelar
                </button>
              )}
              
              {!alertModal.showProspectsBtn && (
                <button
                  onClick={() => {
                    setAlertModal(prev => ({ ...prev, show: false }));
                    if (typeof alertModal.onConfirm === 'function') {
                      alertModal.onConfirm();
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#2d5a3f',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Aceptar
                </button>
              )}
              {alertModal.showProspectsBtn && (
                <button
                  onClick={() => {
                    setAlertModal(prev => ({ ...prev, show: false }));
                    if (typeof alertModal.onProspectsClick === 'function') {
                      alertModal.onProspectsClick();
                    }
                  }}
                  style={{
                    flex: 1.2,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid #059669',
                    background: '#ecfdf5',
                    color: '#047857',
                    fontWeight: 750,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Pasar a Prospectos
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MainDashboard({ user, setView, prospects, carteraList, backorders, activities, expandOrderItems }) {
  // --- Cálculos de Datos Reales ---
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Envíos Pendientes (Backorders Activos)
  const pendingOrders = (backorders || []).filter(b => b.estado === 'Entrega Pendiente' || b.estado === 'Parcial');
  const expandedPending = expandOrderItems(pendingOrders);
  const pendingUnitsSum = expandedPending.reduce((sum, it) => sum + (it.pendiente || 0), 0);
  const pendingFoliosCount = new Set(pendingOrders.map(b => b.documento)).size;

  const pendingItems = (backorders || []).filter(b => (parseFloat(b.pendiente) || 0) > 0);
  const newItems = pendingItems.filter(b => b.isNewClient === true);
  const newFoliosCount = new Set(newItems.map(b => b.documento)).size;
  const partialItems = pendingItems.filter(b => !b.isNewClient);
  const partialFoliosCount = new Set(partialItems.map(b => b.documento)).size;
  const dispatchItems = pendingItems.filter(b => !b.driverName);
  const dispatchFoliosCount = new Set(dispatchItems.map(b => b.documento)).size;
  const deliveredTodayItems = (backorders || []).filter(b => b.deliveredAt && new Date(b.deliveredAt).toDateString() === now.toDateString());
  const deliveredTodayFoliosCount = new Set(deliveredTodayItems.map(b => b.documento)).size;

  // Cotizaciones Pendientes: Prospectos en etapa de Negociación
  const pendingQuotesCount = (prospects || []).filter(p => !p.isClient && p.stage === 'Negociación').length;

  // Ventas Totales: Todos los pedidos que no son cotización ni perdidos
  const validSalesBOs = (backorders || []).filter(b => b.estado !== 'Cotización' && b.estado !== 'Perdido' && b.estado !== 'Cancelado');
  const expandedSales = expandOrderItems(validSalesBOs);
  const totalSales = expandedSales.reduce((sum, it) => sum + ((parseFloat(it.precio) || 0) * (it.pedidoOri || 0)), 0);

  const dayOfMonth = now.getDate() || 1;
  const dailyAvg = totalSales / dayOfMonth;

  // Cartera Pendiente (No Pagados)
  const unpaidBOs = validSalesBOs.filter(b => b.billingStatus !== 'Pagado');
  const expandedUnpaid = expandOrderItems(unpaidBOs);
  const overdueCartera = expandedUnpaid.reduce((sum, it) => sum + ((parseFloat(it.precio) || 0) * (it.pedidoOri || 0)), 0);
  const overdueInvoices = new Set(unpaidBOs.map(b => b.documento)).size;
  const totalDebt = overdueCartera;

  // Construcción de Actividad Reciente Real
  const combinedActivity = [
    ...(backorders || []).filter(b => b.estado !== 'Cotización').slice(-10).map(b => ({
      id: `bo-${b.id}`,
      type: 'order',
      title: `Pedido registrado`,
      subtitle: `${b.cliente || 'Desconocido'} (${(b.producto || '').substring(0, 30)}${(b.producto || '').length > 30 ? '...' : ''})`,
      time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente',
      rawDate: b.createdAt ? new Date(b.createdAt) : new Date(0)
    })),
    ...(prospects || []).slice(-10).map(p => ({
      id: `pr-${p.id}`,
      type: 'prospect',
      title: `Nuevo prospecto`,
      subtitle: `${p.name} ${p.budget ? `- $${parseFloat(p.budget).toLocaleString('es-MX')}` : ''}`,
      time: 'Hoy',
      rawDate: p.createdAt ? new Date(p.createdAt) : new Date(0)
    }))
  ].sort((a, b) => b.rawDate - a.rawDate).slice(0, 6);

  const displayActivities = combinedActivity;

  const activeProspectsCount = (prospects || []).filter(p => !p.isClient && p.stage !== 'Venta Cerrada' && p.stage !== 'Venta Completada').length;

  // --- Subcomponentes Visuales ---
  const MiniSparkline = ({ color = "#10b981" }) => (
    <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
      <path d="M0,35 Q10,32 20,25 T40,28 T60,15 T80,20 T100,5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M0,35 Q10,32 20,25 T40,28 T60,15 T80,20 T100,5 L100,40 L0,40 Z" fill={`url(#grad-${color.replace('#', '')})`} opacity="0.1" />
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );

  const CircleProgress = ({ percent, color }) => {
    const r = 24;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percent / 100) * circ;
    return (
      <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="30" cy="30" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        <text x="30" y="-30" textAnchor="middle" dominantBaseline="middle" fill="#0f172a" fontSize="11" fontWeight="800" style={{ transform: 'rotate(90deg)' }}>{percent}%</text>
      </svg>
    );
  };

  const DashCard = ({ title, value, subtext, icon: Icon, color, trend, trendVal, chartType }) => (
    <div className="module-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '200px', height: '100%', position: 'relative', overflow: 'visible' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
            {trend && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem', fontWeight: 800, color: '#10b981', background: '#f0fdf4', padding: '2px 6px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <ArrowUpRight size={10} /> {trendVal.split(' ')[0]}
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{value}</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, fontWeight: 600 }}>{subtext}</p>
        </div>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '12px' }}>
          <Icon size={20} color={color} />
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        {chartType === 'spark' && <MiniSparkline color={color} />}
        {chartType === 'circle' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flexShrink: 0 }}>
              <CircleProgress percent={Math.round((overdueCartera / (totalDebt || 1)) * 100) || 0} color="#ec4899" />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, lineHeight: 1.2 }}>Del total por cobrar</span>
          </div>
        )}
        {chartType === 'bars' && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '34px' }}>
            {[30, 50, 40, 80, 60, 40, 70, 90, 50, 30].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 7 ? '#f97316' : '#fed7aa', borderRadius: '2px' }}></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <ViewHeader 
        title="Panel de Control" 
        subtitle="Resumen operativo y métricas en tiempo real de AgriFlow Pro"
        icon={LayoutDashboard}
      >
        <div style={{ background: '#fff', padding: '10px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <Calendar size={18} color="#10b981" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', textTransform: 'capitalize' }}>{new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</span>
        </div>
      </ViewHeader>

      <div style={{ padding: '32px 40px' }}>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <DashCard title="Ventas Totales" value={`$${totalSales.toLocaleString('es-MX')}`} subtext={`Acumulado ${currentYear}`} icon={TrendingUp} color="#10b981" trend={true} trendVal="18% vs mes anterior" chartType="spark" />
        <DashCard title="Backorders Activos" value={pendingFoliosCount.toString()} subtext={`${pendingUnitsSum} unidades pendientes`} icon={Package} color="#f97316" chartType="bars" />
        <DashCard title="Cotizaciones Pendientes" value={pendingQuotesCount.toString()} subtext="En negociación" icon={FileText} color="#3b82f6" chartType="spark" />
        <DashCard title="Cartera Vencida" value={`$${overdueCartera.toLocaleString('es-MX')}`} subtext={`${overdueInvoices} facturas vencidas`} icon={DollarSign} color="#ec4899" chartType="circle" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Alertas */}
        <div className="module-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} color={pendingUnitsSum > 100 ? "#ef4444" : "#f59e0b"} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Alertas importantes</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: pendingUnitsSum > 100 ? '#fef2f2' : '#fff9f0', border: `1px solid ${pendingUnitsSum > 100 ? '#fecaca' : '#ffedd5'}`, padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <Package size={18} color={pendingUnitsSum > 100 ? "#ef4444" : "#f97316"} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: pendingUnitsSum > 100 ? '#991b1b' : '#9a3412' }}>{pendingUnitsSum} unidades pendientes</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: pendingUnitsSum > 100 ? '#b91c1c' : '#c2410c' }}>{pendingFoliosCount} pedidos por revisar</p>
                </div>
              </div>
              <button style={{ background: '#fff', border: `1px solid ${pendingUnitsSum > 100 ? '#fecaca' : '#fed7aa'}`, color: pendingUnitsSum > 100 ? '#be123c' : '#c2410c', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setView('Backorders')}>Revisar ahora</button>
            </div>

            <div style={{ background: '#fff1f2', border: '1px solid #ffe4e6', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <DollarSign size={18} color="#e11d48" />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#9f1239' }}>${overdueCartera.toLocaleString('es-MX')} en cartera vencida</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#be123c' }}>{overdueInvoices} facturas vencidas</p>
                </div>
              </div>
              <button style={{ background: '#fff', border: '1px solid #fecdd3', color: '#be123c', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setView('Cartera')}>Ver detalles</button>
            </div>
          </div>
        </div>

        {/* Operaciones Activas */}
        <div className="module-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 24px 0' }}>Operaciones activas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Pedidos en proceso', sub: 'Órdenes nuevas', val: newFoliosCount, color: '#3b82f6', icon: FileText },
              { label: 'Backorders pendientes', sub: 'Pedidos parciales', val: partialFoliosCount, color: '#f97316', icon: Package },
              { label: 'Por despachar', sub: 'Listos para envío', val: dispatchFoliosCount, color: '#06b6d4', icon: Truck },
              { label: 'Entregas recientes', sub: 'Entregado hoy', val: deliveredTodayFoliosCount, color: '#10b981', icon: CheckCircle2 },
            ].map((op, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', background: `${op.color}10`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <op.icon size={16} color={op.color} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{op.label}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{op.sub}</p>
                  </div>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: op.color }}>{op.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="module-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 24px 0' }}>Accesos rápidos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Nueva cotización', icon: FileText, color: '#10b981', view: 'Cotizador' },
              { label: 'Nuevo pedido', icon: Package, color: '#10b981', view: 'Inventario' },
              { label: 'Agregar prospecto', icon: Users, color: '#10b981', view: 'Prospectos' },
              { label: 'Registrar entrega', icon: Truck, color: '#10b981', view: 'Logistica' },
              { label: 'Ver reportes', icon: BarChart2, color: '#10b981', view: 'Reportes' },
              { label: 'Clientes', icon: Briefcase, color: '#10b981', view: 'Clientes' },
            ].map((acc, i) => (
              <div key={i} onClick={() => setView(acc.view)} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
              >
                <acc.icon size={22} color={acc.color} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textAlign: 'center' }}>{acc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
        {/* Actividad Reciente */}
        <div className="module-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Actividad reciente</h3>
            <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setView('Reportes')}>Ver toda la actividad</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            {/* Simple timeline line */}
            <div style={{ position: 'absolute', left: '19px', top: '20px', bottom: '20px', width: '2px', background: '#f1f5f9' }}></div>

            {(displayActivities || []).slice(0, 4).map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '40px', height: '40px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  {act.type === 'order' && <Package size={16} color="#f97316" />}
                  {act.type === 'sale' && <CheckCircle2 size={16} color="#10b981" />}
                  {act.type === 'prospect' && <Users size={16} color="#8b5cf6" />}
                  {!act.type && <Info size={16} color="#64748b" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{act.title || act.action}</p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{act.time || 'Hace poco'}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{act.subtitle || act.description}</p>
                </div>
              </div>
            ))}

            {(!displayActivities || displayActivities.length === 0) && (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '20px' }}>Sin actividad reciente registrada.</p>
            )}
          </div>
        </div>

        {/* Resumen de Ventas - Gráfico Grande */}
        <div className="module-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Resumen de ventas</h3>
            <select style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
              <option>Este mes</option>
              <option>Trimestre</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '48px', marginBottom: '32px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Ventas totales</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>${totalSales.toLocaleString('es-MX')}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginTop: '4px' }}>
                <ArrowUpRight size={14} /> 18% vs mes anterior
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Promedio diario</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>${dailyAvg.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h2>
            </div>
          </div>

          <div style={{ width: '100%', height: '180px', position: 'relative' }}>
            {/* Simple SVG Area Chart */}
            <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path d="M0,80 Q20,70 40,75 T80,50 T120,60 T160,30 T200,45 T240,20 T280,35 T320,15 T360,25 T400,10" fill="none" stroke="#10b981" strokeWidth="3" />
              <path d="M0,80 Q20,70 40,75 T80,50 T120,60 T160,30 T200,45 T240,20 T280,35 T320,15 T360,25 T400,10 L400,100 L0,100 Z" fill="url(#salesGrad)" opacity="0.1" />
              <defs>
                <linearGradient id="salesGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(v => <line key={v} x1="0" y1={v} x2="400" y2={v} stroke="#f1f5f9" strokeWidth="1" />)}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>
              <span>1 May</span><span>8 May</span><span>15 May</span><span>22 May</span><span>29 May</span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalModule({ onBack, user }) {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos los roles');
  const [viewMode, setViewMode] = useState('grid');
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '1234', phone: '', avatar: '', role: 'Vendedor'
  });

  const filteredUsers = users.filter(u => {
    const searchString = searchTerm.toLowerCase();
    const matchSearch = (u.name || '').toLowerCase().includes(searchString) ||
      (u.username || '').toLowerCase().includes(searchString) ||
      (u.email || '').toLowerCase().includes(searchString);
    const matchRole = roleFilter === 'Todos los roles' || (u.role && u.role.toLowerCase() === roleFilter.toLowerCase());
    return matchSearch && matchRole;
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setFormData(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.avatar) delete payload.avatar;

      const url = editingUserId ? `/api/users/${editingUserId}` : '/api/register';
      const method = editingUserId ? 'PUT' : 'POST';

      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      if (resp.ok) {
        setShowModal(false);
        setEditingUserId(null);
        setAvatarPreview(null);
        setFormData({ name: '', username: '', email: '', password: '1234', phone: '', avatar: '', role: 'Vendedor' });
        await fetchUsers();
      } else {
        alert(`Error al ${editingUserId ? 'actualizar' : 'registrar'}: ` + (data.error || JSON.stringify(data)));
      }
    } catch (e) {
      console.error('Error de red:', e);
      alert('Error de conexión: ' + e.message);
    }
  };

  const openEditModal = (u) => {
    setEditingUserId(u.id);
    setFormData({
      name: u.name || '',
      username: u.username || '',
      email: u.email || '',
      password: '',
      phone: u.phone || '',
      avatar: u.avatar || '',
      role: u.role || 'Vendedor'
    });
    setAvatarPreview(u.avatar || null);
    setShowModal(true);
  };

  const roleStyles = {
    'Administrador Master': { bg: '#1a2e23', color: '#a7f3d0', border: 'none', px: '10px', py: '4px' },
    'Administrador': { bg: 'transparent', color: '#3b82f6', border: '1px solid #bfdbfe', px: '10px', py: '3px' },
    'Vendedor': { bg: 'transparent', color: '#10b981', border: '1px solid #bbf7d0', px: '10px', py: '3px' },
    'vendedor': { bg: 'transparent', color: '#10b981', border: '1px solid #bbf7d0', px: '10px', py: '3px' },
  };

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <ViewHeader 
        title="Gestión de Personal" 
        subtitle="Administra los miembros de tu equipo y sus roles en la plataforma." 
        icon={Users} 
        onBack={onBack}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {[
            { label: 'Miembros', val: users.length, icon: Users, color: '#10b981', bg: '#f0fdf4' },
            { label: 'Vendedores', val: users.filter(u => u.role.toLowerCase() === 'vendedor').length, icon: ShieldAlert, color: '#10b981', bg: '#f0fdf4' },
            { label: 'Administradores', val: users.filter(u => u.role.toLowerCase().includes('administrador')).length, icon: Settings, color: '#3b82f6', bg: '#eff6ff' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', padding: '12px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '160px' }}>
              <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
                </div>
              </div>
            </div>
          ))}
          <button
            className="btn-primary"
            onClick={() => {
              setEditingUserId(null);
              setFormData({ name: '', username: '', email: '', password: '1234', phone: '', avatar: '', role: 'Vendedor' });
              setAvatarPreview(null);
              setShowModal(true);
            }}
            style={{ background: '#2d5a3f', borderRadius: '12px', padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(45, 90, 63, 0.2)', marginLeft: '12px' }}
          >
            <Plus size={18} /> Nuevo Miembro
          </button>
        </div>
      </ViewHeader>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 40px 32px 40px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, marginRight: '32px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar miembros..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b', fontSize: '0.95rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.02)' }}
            />
          </div>

          {/* Filters & Toggles */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 16px', gap: '8px', cursor: 'pointer', background: '#fff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.02)', position: 'relative' }}>
              <Filter size={16} color="#10b981" />
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer', appearance: 'none', paddingRight: '12px' }}
              >
                <option value="Todos los roles">Todos los roles</option>
                <option value="Administrador Master">Administrador Master</option>
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
              </select>
              <ChevronDown size={16} color="#94a3b8" style={{ pointerEvents: 'none', position: 'absolute', right: '12px' }} />
            </div>

            <div style={{ display: 'flex', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '4px' }}>
              <button onClick={() => setViewMode('grid')} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: viewMode === 'grid' ? '#f0fdf4' : 'transparent', color: viewMode === 'grid' ? '#10b981' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LayoutGrid size={18} /></button>
              <button onClick={() => setViewMode('list')} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: viewMode === 'list' ? '#f0fdf4' : 'transparent', color: viewMode === 'list' ? '#10b981' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardList size={18} /></button>
            </div>
          </div>
        </div>

        {/* Tarjetas de usuarios */}
        <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr', gap: '24px' }}>
          {filteredUsers.map(u => {
            const rs = roleStyles[u.role] || roleStyles['vendedor'];
            return (
              <div key={u.id} className="module-card" style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: viewMode === 'list' ? 'row' : 'column', gap: viewMode === 'list' ? '32px' : '16px', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', alignItems: viewMode === 'list' ? 'center' : 'stretch' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px -10px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: viewMode === 'list' ? '1' : 'none' }}>
                  {/* Avatar */}
                  <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {u.avatar
                      ? <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>{u.name?.charAt(0).toUpperCase()}</span>
                    }
                  </div>

                  {/* Info & Badge */}
                  <div style={{ flex: 1, minWidth: 0, paddingRight: viewMode === 'list' ? '0' : '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: viewMode === 'list' ? 'center' : 'flex-start', gap: '8px', marginBottom: viewMode === 'list' ? '0' : '4px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 2px', color: '#0f172a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: viewMode === 'list' ? 'auto' : '2.6rem', lineHeight: '1.25' }}>{u.name}</h3>
                        {u.username && <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>@{u.username}</p>}
                      </div>
                      {viewMode === 'grid' && (
                        <span style={{
                          padding: `${rs.py || '4px'} ${rs.px || '10px'}`,
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: rs.bg,
                          color: rs.color,
                          border: rs.border || 'none',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          {u.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {viewMode === 'list' && (
                  <div style={{ flex: '0.5', display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      padding: `${rs.py || '4px'} ${rs.px || '10px'}`,
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: rs.bg,
                      color: rs.color,
                      border: rs.border || 'none',
                      whiteSpace: 'nowrap'
                    }}>
                      {u.role}
                    </span>
                  </div>
                )}

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: viewMode === 'list' ? 'row' : 'column', gap: viewMode === 'list' ? '24px' : '8px', paddingTop: viewMode === 'list' ? '0' : '4px', flex: viewMode === 'list' ? '1.5' : 'none', justifyContent: viewMode === 'list' ? 'space-between' : 'flex-start', paddingRight: viewMode === 'list' ? '40px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.85rem' }}>
                    <Mail size={14} color="#10b981" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                  </div>
                  {u.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.85rem' }}>
                      <Phone size={14} color="#10b981" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    <Calendar size={14} color="#10b981" />
                    <span>Ingresó el {new Date(u.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Edit Action */}
                <button
                  onClick={() => openEditModal(u)}
                  style={{ position: 'absolute', top: viewMode === 'list' ? '50%' : '16px', right: '16px', transform: viewMode === 'list' ? 'translateY(-50%)' : 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94a3b8', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#10b981'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  title="Editar perfil"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                {editingUserId ? 'Editar Perfil' : 'Nuevo Miembro del Equipo'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* Avatar Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '3px dashed #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#2d5a3f'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  >
                    {avatarPreview
                      ? <img src={avatarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                        <Users size={28} />
                        <p style={{ fontSize: '0.7rem', margin: '4px 0 0', fontWeight: 600 }}>Foto</p>
                      </div>
                    }
                  </div>
                </label>
                <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '8px' }}>Haz clic para subir foto de perfil</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Nombre Completo *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="search-input" style={{ width: '100%' }} placeholder="Ej. Juan Pérez García" required />
                </div>
                <div className="form-group">
                  <label>Nombre de Usuario <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span></label>
                  <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="search-input" style={{ width: '100%' }} placeholder="@jperez" />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="search-input" style={{ width: '100%' }} placeholder="Ej. 612 123 4567" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Correo Electrónico *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="search-input" style={{ width: '100%' }} placeholder="correo@agriflow.com" required />
                </div>
                <div className="form-group">
                  <label>{editingUserId ? 'Nueva Contraseña (opcional)' : 'Contraseña Inicial'}</label>
                  <input type="text" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="search-input" style={{ width: '100%' }} />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select className="select-input" style={{ width: '100%' }} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Administrador Master">Administrador Master</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#2d5a3f', borderRadius: '12px', padding: '14px' }}>
                  {editingUserId ? '✓ Guardar Cambios' : '✓ Registrar Miembro'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); setAvatarPreview(null); }} style={{ flex: 1, borderRadius: '12px', padding: '14px' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// Módulo de Facturación y Cobranza (Nuevo)
function FacturacionModule({ onBack, backorders, refreshData }) {
  const [searchPending, setSearchPending] = useState('');
  const [searchHistory, setSearchHistory] = useState('');
  const [activeHistoryTab, setActiveHistoryTab] = useState('Todos');
  const [filterPriority, setFilterPriority] = useState('Todas'); // 'Todas' o 'Alta'
  const [activeSection, setActiveSection] = useState('Pendientes'); // 'Todos' | 'Pendientes' | 'Facturado'

  // Lógica para definir Alta Prioridad:
  // 1. Montos mayores a $50,000
  // 2. Clientes nuevos (que requieren validación extra)
  const isHighPriority = (b) => (b.precio > 50000) || b.isNewClient;

  // Filtrar backorders que requieren cobro o factura
  const facturacionList = (backorders || []);

  const pendientes = facturacionList
    .filter(b => b.billingStatus !== 'Facturado' && b.billingStatus !== 'Pagado' && b.estado !== 'Cotización')
    .filter(b => {
      const matchesSearch = b.cliente.toLowerCase().includes(searchPending.toLowerCase()) ||
        b.producto.toLowerCase().includes(searchPending.toLowerCase());
      if (filterPriority === 'Alta') {
        return matchesSearch && isHighPriority(b);
      }
      return matchesSearch;
    });

  const facturados = facturacionList
    .filter(b => (b.billingStatus === 'Facturado' || b.billingStatus === 'Pagado') && b.estado !== 'Cotización')
    .filter(b => {
      const matchesSearch = b.cliente.toLowerCase().includes(searchHistory.toLowerCase()) ||
        b.producto.toLowerCase().includes(searchHistory.toLowerCase());
      if (activeHistoryTab === 'Todos') return matchesSearch;
      return matchesSearch && b.billingStatus === activeHistoryTab;
    });

  const [selectedBill, setSelectedBill] = useState(null);
  const [invoicePreview, setInvoicePreview] = useState(null);
  const [billingForm, setBillingForm] = useState({
    amountReceived: '',
    cashHanded: '',
    paymentMethod: 'Efectivo',
    paymentType: 'Completo',
    reference: '',
    cardDigits: '',
    cardType: 'Visa',
    terminal: 'Clip',
    authCode: '',
    bankOrigin: '',
    trackingKey: '',
    clientRFC: '',
    clientCP: ''
  });

  const handleMarkAsInvoiced = async (billingData) => {
    try {
      const resp = await fetch(`/api/backorders/${selectedBill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingStatus: 'Pagado', estado: 'Entrega Pendiente' })
      });
      if (resp.ok) {
        setInvoicePreview({ ...selectedBill, ...billingForm });
        
        // Sincronización automática con Logística y CRM Pipeline
        // Actualizamos el stage del Prospecto a "Recibir Pedido" para que siga el flujo
        try {
          const pResp = await fetch('/api/prospects');
          const allProspects = await pResp.json();
          const p = allProspects.find(p => p.name === selectedBill.cliente);
          if (p) {
            await fetch(`/api/prospects/${p.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ stage: 'Recibir Pedido' })
            });
          }
        } catch (e) {
          console.error("Error sincronizando prospecto:", e);
        }

        setSelectedBill(null);
        if (refreshData) refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const facturadoTotal = facturados.reduce((sum, b) => sum + (b.precio || 0), 0);

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
      <ViewHeader 
        title="Facturación y Cobranza" 
        subtitle="Gestión de CFDI y Cierre de Operaciones Fiscales." 
        icon={Receipt} 
        onBack={onBack}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { label: 'Pendientes de Pago', val: pendientes.length, sub: 'Órdenes', icon: AlertTriangle, color: '#f59e0b', bg: '#fff7ed', sectionKey: 'Pendientes' },
            { label: 'Total Facturado', val: `$${facturadoTotal.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`, sub: 'Este mes', icon: FileCheck2, color: '#16a34a', bg: '#f0fdf4', sectionKey: 'Facturado' }
          ].map((stat, i) => {
            const isActive = activeSection === stat.sectionKey;
            return (
              <div 
                key={i} 
                onClick={() => setActiveSection(activeSection === stat.sectionKey ? 'Todos' : stat.sectionKey)}
                style={{
                  background: '#fff',
                  padding: '12px 20px',
                  borderRadius: '16px',
                  border: isActive ? `2px solid ${stat.color}` : '1.5px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  minWidth: '180px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  boxShadow: isActive ? `0 10px 15px -3px ${stat.color}15, 0 4px 6px -4px ${stat.color}15` : 'none',
                }}
              >
                <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{stat.sub}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ViewHeader>

      <div style={{
        width: '100%',
        maxWidth: activeSection === 'Todos' ? '1400px' : '100%',
        margin: '32px auto',
        display: 'flex',
        gap: activeSection === 'Todos' ? '32px' : '0px',
        padding: '0 32px',
        boxSizing: 'border-box',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>

        {/* COLUMNA IZQUIERDA: PENDIENTES */}
        <div style={{
          flex: activeSection === 'Facturado' ? 0 : 1,
          width: activeSection === 'Facturado' ? '0px' : '100%',
          minWidth: activeSection === 'Facturado' ? '0px' : '450px',
          opacity: activeSection === 'Facturado' ? 0 : 1,
          maxHeight: activeSection === 'Facturado' ? '0px' : 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', flex: 1 }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: '#fff7ed', padding: '8px', borderRadius: '50%' }}>
                  <Clock size={20} color="#f59e0b" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Pendientes de Facturar</h3>
              </div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Órdenes listas para registrar cobro y generar factura.</p>
            </div>

            {/* Barra de Filtros Izquierda */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <select
                value={filterPriority === 'Alta' ? 'Prioridad Alta' : 'Todas las órdenes'}
                onChange={(e) => setFilterPriority(e.target.value === 'Prioridad Alta' ? 'Alta' : 'Todas')}
                style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.85rem', fontWeight: 700, color: '#475569', outline: 'none', cursor: 'pointer' }}>
                <option>Todas las órdenes</option>
                <option>Prioridad Alta</option>
              </select>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Buscar orden o cliente..."
                  value={searchPending}
                  onChange={(e) => setSearchPending(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
              <button
                onClick={() => { setSearchPending(''); setFilterPriority('Todas'); }}
                style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
                <Filter size={18} color="#64748b" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendientes.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                  <p style={{ color: '#94a3b8', fontWeight: 600 }}>No hay ventas pendientes.</p>
                </div>
              ) : (
                pendientes.map(b => (
                  <div key={b.id} style={{ padding: '24px', border: '1.5px solid #f1f5f9', borderRadius: '20px', background: '#fff', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: '#fff7ed', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={26} color="#f97316" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 900, textTransform: 'uppercase' }}>{b.cliente}</h4>
                        {isHighPriority(b) && (
                          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 900, border: '1px solid #fee2e2' }}>ALTA PRIORIDAD</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Producto: <span style={{ color: '#475569' }}>{b.producto}</span></p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={14} color="#f59e0b" />
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{(b.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedBill(b);
                          setBillingForm({ ...billingForm, amountReceived: (b.precio || 0).toString() });
                        }}
                        style={{ padding: '10px 18px', borderRadius: '12px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', marginBottom: '8px' }}>
                        Registrar Cobro
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Calendar size={12} />
                        {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL */}
        <div style={{
          flex: activeSection === 'Pendientes' ? 0 : 1,
          width: activeSection === 'Pendientes' ? '0px' : '100%',
          minWidth: activeSection === 'Pendientes' ? '0px' : '450px',
          opacity: activeSection === 'Pendientes' ? 0 : 1,
          maxHeight: activeSection === 'Pendientes' ? '0px' : 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', flex: 1 }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '50%' }}>
                  <CheckCircle2 size={20} color="#10b981" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Historial Facturado</h3>
              </div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Facturas generadas y cobradas.</p>
            </div>

            {/* Tabs y Filtro Fecha */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: '14px', gap: '4px' }}>
                {['Todos', 'Pagado', 'Pendiente', 'Cancelado'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveHistoryTab(tab)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      background: activeHistoryTab === tab ? '#dcfce7' : 'transparent',
                      color: activeHistoryTab === tab ? '#166534' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                    {tab}
                  </button>
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                <input
                  type="text"
                  placeholder=""
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  onFocus={(e) => e.target.style.width = '180px'}
                  onBlur={(e) => { if (!searchHistory) e.target.style.width = '44px' }}
                  style={{
                    width: searchHistory ? '180px' : '44px',
                    height: '40px',
                    padding: '0 12px 0 40px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.85rem',
                    outline: 'none',
                    background: '#fff',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {facturados.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                  <p style={{ color: '#94a3b8', fontWeight: 600 }}>No hay facturas.</p>
                </div>
              ) : (
                facturados.map(b => (
                  <div key={b.id} style={{ padding: '24px', border: '1.5px solid #f1f5f9', borderRadius: '20px', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 900 }}>{b.cliente}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Producto: <span style={{ color: '#475569' }}>{b.producto}</span></p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, fontFamily: 'monospace' }}>F-2024-{String(b.id).padStart(5, '0')}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, display: 'inline-block', marginBottom: '8px' }}>PAGADO</span>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>${(b.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Calendar size={12} />
                        {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <button onClick={() => setInvoicePreview(b)} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #3b82f6', background: '#fff', color: '#3b82f6', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={14} /> Ver Factura <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#f8fafc', width: '100%', maxWidth: '1200px', maxHeight: '90vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>

            {/* Header del Modal */}
            <div style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Facturación y Cobros</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Crea facturas y registra cobros de forma rápida</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <FileText size={18} /> Historial de facturas
                </button>
                <button onClick={() => setSelectedBill(null)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Cuerpo del Modal (2 Columnas) */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

              {/* Columna Izquierda */}
              <div style={{ flex: 1.2, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* 1. Datos del cliente */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>1. Datos del cliente</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '56px', height: '56px', background: '#dcfce7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 900, fontSize: '1.2rem' }}>
                        {selectedBill.cliente.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1e293b', fontWeight: 800 }}>{selectedBill.cliente}</h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>RFC: XAXX010101000</p>
                      </div>
                    </div>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <UserCheck size={16} /> Ver contacto
                    </button>
                  </div>
                </div>

                {/* 2. Productos / Servicios */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>2. Productos / Servicios</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ paddingBottom: '12px', fontWeight: 700 }}>Producto / Servicio</th>
                        <th style={{ paddingBottom: '12px', fontWeight: 700, width: '80px', textAlign: 'center' }}>Cant.</th>
                        <th style={{ paddingBottom: '12px', fontWeight: 700, width: '120px', textAlign: 'right' }}>P. Unitario</th>
                        <th style={{ paddingBottom: '12px', fontWeight: 700, width: '120px', textAlign: 'right' }}>Importe</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '16px 0', color: '#1e293b', fontWeight: 700 }}>{selectedBill.producto}</td>
                        <td style={{ padding: '16px 0', textAlign: 'center' }}>
                          <span style={{ padding: '4px 12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>{selectedBill.cantidad || 1}</span>
                        </td>
                        <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 600 }}>
                          <span style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                            ${((selectedBill.precio || 0) / (selectedBill.cantidad || 1)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td style={{ padding: '16px 0', textAlign: 'right', fontWeight: 700 }}>${(selectedBill.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 3. Información de la factura */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>3. Información de la factura</h3>

                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block' }}>Folio</label>
                          <input type="text" defaultValue={`F-2026-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', fontWeight: 700, color: '#1e293b' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block' }}>Fecha de emisión</label>
                          <input type="date" defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block' }}>Notas (opcional)</label>
                        <textarea placeholder="Ej. Observaciones adicionales..." style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', resize: 'none', height: '60px' }}></textarea>
                      </div>
                    </div>

                    {/* Totales */}
                    <div style={{ width: '250px', background: '#f8fafc', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                        <span>Subtotal</span>
                        <span>${((selectedBill.precio || 0) / 1.16).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                        <span>IVA (16%)</span>
                        <span>${((selectedBill.precio || 0) - ((selectedBill.precio || 0) / 1.16)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#0f172a', fontWeight: 800 }}>Total</span>
                        <span style={{ color: '#16a34a', fontWeight: 900, fontSize: '1.2rem' }}>${(selectedBill.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Columna Derecha (Cobro) */}
              <div style={{ flex: 0.8, padding: '32px', background: '#f0fdf4', overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 24px 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>4. Cobrar factura</h3>

                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #bbf7d0', marginBottom: '24px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Total a cobrar</p>
                  <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#16a34a', fontWeight: 900 }}>${(selectedBill.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span style={{ fontSize: '1rem', color: '#22c55e' }}>MXN</span></h2>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px', display: 'block' }}>Monto a recibir</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 700 }}>$</span>
                    <input
                      type="number"
                      value={billingForm.amountReceived}
                      onChange={(e) => setBillingForm({ ...billingForm, amountReceived: e.target.value })}
                      style={{ width: '100%', padding: '14px 16px 14px 32px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', fontWeight: 700, outline: 'none' }}
                    />
                    <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>MXN</span>
                  </div>
                </div>

                <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Datos del Receptor</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase' }}>RFC del Cliente</label>
                      <input
                        type="text"
                        value={billingForm.clientRFC}
                        onChange={(e) => setBillingForm({ ...billingForm, clientRFC: e.target.value.toUpperCase() })}
                        placeholder="XAXX010101000"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase' }}>Código Postal</label>
                      <input
                        type="text"
                        maxLength="5"
                        value={billingForm.clientCP}
                        onChange={(e) => setBillingForm({ ...billingForm, clientCP: e.target.value.replace(/\D/g, '') })}
                        placeholder="76000"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', fontWeight: 700 }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px', display: 'block' }}>Método de pago</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { id: 'Efectivo', icon: DollarSign },
                      { id: 'Tarjeta', icon: Briefcase },
                      { id: 'Transferencia', icon: Building2 },
                      { id: 'Otro', icon: MoreHorizontal }
                    ].map(method => {
                      const isActive = billingForm.paymentMethod === method.id;
                      const IconComponent = method.icon;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setBillingForm({ ...billingForm, paymentMethod: method.id })}
                          style={{
                            padding: '16px',
                            border: isActive ? '2px solid #16a34a' : '1px solid #e2e8f0',
                            borderRadius: '12px',
                            background: isActive ? '#f0fdf4' : '#fff',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative'
                          }}
                        >
                          {isActive && (
                            <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#16a34a', borderRadius: '50%', padding: '2px' }}>
                              <Check size={12} color="#fff" />
                            </div>
                          )}
                          <IconComponent size={24} color={isActive ? '#16a34a' : '#64748b'} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isActive ? '#16a34a' : '#64748b' }}>{method.id}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Monto Cobrado</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #cbd5e1', borderRadius: '8px', padding: '0 12px', background: '#f8fafc', transition: 'all 0.2s' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 800 }}>$</span>
                    <input
                      type="number"
                      value={billingForm.amountReceived}
                      onChange={(e) => setBillingForm({ ...billingForm, amountReceived: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}
                    />
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>MXN</span>
                  </div>
                </div>

                {billingForm.paymentMethod === 'Efectivo' && (
                  <div style={{ marginBottom: '24px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Efectivo Recibido</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #cbd5e1', borderRadius: '8px', padding: '0 12px', background: '#f8fafc', transition: 'all 0.2s' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 800 }}>$</span>
                          <input
                            type="number"
                            value={billingForm.cashHanded}
                            onChange={e => setBillingForm({ ...billingForm, cashHanded: e.target.value })}
                            placeholder="Ej. 500"
                            style={{ width: '100%', padding: '8px', background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.9rem', fontWeight: 800, outline: 'none' }}
                          />
                        </div>
                      </div>
                      <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '2px dashed #e2e8f0' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Cambio a entregar</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: '#16a34a', fontWeight: 900 }}>
                          ${Math.max(0, parseFloat(billingForm.cashHanded || 0) - parseFloat(billingForm.amountReceived || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>MXN</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {billingForm.paymentMethod === 'Tarjeta' && (
                  <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.08)' }}>
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
                      <Briefcase size={120} color="#94a3b8" />
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>

                      {/* Flujo visual del vendedor: Monto y Cliente */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Cliente</p>
                          <p style={{ margin: 0, color: '#0f172a', fontWeight: 700, fontSize: '0.85rem' }}>{selectedBill.cliente}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Total a Cobrar</p>
                          <p style={{ margin: 0, color: '#16a34a', fontWeight: 900, fontSize: '0.9rem' }}>${(parseFloat(billingForm.amountReceived) || selectedBill.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1rem', fontWeight: 900, letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Briefcase size={16} color="#64748b" /> TARJETA
                        </h4>
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 800, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#16a34a', borderRadius: '50%' }}></div>
                          Pago aprobado
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Terminal Usada</label>
                          <select value={billingForm.terminal} onChange={e => setBillingForm({ ...billingForm, terminal: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#1e293b', fontSize: '0.85rem', outline: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#94a3b8'} onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
                            <option value="Clip">Clip</option>
                            <option value="Mercado Pago">Mercado Pago</option>
                            <option value="Terminal BBVA">Terminal BBVA</option>
                            <option value="Terminal Santander">Terminal Santander</option>
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Tipo de Tarjeta</label>
                          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 8px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#94a3b8'} onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
                            {billingForm.cardType === 'Visa' && <span style={{ color: '#2563eb', fontWeight: 900, fontStyle: 'italic', fontSize: '0.9rem', marginRight: '6px' }}>VISA</span>}
                            {billingForm.cardType === 'Mastercard' && (
                              <div style={{ display: 'flex', marginRight: '6px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', mixBlendMode: 'multiply' }}></div>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308', mixBlendMode: 'multiply', marginLeft: '-6px' }}></div>
                              </div>
                            )}
                            {billingForm.cardType === 'Amex' && <span style={{ background: '#3b82f6', color: '#fff', padding: '2px 4px', borderRadius: '2px', fontSize: '0.5rem', fontWeight: 900, marginRight: '6px' }}>AMEX</span>}
                            <select value={billingForm.cardType} onChange={e => setBillingForm({ ...billingForm, cardType: e.target.value })} style={{ width: '100%', padding: '8px 0', border: 'none', background: 'transparent', color: '#1e293b', fontSize: '0.85rem', outline: 'none', fontWeight: 600, cursor: 'pointer' }}>
                              <option value="Visa">Visa</option>
                              <option value="Mastercard">Mastercard</option>
                              <option value="Amex">American Express</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '160px' }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Terminación</label>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 8px', transition: 'all 0.2s' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '2px', userSelect: 'none', fontFamily: 'monospace' }}>••••</span>
                            <input type="text" maxLength="4" value={billingForm.cardDigits} onChange={e => setBillingForm({ ...billingForm, cardDigits: e.target.value.replace(/\D/g, '') })} placeholder="4821" style={{ width: '50px', padding: '8px 0 8px 6px', background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.9rem', outline: 'none', fontWeight: 800, letterSpacing: '2px', fontFamily: 'monospace' }} />
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Folio de Autorización</label>
                          <input type="text" value={billingForm.authCode} onChange={e => setBillingForm({ ...billingForm, authCode: e.target.value })} placeholder="Ej. AUT-93049" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#16a34a', fontSize: '0.85rem', outline: 'none', fontWeight: 900, letterSpacing: '1px', transition: 'all 0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {billingForm.paymentMethod === 'Transferencia' && (
                  <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.08)' }}>
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
                      <Building2 size={120} color="#94a3b8" />
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1rem', fontWeight: 900, letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building2 size={16} color="#64748b" /> TRANSFERENCIA SPEI
                        </h4>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 800, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%' }}></div>
                          Validación en cuenta
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Banco de Origen</label>
                          <input type="text" value={billingForm.bankOrigin} onChange={e => setBillingForm({ ...billingForm, bankOrigin: e.target.value })} placeholder="Ej. BBVA, Santander, Banorte..." style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#1e293b', fontSize: '0.85rem', outline: 'none', fontWeight: 600, transition: 'all 0.2s' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Clave de Rastreo (CEP)</label>
                          <input type="text" value={billingForm.trackingKey} onChange={e => setBillingForm({ ...billingForm, trackingKey: e.target.value })} placeholder="Ej. 2024051240014B..." style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#1e293b', fontSize: '0.85rem', outline: 'none', fontWeight: 600, transition: 'all 0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px', display: 'block' }}>Referencia / Notas (opcional)</label>
                  <input
                    type="text"
                    value={billingForm.reference}
                    onChange={(e) => setBillingForm({ ...billingForm, reference: e.target.value })}
                    placeholder="Observaciones o detalles adicionales..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <button onClick={() => handleMarkAsInvoiced(selectedBill)} style={{ width: '100%', padding: '16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgba(22,163,74,0.39)', transition: 'all 0.2s' }}>
                  <Check size={20} /> Cobrar y generar factura
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      {invoicePreview && (
        <div id="print-wrapper" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="print-area" style={{ background: '#fff', width: '100%', maxWidth: '850px', maxHeight: '95vh', overflowY: 'auto', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative', fontFamily: "'Inter', sans-serif" }}>

            <div style={{ padding: '40px', borderBottom: '2px solid #2D5A3F', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src={AGRIFLOW_LOGO} alt="AgriFlow Logo" style={{ height: '40px' }} />
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#2D5A3F', letterSpacing: '-1px' }}>AgriFlow Pro</h1>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>FACTURA FISCAL</h2>
              </div>
            </div>

            <div style={{ padding: '0 40px', marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Folio</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }}>#INV-{String(invoicePreview.id).padStart(5, '0')}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Fecha de Emisión</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }}>{new Date().toLocaleDateString('es-MX')}</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 40px' }}>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 900, color: '#2D5A3F', textTransform: 'uppercase', letterSpacing: '1px' }}>Emisor</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>AgriFlow Corporativo S.A. de C.V.</p>
                  <p style={{ margin: '0 0 2px 0', color: '#475569', fontSize: '0.85rem' }}>RFC: AGR240501XX1</p>
                  <p style={{ margin: '0 0 2px 0', color: '#475569', fontSize: '0.85rem' }}>Régimen: 601 - General de Ley Personas Morales</p>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>CP: 76000, Querétaro, México</p>
                </div>
                <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 900, color: '#2D5A3F', textTransform: 'uppercase', letterSpacing: '1px' }}>Receptor</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>{invoicePreview.cliente}</p>
                  <p style={{ margin: '0 0 2px 0', color: '#475569', fontSize: '0.85rem' }}>RFC: {invoicePreview.clientRFC || 'XAXX010101000'} {!invoicePreview.clientRFC && '(Público General)'}</p>
                  <p style={{ margin: '0 0 2px 0', color: '#475569', fontSize: '0.85rem' }}>Uso CFDI: G03 - Gastos en general</p>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>CP: {invoicePreview.clientCP || '00000'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Método de Pago</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>PUE - Una sola exhibición</p>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Forma de Pago</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>{invoicePreview.paymentMethod || '03 - Transferencia'}</p>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Moneda</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>MXN - Peso Mexicano</p>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Tipo Comprobante</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>I - Ingreso</p>
                </div>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#2D5A3F', color: '#ffffff' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 800 }}>CLAVE/UNIDAD</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 800 }}>DESCRIPCIÓN</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: 800 }}>CANT.</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 800 }}>P. UNITARIO</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 800 }}>IMPORTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ color: '#0f172a', fontWeight: 700 }}>10161500</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>H87 - Pieza</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ color: '#0f172a', fontWeight: 700 }}>{invoicePreview.producto}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Abono Orgánico Premium</div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#0f172a' }}>{invoicePreview.cantidad || 1}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#0f172a' }}>{(invoicePreview.precio / 1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#0f172a', fontWeight: 700 }}>{(invoicePreview.precio / 1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <div style={{ width: '300px', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#475569', fontSize: '0.9rem' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontWeight: 700 }}>{(invoicePreview.precio / 1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#475569', fontSize: '0.9rem' }}>
                    <span>IVA (16%):</span>
                    <span style={{ fontWeight: 700 }}>{(invoicePreview.precio - (invoicePreview.precio / 1.16)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '2px solid #e2e8f0', marginTop: '12px', color: '#0f172a', fontSize: '1.2rem', fontWeight: 900 }}>
                    <span>TOTAL:</span>
                    <span style={{ color: '#16a34a' }}>{(invoicePreview.precio || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px', display: 'flex', gap: '24px' }}>
                <div style={{ width: '130px', height: '130px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={40} color="#cbd5e1" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#2D5A3F', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>UUID (Folio Fiscal)</p>
                    <p style={{ margin: 0, color: '#0f172a', fontSize: '0.75rem', fontFamily: 'monospace' }}>550e8400-e29b-41d4-a716-446655440000</p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#2D5A3F', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Sello Digital del Emisor</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.55rem', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: '1.2' }}>iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFmklEQVR4nO2dS27cRhCG...</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#2D5A3F', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Cadena Original del Timbre</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.55rem', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: '1.2' }}>||1.1|550e8400-e29b-41d4-a716-446655440000|2024-05-12T14:30:00|SAT970701NN3|...</p>
                  </div>
                </div>
              </div>

              <div className="no-print" style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                <button onClick={() => setInvoicePreview(null)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#475569', fontWeight: 800, cursor: 'pointer' }}>
                  Cerrar
                </button>
                <button onClick={() => window.print()} style={{ padding: '12px 24px', background: '#2D5A3F', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgba(45,90,63,0.39)' }}>
                  <Download size={18} /> Imprimir / PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('Dashboard');
  const [cart, setCart] = useState([]);

  // Estados de UI para Sidebar (Secciones colapsables)
  const [comercialOpen, setComercialOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);
  const [operacionOpen, setOperacionOpen] = useState(true);
  const [logisticaOpen, setLogisticaOpen] = useState(true);

  // Estado centralizado de datos (desde la BD)
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [carteraList, setCarteraList] = useState([]);
  const [backorders, setBackorders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [quotingProspect, setQuotingProspect] = useState(null);
  const [manualClientName, setManualClientName] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState(new Date().toISOString().split('T')[0]);
  const [editingFolio, setEditingFolio] = useState(null);
  const [previousView, setPreviousView] = useState('Dashboard');
  const [previousMode, setPreviousMode] = useState('prospects');
  const [autoEditProspectId, setAutoEditProspectId] = useState(null);

  // Cargar datos al iniciar la aplicación
  useEffect(() => {
    fetchProducts();
    if (user) {
      refreshAllData();
    }
  }, [user]);

  const refreshAllData = async () => {
    try {
      console.log('Fetching all global data...');
      const responses = await Promise.all([
        fetch('/api/ventas'),
        fetch('/api/cartera'),
        fetch('/api/backorders'),
        fetch('/api/activities'),
        fetch('/api/prospects'),
        fetch('/api/products')
      ]);

      const results = await Promise.all(responses.map(async (r, i) => {
        if (!r.ok) console.error(`Failed to fetch API ${i}: Status ${r.status}`);
        return r.json();
      }));

      const [v, c, b, a, p, pr] = results;
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
      setProducts(Array.isArray(pr) ? pr : []);
    } catch (err) { console.error('Error sincronizando datos globales:', err); }
  };

  const handleDeliver = async (b) => {
    if (!confirm(`¿Confirmar entrega física de ${b.pendiente} unidades de ${b.producto} para ${b.cliente}?`)) return;
    try {
      const numericId = typeof b.id === 'string' && b.id.includes('temp_') ? b.id : parseInt(b.id);
      const resp = await fetch(`/api/backorders/${numericId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendiente: 0, status: 'Entregado', deliveredAt: new Date().toISOString() })
      });
      if (resp.ok) {
        if (b.isNewClient) {
          try {
            const nameToCheck = (b.cliente || '').trim().toLowerCase();
            const existingProspect = (prospects || []).find(
              p => (p.name || '').trim().toLowerCase() === nameToCheck
            );

            if (existingProspect) {
              await fetch(`/api/prospects/${existingProspect.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  isClient: true,
                  stage: 'Venta Completada'
                })
              });
              alert(`¡Pedido entregado! El prospecto "${b.cliente}" ha sido promovido a Cliente oficial.`);
            } else {
              await fetch('/api/prospects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: b.cliente,
                  email: 'cliente.nuevo@agriflow.com',
                  phone: 'Sin registrar',
                  interest: `Primera compra: ${b.producto}`,
                  budget: b.cantidad * (b.precio || 0),
                  stage: 'Venta Completada',
                  isClient: true,
                  seller: b.vendedor || user?.name
                })
              });
              alert('¡Pedido entregado! El cliente nuevo ha sido agregado automáticamente a tu lista oficial.');
            }
          } catch (prospectErr) {
            console.error('Error al registrar/actualizar prospecto automático:', prospectErr);
          }
        } else {
          alert('Pedido entregado correctamente.');
        }
        refreshAllData();
      } else {
        alert('Error al procesar la entrega en el servidor.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].qty = (newCart[existingItemIndex].qty || 1) + quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, qty: quantity }]);
    }
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const updateCartQty = (index, newQty) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].qty = parseInt(newQty) || 0;
    setCart(newCart);
  };

  const handleEditOrder = (order) => {
    // Guardar la vista origen para retornar a ella después de finalizar o cancelar el pedido
    setPreviousView(view);

    // 1. Filtrar los productos originales de este folio
    const items = backorders.filter(it => (it.documento || `AGRO-${it.id}`) === order.documento);

    // 2. Preparar el carrito
    const cartItems = items.map(it => {
      const originalProduct = products.find(p => p.name === it.producto);
      return {
        ...originalProduct,
        id: originalProduct?.id || it.id,
        name: it.producto,
        price: it.precio || 0,
        qty: it.cantidad || 0
      };
    });

    setCart(cartItems);
    setEditingFolio(order.documento);

    // 3. Detectar si es prospecto o manual
    const prospect = prospects.find(p => p.name === order.cliente);
    if (prospect) {
      setQuotingProspect(prospect);
      setManualClientName('');
    } else {
      setQuotingProspect(null);
      setManualClientName(order.cliente);
    }

    setView('Cotizador');
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setView('Dashboard');
    setCart([]);
  };




  const handleNavigateWithData = (targetView, clientName, mode = 'prospects') => {
    // Guardar de dónde venimos antes de ir al Cotizador
    if (targetView === 'Cotizador' || targetView === 'productos') {
      setPreviousView(view);
      setPreviousMode(mode);
    }

    if (targetView === 'productos' || targetView === 'Cotizador') {
      const prospect = prospects.find(p => p.name === clientName);
      if (prospect) {
        setQuotingProspect(prospect);
        setManualClientName('');
      } else {
        setQuotingProspect(null);
        setManualClientName(clientName || '');
      }
      setEditingFolio(null);
      setCart([]);
      setView('Cotizador');
    } else {
      setView(targetView);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'Dashboard': return <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />;
      case 'Pedidos': return <BackordersModule
        onBack={() => setView('Dashboard')}
        user={user}
        refreshAllData={refreshAllData}
        onEditOrder={handleEditOrder}
        isNewClientFilter={true}
        title="Pedidos"
        products={products}
        prospects={prospects}
      />;
      case 'Backorders': return <BackordersModule
        onBack={() => setView('Dashboard')}
        user={user}
        refreshAllData={refreshAllData}
        onEditOrder={handleEditOrder}
        isNewClientFilter={false}
        title="Backorders"
        products={products}
        prospects={prospects}
      />;
      case 'Facturacion': return <FacturacionModule onBack={() => setView('Dashboard')} backorders={backorders} refreshData={refreshAllData} />
      case 'Logistica': return <LogisticaModule
        onBack={() => setView('Dashboard')}
        backorders={backorders}
        handleDeliver={handleDeliver}
        refreshData={refreshAllData}
        prospects={prospects}
      />;
      case 'Inventario': return <CotizadorModule onBack={() => setView('Dashboard')} onNavigate={setView} products={products} setProducts={setProducts} refreshAllData={refreshAllData} user={user} />;
      case 'KPIs': return <KpisModule onBack={() => setView('Dashboard')} sellers={sellers} setSellers={setSellers} refreshSellers={refreshAllData} prospects={prospects} backorders={backorders} carteraList={carteraList} user={user} products={products} onNavigate={setView} handleDeliver={handleDeliver} />;
      case 'Ventas': return <VentasModule onBack={() => setView('Dashboard')} onNavigate={handleNavigateWithData} setQuotingProspect={setQuotingProspect} user={user} backorders={backorders} carteraList={carteraList} prospects={prospects} refreshData={refreshAllData} initialPipelineType={previousView === 'Ventas' ? previousMode : 'prospects'} />;
      case 'Prospectos': return <ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'prospects')} mode="prospects" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} />;
      case 'Clientes': return <ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} onNavigate={(v, n) => handleNavigateWithData(v, n, 'clients')} mode="clients" autoEditProspectId={autoEditProspectId} setAutoEditProspectId={setAutoEditProspectId} backorders={backorders} />;
      case 'Cartera': return <CarteraModule onBack={() => setView('Dashboard')} carteraList={carteraList} backorders={backorders} setCarteraList={setCarteraList} refreshCartera={refreshAllData} />;
      case 'Reportes': return <ReportesModule onBack={() => setView('Dashboard')} sellers={sellers} carteraList={carteraList} backorders={backorders} activities={activities} prospects={prospects} products={products} />;
      case 'Cotizador': return <ProductosModule
        onBack={() => setView('Dashboard')}
        onNavigate={handleNavigateWithData}
        returnView={previousView}
        quotingProspect={quotingProspect}
        setQuotingProspect={setQuotingProspect}
        manualClientName={manualClientName}
        setManualClientName={setManualClientName}
        fechaEntrega={fechaEntrega}
        setFechaEntrega={setFechaEntrega}
        setManualClientName={setManualClientName}
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateCartQty={updateCartQty}
        products={products}
        setProducts={setProducts}
        user={user}
        refreshData={refreshAllData}
        prospects={prospects}
        backorders={backorders}
        editingFolio={editingFolio}
        setEditingFolio={setEditingFolio}
        setAutoEditProspectId={setAutoEditProspectId}
      />;
       case 'Personal': return <PersonalModule onBack={() => setView('Dashboard')} user={user} />;
      case 'CentroControl':
        return (user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'Admin' || user?.role === 'admin' || user?.role === 'Administrador') ? (
          <CentroControlModule onBack={() => setView('Dashboard')} user={user} activities={activities} backorders={backorders} prospects={prospects} />
        ) : (
          <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />
        );
      case 'Sistema': 
        return (user?.role === 'Master' || user?.role === 'Administrador Master') ? (
          <SistemaModule onBack={() => setView('Dashboard')} />
        ) : (
          <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />
        );
      default: return <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} expandOrderItems={expandOrderItems} />;
    }
  };

  console.log('App Rendering... User state:', user);

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  return (
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

          <SidebarSection title="OPERACIÓN" isOpen={operacionOpen} onToggle={() => setOperacionOpen(!operacionOpen)} />
          {operacionOpen && (
            <>
              {user?.role !== 'Vendedor' && user?.role !== 'vendedor' && (
                <SidebarItem icon={Package} label="Inventario" active={view === 'Inventario'} onClick={() => setView('Inventario')} />
              )}
              <SidebarItem icon={FileText} label="Cotizador" active={view === 'Cotizador'} onClick={() => setView('Cotizador')} />
              <SidebarItem icon={ClipboardList} label="Pedidos" active={view === 'Pedidos'} onClick={() => setView('Pedidos')} />
              <SidebarItem icon={Box} label="Backorders" active={view === 'Backorders'} onClick={() => setView('Backorders')} />
            </>
          )}

          <SidebarSection title="COMERCIAL" isOpen={comercialOpen} onToggle={() => setComercialOpen(!comercialOpen)} />
          {comercialOpen && (
            <>
              <SidebarItem icon={Users} label="Prospectos" active={view === 'Prospectos'} onClick={() => setView('Prospectos')} />
              <SidebarItem icon={Users} label="Clientes" active={view === 'Clientes'} onClick={() => setView('Clientes')} />
              <SidebarItem icon={DollarSign} label="Pipeline de Ventas" active={view === 'Ventas'} onClick={() => setView('Ventas')} />
              <SidebarItem icon={Receipt} label="Facturación" active={view === 'Facturacion'} onClick={() => setView('Facturacion')} />
              <SidebarItem icon={Building2} label="Cartera" active={view === 'Cartera'} onClick={() => setView('Cartera')} />
              <SidebarItem icon={TrendingUp} label="KPIs" active={view === 'KPIs'} onClick={() => setView('KPIs')} />
            </>
          )}

          <SidebarSection title="LOGÍSTICA" isOpen={logisticaOpen} onToggle={() => setLogisticaOpen(!logisticaOpen)} />
          {logisticaOpen && (
            <>
              <SidebarItem icon={Truck} label="Logística" active={view === 'Logistica'} onClick={() => setView('Logistica')} />
            </>
          )}

          <SidebarSection title="ADMINISTRACIÓN" isOpen={adminOpen} onToggle={() => setAdminOpen(!adminOpen)} />
          {adminOpen && (
            <>
              {user?.role !== 'Vendedor' && user?.role !== 'vendedor' && (
                <SidebarItem icon={BarChart2} label="Reportes" active={view === 'Reportes'} onClick={() => setView('Reportes')} />
              )}
              {user?.role !== 'Vendedor' && user?.role !== 'vendedor' && (
                <SidebarItem icon={Users} label="Personal" active={view === 'Personal'} onClick={() => setView('Personal')} />
              )}
              {(user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'Admin' || user?.role === 'admin' || user?.role === 'Administrador') && (
                <SidebarItem icon={ShieldAlert} label="Centro de Control" active={view === 'CentroControl'} onClick={() => setView('CentroControl')} />
              )}
              {(user?.role === 'Master' || user?.role === 'Administrador Master') && (
                <SidebarItem icon={Settings} label="Sistema" active={view === 'Sistema'} onClick={() => setView('Sistema')} />
              )}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email" style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>{user.role}</span>
            </div>
          </div>
          <div className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}


function SistemaModule({ onBack }) {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logFilter, setLogFilter] = useState('Todos');
  const [periodFilter, setPeriodFilter] = useState('Últimas 24 horas');
  const [dbLatency, setDbLatency] = useState(40);
  
  // Real-time fluctuating metrics
  const [cpuHistory, setCpuHistory] = useState([38, 42, 40, 45, 48, 43, 41, 44, 46, 42, 39, 45, 47, 43, 42]);
  const [memHistory, setMemHistory] = useState([74, 75, 76, 75, 77, 76, 75, 78, 76, 75, 74, 76, 77, 75, 76]);
  const [reqHistory, setReqHistory] = useState([1180, 1220, 1205, 1250, 1290, 1240, 1210, 1235, 1260, 1220, 1195, 1245, 1270, 1230, 1248]);
  const [errHistory, setErrHistory] = useState([12, 15, 14, 18, 22, 16, 13, 17, 19, 15, 11, 16, 21, 14, 17]);
  
  const [memOptimizing, setMemOptimizing] = useState(false);
  const [activeProblems, setActiveProblems] = useState([
    { id: 1, name: 'API de Ventas desconectada', time: 'Hace 4 min', type: 'Crítico', action: 'Ver detalles', desc: 'El servicio externo de sincronización con CRM ventas arrojó un error de socket timeout.' },
    { id: 2, name: 'Uso de memoria elevado', time: '76% utilizado', type: 'Advertencia', action: 'Optimizar', desc: 'La memoria interna asignada al buffer de carga de PDF y Excel está superando el umbral recomendado del 70%.' },
    { id: 3, name: 'Inventario no sincronizado', time: '12 productos afectados', type: 'Crítico', action: 'Ver detalles', desc: 'Se detectaron 12 productos con desfase de stock físico respecto al sistema central.' }
  ]);

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solveStep, setSolveStep] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeStep, setOptimizeStep] = useState('');
  const [toast, setToast] = useState(null);

  const [showAllServicesModal, setShowAllServicesModal] = useState(false);
  const [showAllLogsModal, setShowAllLogsModal] = useState(false);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [restartingServiceId, setRestartingServiceId] = useState(null);
  const [allServices, setAllServices] = useState([
    { id: 1, name: 'API de Ventas', status: 'Operativo', latency: 120, uptime: 99.98, checkTime: 'Hace 30 seg' },
    { id: 2, name: 'Base de Datos', status: 'Operativo', latency: 19, uptime: 100.0, checkTime: 'Hace 15 seg' },
    { id: 3, name: 'API de Inventario', status: 'Operativo', latency: 98, uptime: 99.95, checkTime: 'Hace 20 seg' },
    { id: 4, name: 'Servicio SAT', status: 'Advertencia', latency: 890, uptime: 98.42, checkTime: 'Hace 45 seg' },
    { id: 5, name: 'Servicio de Correos', status: 'Caído', latency: 0, uptime: 92.11, checkTime: 'Hace 2 min' },
    { id: 6, name: 'Servidor de Archivos', status: 'Operativo', latency: 110, uptime: 99.99, checkTime: 'Hace 30 seg' },
    { id: 7, name: 'API de Facturación', status: 'Operativo', latency: 135, uptime: 99.97, checkTime: 'Hace 1 min' },
    { id: 8, name: 'Servicio de Clima / Geoloc', status: 'Operativo', latency: 245, uptime: 99.89, checkTime: 'Hace 3 min' },
    { id: 9, name: 'Notificaciones Push', status: 'Operativo', latency: 80, uptime: 99.96, checkTime: 'Hace 50 seg' }
  ]);

  const handleRestartService = (id) => {
    setRestartingServiceId(id);
    
    setTimeout(() => {
      setAllServices(prev => prev.map(s => {
        if (s.id === id) {
          return { ...s, status: 'Operativo', latency: Math.floor(Math.random() * 50 + 50), uptime: parseFloat(Math.min(100, s.uptime + 0.15).toFixed(2)) };
        }
        return s;
      }));
      setRestartingServiceId(null);
      showToast(`Servicio ${allServices.find(s => s.id === id).name} restablecido correctamente`, 'success');
    }, 2000);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fetchSystemData = () => {
    const startTime = Date.now();
    fetch('/api/system/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoadingStats(false);
        setDbLatency(Date.now() - startTime);
      })
      .catch(() => setLoadingStats(false));

    fetch('/api/system/logs')
      .then(r => r.json())
      .then(data => {
        setLogs(data);
        setLoadingLogs(false);
      })
      .catch(() => setLoadingLogs(false));
  };

  useEffect(() => {
    fetchSystemData();
    const dataInterval = setInterval(fetchSystemData, 8000);

    const graphInterval = setInterval(() => {
      setCpuHistory(prev => {
        const nextVal = Math.max(20, Math.min(60, Math.round(prev[prev.length - 1] + (Math.random() * 8 - 4))));
        return [...prev.slice(1), nextVal];
      });

      setMemHistory(prev => {
        if (memOptimizing) return prev;
        const nextVal = Math.max(65, Math.min(84, Math.round(prev[prev.length - 1] + (Math.random() * 4 - 2))));
        return [...prev.slice(1), nextVal];
      });

      setReqHistory(prev => {
        const nextVal = Math.max(800, Math.min(1800, Math.round(prev[prev.length - 1] + (Math.random() * 120 - 60))));
        return [...prev.slice(1), nextVal];
      });

      setErrHistory(prev => {
        const nextVal = Math.max(2, Math.min(30, Math.round(prev[prev.length - 1] + (Math.random() * 6 - 3))));
        return [...prev.slice(1), nextVal];
      });
    }, 3500);

    return () => {
      clearInterval(dataInterval);
      clearInterval(graphInterval);
    };
  }, [memOptimizing]);

  const handleOptimizeMemory = () => {
    setIsOptimizing(true);
    setOptimizeStep('Analizando fragmentación de memoria...');
    
    setTimeout(() => {
      setOptimizeStep('Liberando buffers temporales y caché de PDF/Excel...');
    }, 1000);

    setTimeout(() => {
      setOptimizeStep('Compactando bloques y optimizando recolector de basura...');
    }, 2000);

    setTimeout(() => {
      setMemHistory(prev => {
        const resetData = [...prev];
        resetData[resetData.length - 1] = 42;
        resetData[resetData.length - 2] = 45;
        resetData[resetData.length - 3] = 48;
        return resetData;
      });
      setActiveProblems(prev => prev.filter(p => p.id !== 2));
      setIsOptimizing(false);
      showToast('Memoria física liberada y optimizada con éxito. Uso actual: 42%', 'success');
    }, 3200);
  };

  const handleShowProblemDetails = (problem) => {
    setSelectedProblem(problem);
  };

  const handleSolveProblem = (problemId) => {
    setIsSolving(true);
    setSolveStep('Iniciando diagnóstico automático...');

    setTimeout(() => {
      if (problemId === 1) {
        setSolveStep('Intentando reconexión a API Ventas (Handshake SSL)...');
      } else {
        setSolveStep('Sincronizando stock local con inventario central...');
      }
    }, 1200);

    setTimeout(() => {
      setSolveStep('Validando integridad de la respuesta del servidor...');
    }, 2400);

    setTimeout(() => {
      setActiveProblems(prev => prev.filter(p => p.id !== problemId));
      setIsSolving(false);
      setSelectedProblem(null);
      showToast(`Problema resuelto con éxito: ${problemId === 1 ? 'API de Ventas restablecida' : 'Inventario sincronizado'}`, 'success');
    }, 3600);
  };

  const Sparkline = ({ data, color, isBar = false }) => {
    const width = 140;
    const height = 40;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    if (isBar) {
      const barWidth = width / data.length;
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {data.map((val, i) => {
            const barHeight = ((val - min * 0.8) / (max - min * 0.8 || 1)) * height * 0.8 + 4;
            return (
              <rect
                key={i}
                x={i * barWidth + 1}
                y={height - barHeight}
                width={barWidth - 2}
                height={barHeight}
                fill={color}
                rx={1.5}
              />
            );
          })}
        </svg>
      );
    }

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min * 0.8) / (max - min * 0.8 || 1)) * height * 0.8 - 4;
      return `${x},${y}`;
    });

    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.00" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${color})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const CircularProgress = ({ percent }) => {
    const size = 68;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
    );
  };

  const formatUptimeFull = (seconds) => {
    if (!seconds) return '15 días, 7 horas, 42 min';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d > 0 ? d + ' días, ' : ''}${h} horas, ${m} min`;
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const errorCount = logs.filter(l => l.type === 'ERROR').length;
  const warnCount = logs.filter(l => l.type === 'WARNING').length;
  const systemHealth = Math.max(75, 98 - activeProblems.length * 4 - errorCount * 2);

  const logTypes = ['Todos', 'Error', 'Warning', 'Info', 'Debug'];
  const getFilteredLogs = () => {
    if (logFilter === 'Todos') return logs;
    return logs.filter(l => {
      if (logFilter === 'Error') return l.type === 'ERROR';
      if (logFilter === 'Warning') return l.type === 'WARNING';
      if (logFilter === 'Info') return l.type === 'INFO';
      if (logFilter === 'Debug') return l.type === 'DEBUG';
      return true;
    });
  };

  const currentLogs = getFilteredLogs();

  const handleExportLogs = () => {
    const logContent = getFilteredLogs()
      .map(l => `[${formatTime(l.timestamp)}] [${l.type}] ${l.message}`)
      .join('\n');
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agriflow_system_logs_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Logs exportados correctamente', 'success');
  };

  return (
    <div className="sys-monitor-container">
      <style>{`
        .sys-monitor-container {
          font-family: 'Inter', system-ui, sans-serif;
          color: #0f172a;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px;
        }
        .sys-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sys-title-group h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px 0;
          letter-spacing: -0.5px;
        }
        .sys-title-group p {
          color: #64748b;
          font-size: 0.85rem;
          margin: 0;
          font-weight: 500;
        }
        .sys-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sys-select {
          padding: 6px 12px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: white;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          outline: none;
        }
        .sys-live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0fdf4;
          border: 1.5px solid #dcfce7;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #16a34a;
        }
        .sys-live-dot {
          width: 7px;
          height: 7px;
          background: #16a34a;
          border-radius: 50%;
          animation: sys-pulse 1.8s infinite;
        }
        @keyframes sys-pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.4); }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        .sys-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .sys-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease;
          position: relative;
        }
        .sys-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.05);
          border-color: #cbd5e1;
        }
        .sys-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .sys-card-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sys-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sys-giant-value {
          font-size: 1.9rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .sys-card-subtext {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 500;
        }
        .sys-card-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
        }
        .sys-badge {
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 800;
        }
        .sys-badge-green { background: #dcfce7; color: #15803d; }
        .sys-badge-yellow { background: #fef3c7; color: #b45309; }
        .sys-badge-red { background: #fee2e2; color: #b91c1c; }
        .sys-middle-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 16px;
        }
        .sys-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);
        }
        .sys-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .sys-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .sys-panel-badge {
          background: #fee2e2;
          color: #b91c1c;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .sys-problems-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sys-problem-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
        }
        .sys-problem-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sys-problem-info h4 {
          font-size: 0.8rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1px 0;
        }
        .sys-problem-info span {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
        }
        .sys-problem-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sys-btn-sm {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sys-btn-sm:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }
        .sys-metrics-subgrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .sys-metric-box {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .sys-metric-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .sys-metric-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
        }
        .sys-metric-value {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
        }
        .sys-sparkline-container {
          height: 38px;
          margin-top: 6px;
        }
        .sys-table {
          width: 100%;
          border-collapse: collapse;
        }
        .sys-table th {
          text-align: left;
          padding: 10px 12px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          border-bottom: 1.5px solid #f1f5f9;
        }
        .sys-table td {
          padding: 11px 12px;
          font-size: 0.8rem;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          font-weight: 500;
        }
        .sys-table tr:last-child td {
          border-bottom: none;
        }
        .sys-table tr:hover td {
          background: #f8fafc;
        }
        .sys-log-filters {
          display: flex;
          gap: 4px;
        }
        .sys-log-btn {
          padding: 4px 10px;
          border-radius: 12px;
          border: none;
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          cursor: pointer;
        }
        .sys-log-btn.active {
          background: #10b981;
          color: white;
        }
        .sys-log-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 220px;
          overflow-y: auto;
        }
        .sys-log-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
        }
        .sys-log-badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.62rem;
          font-weight: 800;
        }
        .sys-footer-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px 16px;
        }
        .sys-footer-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sys-footer-title {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .sys-footer-value {
          font-size: 0.78rem;
          font-weight: 600;
          color: #1e293b;
        }
        .sys-progress-track {
          width: 100%;
          height: 5px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 3px;
        }
        
        /* Premium Custom Modal and Overlay Styles */
        .sys-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: sys-fade-in 0.2s ease-out;
        }
        @keyframes sys-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .sys-modal-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          width: 90%;
          max-width: 520px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: sys-slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes sys-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .sys-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sys-modal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
        .sys-modal-close {
          background: none;
          border: none;
          font-size: 1.1rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.15s;
        }
        .sys-modal-close:hover {
          color: #0f172a;
        }
        .sys-modal-desc {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 4px 0;
          font-weight: 500;
        }
        .sys-modal-logs-box {
          background: #0f172a;
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border: 1px solid #1e293b;
        }
        .sys-modal-logs-header {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .sys-modal-logs-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: 120px;
          overflow-y: auto;
        }
        .sys-modal-logs-content code {
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.75rem;
          color: #e2e8f0;
          white-space: pre-wrap;
          word-break: break-all;
          text-align: left;
        }
        .sys-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }
        .sys-btn-primary {
          background: #10b981;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sys-btn-primary:hover {
          background: #059669;
        }
        .sys-btn-primary:disabled {
          background: #a7f3d0;
          color: #047857;
          cursor: not-allowed;
        }
        .sys-btn-secondary {
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .sys-btn-secondary:hover {
          background: #e2e8f0;
        }
        .sys-btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .sys-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f1f5f9;
          border-top: 4px solid #10b981;
          border-radius: 50%;
          animation: sys-spin 1s linear infinite;
        }
        .sys-spinner-tiny {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: sys-spin 0.8s linear infinite;
        }
        @keyframes sys-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Custom Toast Styles */
        .sys-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f172a;
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          font-weight: 600;
          z-index: 11000;
          animation: sys-toast-slide 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          border-left: 4px solid #10b981;
        }
        @keyframes sys-toast-slide {
          from { transform: translateY(100%) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Header section with page controls */}
      <div className="sys-header">
        <div className="sys-title-group">
          <h1>Supervisión del Sistema</h1>
          <p>Centro de monitoreo y estado en tiempo real</p>
        </div>
        
        <div className="sys-controls">
          <select 
            className="sys-select" 
            value={periodFilter} 
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option>Últimas 24 horas</option>
            <option>Última hora</option>
            <option>Últimos 7 días</option>
          </select>
          
          <div className="sys-live-indicator">
            <span className="sys-live-dot"></span>
            Actualización automática: En vivo
          </div>
          
          <button className="sys-btn-sm" onClick={onBack}>Volver</button>
        </div>
      </div>

      {/* Top 4 Premium Metric Cards */}
      <div className="sys-cards-grid">
        {/* 1. Estado del Sistema */}
        <div className="sys-card">
          <div className="sys-card-header">
            <div>
              <span className="sys-card-title">Estado del Sistema</span>
              <div className="sys-giant-value" style={{ marginTop: '4px' }}>{systemHealth}%</div>
              <span className="sys-card-subtext">Salud del Sistema</span>
            </div>
            <CircularProgress percent={systemHealth} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="sys-badge sys-badge-green">Excelente</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Última caída: hace 12 días</span>
          </div>
          <div style={{ height: '14px', marginTop: '8px' }}>
            <Sparkline data={[92, 92, 91, 93, 92, 92, 94, 93, 92, 92, 95, 93, 92, 92, 92]} color="#10b981" />
          </div>
        </div>

        {/* 2. Errores Críticos */}
        <div className="sys-card" style={{ borderLeft: '3px solid #ef4444' }}>
          <div className="sys-card-header" style={{ marginBottom: 0 }}>
            <div>
              <span className="sys-card-title">Errores Críticos</span>
              <div className="sys-giant-value" style={{ color: '#ef4444', marginTop: '4px' }}>{errorCount}</div>
              <span className="sys-card-subtext">
                {errorCount > 0 ? '1 requiere atención inmediata' : 'Sin errores críticos'}
              </span>
            </div>
            <div className="sys-icon-circle" style={{ background: '#fee2e2' }}>
              <AlertCircle size={20} color="#ef4444" />
            </div>
          </div>
        </div>

        {/* 3. Alertas Activas */}
        <div className="sys-card" style={{ borderLeft: '3px solid #f59e0b' }}>
          <div className="sys-card-header" style={{ marginBottom: 0 }}>
            <div>
              <span className="sys-card-title">Alertas Activas</span>
              <div className="sys-giant-value" style={{ color: '#f59e0b', marginTop: '4px' }}>{warnCount}</div>
              <span className="sys-card-subtext">
                {warnCount > 0 ? 'Requieren monitoreo' : 'Todo en orden'}
              </span>
            </div>
            <div className="sys-icon-circle" style={{ background: '#fffbeb' }}>
              <AlertTriangle size={20} color="#f59e0b" />
            </div>
          </div>
        </div>

        {/* 4. Servicios Operativos */}
        <div className="sys-card" style={{ borderLeft: '3px solid #10b981' }}>
          <div className="sys-card-header" style={{ marginBottom: 0 }}>
            <div>
              <span className="sys-card-title">Servicios Operativos</span>
              <div className="sys-giant-value" style={{ color: '#10b981', marginTop: '4px' }}>5 / 6</div>
              <span className="sys-card-subtext">83.3% en funcionamiento</span>
            </div>
            <div className="sys-icon-circle" style={{ background: '#dcfce7' }}>
              <CheckCircle2 size={20} color="#10b981" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid - Active Problems (Left) & Fluctuating Metrics (Right) */}
      <div className="sys-middle-grid">
        {/* Active Problems panel */}
        <div className="sys-panel" id="sys-problems-panel">
          <div className="sys-panel-header">
            <h3 className="sys-panel-title">
              <AlertCircle size={20} color="#ef4444" />
              Problemas Activos
            </h3>
            <span className="sys-panel-badge">{activeProblems.length}</span>
          </div>

          <div className="sys-problems-list">
            {activeProblems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '0.85rem' }}>
                ✓ No se detectaron problemas activos en el sistema.
              </div>
            ) : (
              activeProblems.map(p => (
                <div className="sys-problem-item" key={p.id}>
                  <div className="sys-problem-left">
                    <div style={{ display: 'flex', background: p.type === 'Crítico' ? '#fee2e2' : '#fffbeb', padding: '6px', borderRadius: '8px' }}>
                      {p.type === 'Crítico' ? <AlertCircle size={16} color="#ef4444" /> : <AlertTriangle size={16} color="#f59e0b" />}
                    </div>
                    <div className="sys-problem-info">
                      <h4>{p.name}</h4>
                      <span>{p.time}</span>
                    </div>
                  </div>
                  <div className="sys-problem-right">
                    <span className={`sys-badge ${p.type === 'Crítico' ? 'sys-badge-red' : 'sys-badge-yellow'}`}>{p.type}</span>
                    <button 
                      className="sys-btn-sm" 
                      onClick={() => p.action === 'Optimizar' ? handleOptimizeMemory() : handleShowProblemDetails(p)}
                    >
                      {p.action}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => scrollToSection('sys-problems-panel')}>Ver todos los problemas</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Fluctuating System Metrics panel */}
        <div className="sys-panel">
          <div className="sys-panel-header" style={{ marginBottom: '12px' }}>
            <h3 className="sys-panel-title">
              <TrendingUp size={20} color="#3b82f6" />
              Rendimiento de Recursos
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Promedio últimas 24h</span>
          </div>

          <div className="sys-metrics-subgrid">
            {/* CPU box */}
            <div className="sys-metric-box">
              <div className="sys-metric-header">
                <span className="sys-metric-title">Uso de CPU</span>
                <span className="sys-metric-value">{cpuHistory[cpuHistory.length - 1]}%</span>
              </div>
              <div className="sys-sparkline-container">
                <Sparkline data={cpuHistory} color="#10b981" />
              </div>
            </div>

            {/* Memory box */}
            <div className="sys-metric-box">
              <div className="sys-metric-header">
                <span className="sys-metric-title">Uso de Memoria</span>
                <span className="sys-metric-value">{memHistory[memHistory.length - 1]}%</span>
              </div>
              <div className="sys-sparkline-container">
                <Sparkline data={memHistory} color="#f59e0b" />
              </div>
            </div>

            {/* Request Rate box */}
            <div className="sys-metric-box">
              <div className="sys-metric-header">
                <span className="sys-metric-title">Peticiones por minuto</span>
                <span className="sys-metric-value">{reqHistory[reqHistory.length - 1].toLocaleString()}</span>
              </div>
              <div className="sys-sparkline-container">
                <Sparkline data={reqHistory} color="#3b82f6" isBar={true} />
              </div>
            </div>

            {/* Errors rate box */}
            <div className="sys-metric-box">
              <div className="sys-metric-header">
                <span className="sys-metric-title">Errores por hora</span>
                <span className="sys-metric-value" style={{ color: '#ef4444' }}>{errHistory[errHistory.length - 1]}</span>
              </div>
              <div className="sys-sparkline-container">
                <Sparkline data={errHistory} color="#ef4444" isBar={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Service Table (Left) & Activity Logs (Right) */}
      <div className="sys-middle-grid">
        {/* Service Table Panel */}
        <div className="sys-panel" id="sys-services-panel" style={{ padding: '20px 0' }}>
          <div className="sys-panel-header" style={{ padding: '0 20px', marginBottom: '12px' }}>
            <h3 className="sys-panel-title">
              <Settings size={20} color="#2d5a3f" />
              Estado de Servicios
            </h3>
          </div>

          <table className="sys-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Latencia</th>
                <th>Último chequeo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>API de Ventas</td>
                <td><span className="sys-badge sys-badge-green">Operativo</span></td>
                <td>120ms</td>
                <td>Hace 30 seg</td>
              </tr>
              <tr>
                <td>Base de Datos</td>
                <td><span className="sys-badge sys-badge-green">Operativo</span></td>
                <td style={{ color: dbLatency > 150 ? '#f59e0b' : '#334155' }}>
                  {dbLatency}ms
                </td>
                <td>Hace 15 seg</td>
              </tr>
              <tr>
                <td>API de Inventario</td>
                <td><span className="sys-badge sys-badge-green">Operativo</span></td>
                <td>98ms</td>
                <td>Hace 20 seg</td>
              </tr>
              <tr>
                <td>Servicio SAT</td>
                <td><span className="sys-badge sys-badge-yellow">Advertencia</span></td>
                <td>890ms</td>
                <td>Hace 45 seg</td>
              </tr>
              <tr>
                <td>Servicio de Correos</td>
                <td>
                  <span 
                    className="sys-badge sys-badge-red" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => alert('Intentando reconectar el Servicio de Correos... Error SMTP Host inalcanzable. Se reintentará en 2 min.')}
                  >
                    Caído
                  </span>
                </td>
                <td>-</td>
                <td>Hace 2 min</td>
              </tr>
              <tr>
                <td>Servidor de Archivos</td>
                <td><span className="sys-badge sys-badge-green">Operativo</span></td>
                <td>110ms</td>
                <td>Hace 30 seg</td>
              </tr>
            </tbody>
          </table>
          
          <div 
            style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px 0 20px', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', cursor: 'pointer', transition: 'all 0.2s' }}
            className="sys-panel-footer-link"
            onClick={() => setShowAllServicesModal(true)}
          >
            <span>Ver todos los servicios</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Activity Logs Panel */}
        <div className="sys-panel" id="sys-logs-panel">
          <div className="sys-panel-header" style={{ marginBottom: '16px' }}>
            <h3 className="sys-panel-title">
              <FileText size={20} color="#475569" />
              Logs Recientes
            </h3>
            
            <div className="sys-log-filters">
              {logTypes.map(t => (
                <button
                  key={t}
                  className={`sys-log-btn ${logFilter === t ? 'active' : ''}`}
                  onClick={() => setLogFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="sys-log-list">
            {loadingLogs ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Cargando logs...</div>
            ) : currentLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '0.82rem' }}>
                No hay logs del tipo seleccionado.
              </div>
            ) : (
              currentLogs.map(log => {
                const isError = log.type === 'ERROR';
                const isWarning = log.type === 'WARNING';
                const isInfo = log.type === 'INFO';
                
                let badgeClass = 'sys-badge-green';
                let iconColor = '#10b981';
                if (isError) {
                  badgeClass = 'sys-badge-red';
                  iconColor = '#ef4444';
                } else if (isWarning) {
                  badgeClass = 'sys-badge-yellow';
                  iconColor = '#f59e0b';
                } else if (log.type === 'DEBUG') {
                  badgeClass = 'sys-badge-green';
                  iconColor = '#3b82f6';
                }
                
                return (
                  <div className="sys-log-item" key={log.id}>
                    <span className={`sys-log-badge ${badgeClass}`}>{log.type}</span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>
                        {log.message}
                      </p>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500 }}>
                        Módulo: {isError ? 'Ventas' : isWarning ? 'Sistema' : isInfo ? 'Base de Datos' : 'Frontend'} • Usuario: {isError ? 'externo' : 'sistema'} • IP: 190.35.23.11
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          
          <div 
            style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', cursor: 'pointer', transition: 'all 0.2s' }}
            className="sys-panel-footer-link"
            onClick={() => setShowAllLogsModal(true)}
          >
            <span>Ver todos los logs</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Footer statistics row */}
      <div className="sys-footer-row">
        {/* 1. Información de Sistema */}
        <div className="sys-footer-item">
          <span className="sys-footer-title">
            <Info size={12} color="#64748b" />
            Información del Sistema
          </span>
          <span className="sys-footer-value">Node {stats?.nodeVersion || 'v24.14.0'}</span>
          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500 }}>
            Plataforma: {stats?.osPlatform || 'Linux/Docker'} ({stats?.osRelease?.slice(0, 12) || 'AGF-SRV-01'})
          </span>
        </div>

        {/* 2. Base de Datos */}
        <div className="sys-footer-item">
          <span className="sys-footer-title">
            <Building2 size={12} color="#64748b" />
            Base de Datos
          </span>
          <span className="sys-footer-value" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stats?.dbVersion || 'PostgreSQL 15-alpine'}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500 }}>
            Tamaño: {stats?.dbSizeStr || '16 MB'} | Conexiones: {stats?.dbConnections || 8}
          </span>
        </div>

        {/* 3. Almacenamiento */}
        <div className="sys-footer-item">
          <span className="sys-footer-title">
            <Box size={12} color="#64748b" />
            Uso de Memoria (RAM)
          </span>
          <span className="sys-footer-value">
            {stats?.usedMemGB || '3.2'} GB / {stats?.totalMemGB || '8.0'} GB
          </span>
          <div className="sys-progress-track">
            <div className="sys-progress-bar" style={{ width: `${stats?.memUsagePercent || 40}%`, background: (stats?.memUsagePercent || 40) > 75 ? '#ef4444' : '#10b981' }}></div>
          </div>
        </div>

        {/* 4. Respaldo */}
        <div className="sys-footer-item">
          <span className="sys-footer-title">
            <CheckCircle2 size={12} color="#10b981" />
            Respaldo
          </span>
          <span className="sys-footer-value">Último: Hoy 02:00 a.m.</span>
          <span style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>✓ Exitoso</span>
        </div>

        {/* 5. Uptime */}
        <div className="sys-footer-item">
          <span className="sys-footer-title">
            <Clock size={12} color="#64748b" />
            Uptime del Servidor
          </span>
          <span className="sys-footer-value" style={{ whiteSpace: 'nowrap' }}>
            {stats ? formatUptimeFull(stats.uptime) : '15 días, 7 horas, 42 min'}
          </span>
          <div className="sys-progress-track">
            <div className="sys-progress-bar" style={{ width: '99.98%', background: '#10b981' }}></div>
          </div>
        </div>
      </div>

      {/* Premium Interactive Modal for Active Problems Details */}
      {selectedProblem && (
        <div className="sys-modal-overlay">
          <div className="sys-modal-card">
            <div className="sys-modal-header">
              <h3 className="sys-modal-title">
                <AlertCircle size={22} color={selectedProblem.type === 'Crítico' ? '#ef4444' : '#f59e0b'} />
                {selectedProblem.name}
              </h3>
              <button className="sys-modal-close" onClick={() => setSelectedProblem(null)}>✕</button>
            </div>
            
            <div className="sys-modal-body" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <span className={`sys-badge ${selectedProblem.type === 'Crítico' ? 'sys-badge-red' : 'sys-badge-yellow'}`}>
                  {selectedProblem.type}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{selectedProblem.time}</span>
              </div>
              
              <p className="sys-modal-desc">{selectedProblem.desc}</p>
              
              <div className="sys-modal-logs-box">
                <div className="sys-modal-logs-header">Trazado de Diagnóstico (Live Logs)</div>
                <div className="sys-modal-logs-content">
                  {selectedProblem.id === 1 ? (
                    <>
                      <code>[11:22:15] INFO: Iniciando petición POST a /api/ventas/sync...</code>
                      <code>[11:22:18] WARNING: TCP connection reset by peer. Reintentando...</code>
                      <code>[11:22:21] ERROR: ConnectTimeoutException: Connection timed out after 3000ms.</code>
                      <code>[11:22:21] FATAL: El servicio de Ventas arrojó socket inalcanzable.</code>
                    </>
                  ) : (
                    <>
                      <code>[11:24:02] INFO: Iniciando cotejo de stock físico vs virtual...</code>
                      <code>[11:24:05] WARNING: Desfase de inventario detectado en 12 SKUs.</code>
                      <code>[11:24:06] ERROR: DB Sync Error: Bloqueo de concurrencia en tabla 'inventario'.</code>
                      <code>[11:24:06] INFO: Buffer de cola esperando reintento.</code>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sys-modal-footer">
              <button className="sys-btn-secondary" onClick={() => setSelectedProblem(null)} disabled={isSolving}>
                Cancelar
              </button>
              <button className="sys-btn-primary" onClick={() => handleSolveProblem(selectedProblem.id)} disabled={isSolving}>
                {isSolving ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="sys-spinner-tiny"></span>
                    {solveStep}
                  </div>
                ) : (
                  'Solucionar problema'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memory Optimization Overlay Progress Dialog */}
      {isOptimizing && (
        <div className="sys-modal-overlay">
          <div className="sys-modal-card" style={{ maxWidth: '420px', textAlign: 'center', padding: '30px' }}>
            <div className="sys-spinner" style={{ margin: '0 auto 20px auto' }}></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>Optimizando Sistema</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: 0 }}>
              {optimizeStep}
            </p>
          </div>
        </div>
      )}

      {/* Premium Notification Toast */}
      {toast && (
        <div className="sys-toast">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Modal de Todos los Servicios (Expanded Detailed View) */}
      {showAllServicesModal && (
        <div className="sys-modal-overlay">
          <div className="sys-modal-card" style={{ maxWidth: '800px', width: '95%' }}>
            <div className="sys-modal-header">
              <h3 className="sys-modal-title">
                <Settings size={22} color="#3b82f6" />
                Catálogo Detallado de Servicios Operativos
              </h3>
              <button className="sys-modal-close" onClick={() => setShowAllServicesModal(false)}>✕</button>
            </div>
            
            <div className="sys-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <p className="sys-modal-desc">
                Listado expandido de microservicios internos y conexiones de API de la plataforma en tiempo real.
              </p>
              
              <table className="sys-table" style={{ marginTop: '10px' }}>
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Latencia</th>
                    <th>Uptime Histórico</th>
                    <th>Último Chequeo</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {allServices.map(s => {
                    let badgeClass = 'sys-badge-green';
                    if (s.status === 'Advertencia') badgeClass = 'sys-badge-yellow';
                    if (s.status === 'Caído') badgeClass = 'sys-badge-red';
                    
                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 700, color: '#1e293b' }}>{s.name}</td>
                        <td><span className={`sys-badge ${badgeClass}`}>{s.status}</span></td>
                        <td>{s.status === 'Caído' ? '-' : `${s.latency}ms`}</td>
                        <td style={{ fontWeight: 600, color: s.uptime > 99.5 ? '#16a34a' : '#f59e0b' }}>
                          {s.uptime}%
                        </td>
                        <td>{s.checkTime}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="sys-btn-sm"
                            style={{ 
                              background: restartingServiceId === s.id ? '#f1f5f9' : '#3b82f6', 
                              color: restartingServiceId === s.id ? '#94a3b8' : 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontWeight: 700,
                              cursor: restartingServiceId === s.id ? 'not-allowed' : 'pointer'
                            }}
                            disabled={restartingServiceId !== null}
                            onClick={() => handleRestartService(s.id)}
                          >
                            {restartingServiceId === s.id ? 'Reiniciando...' : 'Reiniciar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="sys-modal-footer">
              <button className="sys-btn-secondary" onClick={() => setShowAllServicesModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal de Todos los Logs (Searchable console log window) */}
      {showAllLogsModal && (
        <div className="sys-modal-overlay">
          <div className="sys-modal-card" style={{ maxWidth: '900px', width: '95%' }}>
            <div className="sys-modal-header">
              <h3 className="sys-modal-title">
                <FileText size={22} color="#3b82f6" />
                Bitácora General de Logs del Sistema
              </h3>
              <button className="sys-modal-close" onClick={() => setShowAllLogsModal(false)}>✕</button>
            </div>
            
            <div className="sys-modal-body">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', marginBottom: '14px' }}>
                {/* Search Bar Input */}
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <input
                    type="text"
                    placeholder="Buscar en la bitácora..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      outline: 'none'
                    }}
                  />
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
                </div>
                
                {/* Log level filter pills */}
                <div className="sys-log-filters" style={{ margin: 0 }}>
                  {logTypes.map(t => (
                    <button
                      key={t}
                      className={`sys-log-btn ${logFilter === t ? 'active' : ''}`}
                      onClick={() => setLogFilter(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Dark Terminal console */}
              <div 
                className="sys-modal-logs-box" 
                style={{ 
                  background: '#090d16', 
                  maxHeight: '45vh', 
                  padding: '16px', 
                  border: '1.5px solid #1e293b'
                }}
              >
                <div className="sys-modal-logs-header" style={{ color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Consola de Auditoría (Live Audit Console)</span>
                  <span>Registros mostrados: {
                    getFilteredLogs().filter(l => 
                      l.message.toLowerCase().includes(logSearchQuery.toLowerCase())
                    ).length
                  }</span>
                </div>
                
                <div className="sys-modal-logs-content" style={{ maxHeight: '38vh', gap: '8px' }}>
                  {getFilteredLogs().filter(l => 
                    l.message.toLowerCase().includes(logSearchQuery.toLowerCase())
                  ).map(log => {
                    const isError = log.type === 'ERROR';
                    const isWarning = log.type === 'WARNING';
                    const isInfo = log.type === 'INFO';
                    
                    let color = '#3b82f6';
                    if (isError) color = '#ef4444';
                    else if (isWarning) color = '#f59e0b';
                    else if (log.type === 'DEBUG') color = '#10b981';
                    
                    return (
                      <code key={log.id} style={{ display: 'flex', gap: '8px', lineHeight: '1.4' }}>
                        <span style={{ color: '#64748b' }}>[{formatTime(log.timestamp)}]</span>
                        <span style={{ color, fontWeight: 800 }}>[{log.type}]</span>
                        <span style={{ color: '#e2e8f0' }}>{log.message}</span>
                      </code>
                    );
                  })}
                  
                  {getFilteredLogs().filter(l => 
                    l.message.toLowerCase().includes(logSearchQuery.toLowerCase())
                  ).length === 0 && (
                    <div style={{ color: '#475569', padding: '20px 0', fontSize: '0.8rem', textAlign: 'center' }}>
                      Sin coincidencias para los criterios seleccionados.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sys-modal-footer">
              <button 
                className="sys-btn-primary" 
                style={{ background: '#3b82f6' }}
                onClick={handleExportLogs}
              >
                📥 Exportar logs (.txt)
              </button>
              <button className="sys-btn-secondary" onClick={() => setShowAllLogsModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Funciones de ayuda para expandir cadenas de productos concatenadas
function splitProducts(str) {
  const parts = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
};

function expandOrderItems(items) {
  const expanded = [];
  items.forEach((it) => {
    // Si el producto incluye paréntesis, asumimos que puede ser una cadena agrupada
    if (it.producto && it.producto.includes('(') && it.producto.includes(')')) {
      const parts = splitProducts(it.producto);
      parts.forEach((part, pIdx) => {
        const matchNew = part.match(/(.+?)\s*\(P:(\d+),\s*E:(\d+),\s*R:(\d+)\)/);
        if (matchNew) {
          expanded.push({
            ...it,
            id: `${it.id}_sub_${pIdx}`,
            originalId: it.id,
            producto: matchNew[1].trim(),
            pedidoOri: parseInt(matchNew[2]),
            enviadoOri: parseInt(matchNew[3]),
            pendiente: parseInt(matchNew[4])
          });
          return;
        }
        const matchOld = part.match(/(.+?)\s*\((\d+)\)/);
        if (matchOld) {
          expanded.push({
            ...it,
            id: `${it.id}_sub_${pIdx}`,
            originalId: it.id,
            producto: matchOld[1].trim(),
            pedidoOri: parseInt(matchOld[2]),
            enviadoOri: 0,
            pendiente: parseInt(matchOld[2])
          });
          return;
        }
        // Fallback
        const pedOriFB = parseFloat(it.cantidad) || parseFloat(it.pendiente) || 0;
        expanded.push({ ...it, id: `${it.id}_sub_${pIdx}`, originalId: it.id, pedidoOri: pedOriFB, enviadoOri: 0 });
      });
    } else {
      // Item individual normal
      const pedOri = parseFloat(it.cantidad) || parseFloat(it.pendiente) || 0;
      expanded.push({
        ...it,
        originalId: it.id,
        pedidoOri: pedOri,
        enviadoOri: pedOri - (parseFloat(it.pendiente) || 0)
      });
    }
  });
  return expanded;
};

// 12. Módulo de Logística (Rediseño Profesional 2026)
function LogisticaModule({ onBack, backorders, handleDeliver, refreshData, prospects }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'prospects'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'confirm',
    onConfirm: null
  });
  const carrierOptions = ['Flota Interna AgriFlow', 'AgroEnvíos S.A. de C.V.', 'Transportes del Norte', 'Logística Express'];
  const unitOptions = ['Camión AG-01 (Kenworth)', 'Camión AG-07 (Freightliner)', 'Camioneta 3.5 Ton (Ford)', 'PickUp Distribución (Toyota)'];

  const [logisticsForm, setLogisticsForm] = useState({
    driverName: '',
    unitInfo: '',
    routeInfo: '',
    deliveryNotes: '',
    address: '',
    contact: '',
    phone: '',
    carrier: carrierOptions[0],
    tracking: `AG-${Date.now().toString().slice(-6)}`
  });
  const [deliveredQtys, setDeliveredQtys] = useState({});
  const [isPartialMode, setIsPartialMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  // Agrupar pedidos pendientes por Folio (documento)
  const pendingByFolio = (backorders || [])
    .filter(b => (b.pendiente || 0) > 0 && b.estado !== 'Cotización' && b.estado !== 'Facturación')
    .reduce((acc, b) => {
      if (!acc[b.documento]) {
        // Detectar si es cliente nuevo dinámicamente (no está en prospectos)
        const existsInProspects = (prospects || []).some(p => p.name === b.cliente);
        acc[b.documento] = {
          documento: b.documento,
          cliente: b.cliente,
          isNewClient: b.isNewClient || !existsInProspects,
          items: []
        };
      }
      acc[b.documento].items.push(b);
      return acc;
    }, {});

  const backordersEntregados = (backorders || []).filter(b => b.estado === 'Entregado' || b.pendiente === 0);

  // Filtrado por búsqueda
  const filteredDispatch = Object.values(pendingByFolio).filter(order =>
    order.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.documento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDispatchModal = (order) => {
    const expandedItems = expandOrderItems(order.items);
    const orderWithExpanded = { ...order, items: expandedItems, originalItems: order.items };
    setSelectedOrder(orderWithExpanded);
    const hasHistory = order.items.some(it => (it.dispatchHistory && it.dispatchHistory.length > 0) || it.estado === 'Parcial');
    setIsPartialMode(hasHistory);
    const initialQtys = {};
    const initSel = {};
    expandedItems.forEach(it => {
      initialQtys[it.id] = it.pendiente;
      initSel[it.id] = true;
    });
    setDeliveredQtys(initialQtys);
    setSelectedItems(initSel);

    // Buscar prospecto para obtener datos de entrega reales
    const prospect = (prospects || []).find(p => p.name === order.cliente);

    setLogisticsForm({
      driverName: order.items[0]?.driverName || '',
      unitInfo: order.items[0]?.unitInfo || '',
      routeInfo: order.items[0]?.routeInfo || '',
      deliveryNotes: order.items[0]?.deliveryNotes || '',
      address: prospect?.location || '',
      contact: prospect?.name || order.cliente,
      phone: prospect?.phone || ''
    });
  };

  const handleConfirmDispatch = () => {
    if (!logisticsForm.driverName) {
      setAlertModal({
        show: true,
        title: 'Asignar Chofer',
        message: 'Por favor asigna un chofer para el despacho de esta orden.',
        type: 'danger',
        onConfirm: null
      });
      return;
    }
    if (!logisticsForm.address || !logisticsForm.phone) {
      setAlertModal({
        show: true,
        title: 'Información Incompleta',
        message: 'La información de entrega está incompleta (se requiere Dirección y Teléfono).',
        type: 'danger',
        onConfirm: null
      });
      return;
    }

    // Validar condición de pago antes de despachar
    const isPendingPayment = selectedOrder.items.some(it => it.billingStatus === 'Pendiente Pago' || it.billingStatus === 'Requiere Factura');
    if (isPendingPayment) {
      setAlertModal({
        show: true,
        title: '¡Alto! Pendiente de Pago',
        message: 'Este pedido está pendiente de pago. Debes registrar el cobro en el módulo de Facturación antes de liberar la entrega.',
        type: 'danger',
        onConfirm: null
      });
      return;
    }

    // Si todo está correcto, pedir confirmación del despacho
    setAlertModal({
      show: true,
      title: 'Confirmar Despacho',
      message: `¿Estás seguro de que deseas confirmar el despacho para la orden ${selectedOrder.documento}?\nSe actualizará el estado de entrega en el sistema.`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          // Sincronización de Prospecto (Flujo automático de Cliente Nuevo -> Prospecto/Cliente)
          const existingProspect = (prospects || []).find(p => p.name === selectedOrder.cliente);
          if (!existingProspect) {
            console.log("Creando nuevo registro de cliente desde logística...");
            await fetch('/api/prospects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: selectedOrder.cliente,
                location: logisticsForm.address,
                phone: logisticsForm.phone,
                isClient: true,
                stage: 'Venta Cerrada',
                notes: 'Creado automáticamente desde Logística'
              })
            });
          }

          const prospect = (prospects || []).find(p => p.name === selectedOrder.cliente);
          const isClientOrder = prospect ? prospect.isClient : true;

          const groups = {};
          selectedOrder.items.forEach(pi => {
            if (!groups[pi.originalId]) groups[pi.originalId] = [];
            groups[pi.originalId].push(pi);
          });

          const promises = Object.keys(groups).map(origId => {
            const subItems = groups[origId];
            const origItem = selectedOrder.originalItems.find(it => it.id == origId) || subItems[0];
            
            const newStringParts = subItems.map(pi => {
              let del = pi.pendiente;
              if (isClientOrder && isPartialMode) {
                del = selectedItems[pi.id] ? (parseInt(deliveredQtys[pi.id]) || 0) : 0;
              }
              const newPend = Math.max(0, pi.pendiente - del);
              const newEnv = pi.enviadoOri + del;
              if (newPend > 0 || newEnv > 0) {
                return `${pi.producto} (P:${pi.pedidoOri}, E:${newEnv}, R:${newPend})`;
              }
              return null;
            }).filter(Boolean).join(', ');
            
            const totalRemaining = subItems.reduce((sum, pi) => {
              let del = pi.pendiente;
              if (isClientOrder && isPartialMode) {
                del = selectedItems[pi.id] ? (parseInt(deliveredQtys[pi.id]) || 0) : 0;
              }
              return sum + Math.max(0, pi.pendiente - del);
            }, 0);
            
            const currentDispatch = {
              id: `disp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              date: new Date().toISOString(),
              type: totalRemaining === 0 ? 'Entrega final' : `Parcial #${(origItem.dispatchHistory || []).length + 1}`,
              status: 'En tránsito',
              guide: logisticsForm.tracking || 'Sin guía asignada',
              items: subItems.map(pi => {
                let del = pi.pendiente;
                if (isClientOrder && isPartialMode) del = selectedItems[pi.id] ? (parseInt(deliveredQtys[pi.id]) || 0) : 0;
                return { producto: pi.producto, cantidad: del };
              }).filter(it => it.cantidad > 0),
              totalPieces: subItems.reduce((sum, pi) => {
                let del = pi.pendiente;
                if (isClientOrder && isPartialMode) del = selectedItems[pi.id] ? (parseInt(deliveredQtys[pi.id]) || 0) : 0;
                return sum + del;
              }, 0)
            };
            
            return fetch(`/api/backorders/${origId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...origItem,
                producto: newStringParts || 'Orden completada',
                pendiente: totalRemaining > 0 ? 1 : 0,
                estado: totalRemaining === 0 ? 'Completado' : 'Parcial',
                dispatchHistory: [...(origItem.dispatchHistory || []), currentDispatch],
                driverName: logisticsForm.driverName,
                unitInfo: logisticsForm.unitInfo,
                routeInfo: logisticsForm.routeInfo,
                deliveryNotes: `Entregado en: ${logisticsForm.address}. Obs: ${logisticsForm.deliveryNotes}`,
                deliveredAt: totalRemaining === 0 ? new Date().toISOString() : undefined,
                billingStatus: 'Listo para Facturar'
              })
            });
          });

          await Promise.all(promises);

          // AUTOMATIZACIÓN: Si el pedido se entregó completo, pasar prospecto a Venta Completada, si no a Por Menores
          const allFullyDelivered = selectedOrder.items.every(it => {
            const delQty = parseInt(deliveredQtys[it.id]) || 0;
            return (it.pendiente - delQty) <= 0;
          });

          if (existingProspect) {
            const targetStage = allFullyDelivered ? 'Venta Completada' : 'Por Menores';
            await fetch(`/api/prospects/${existingProspect.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ stage: targetStage })
            });
          }

          if (refreshData) refreshData();

          // Mostrar modal de éxito de despacho con opciones "Ver en Mapa" y "Volver a Logística"
          setAlertModal({
            show: true,
            title: '¡Despacho Registrado!',
            message: 'La orden ha sido despachada correctamente en el sistema y los inventarios se han sincronizado.',
            type: 'success-dispatch',
            onConfirm: null
          });

        } catch (err) {
          console.error(err);
          setAlertModal({
            show: true,
            title: 'Error de Red',
            message: 'Ocurrió un error al procesar el despacho. Por favor, intenta de nuevo.',
            type: 'danger',
            onConfirm: null
          });
        }
      }
    });
  };

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
      <ViewHeader 
        title="Logística y Despacho" 
        subtitle="Control de unidades, rutas y confirmación de entregas por folio." 
        icon={Truck} 
        onBack={onBack}
      >
        <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>
          {[
            { label: 'Órdenes por despachar', val: Object.keys(pendingByFolio).length, sub: 'Total pendientes', icon: ClipboardList, color: '#16a34a', bg: '#f0fdf4', tabKey: 'clients' },
            { label: 'Entregas recientes', val: backordersEntregados.length, sub: 'Últimos 7 días', icon: CheckCircle2, color: '#3b82f6', bg: '#eff6ff', tabKey: 'recent' }
          ].map((stat, i) => {
            const isActive = activeTab === stat.tabKey || (stat.tabKey === 'clients' && activeTab === 'prospects');
            return (
              <div 
                key={i} 
                onClick={() => setActiveTab(stat.tabKey)}
                style={{
                  background: '#fff',
                  padding: '12px 20px',
                  borderRadius: '16px',
                  border: isActive ? `2px solid ${stat.color}` : '1.5px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  minWidth: '180px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  boxShadow: isActive ? `0 10px 15px -3px ${stat.color}15, 0 4px 6px -4px ${stat.color}15` : 'none',
                }}
              >
                <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{stat.sub}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ViewHeader>

      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '32px' }}>

        <div style={{ marginTop: '32px' }}></div>


        {/* ESTRUCTURA UNIFICADA CON BARRA LATERAL (ESTILO FINO) */}
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>

          {/* CABECERA INTERNA: TABS Y BUSCADOR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {activeTab === 'recent' ? (
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', padding: '4px 0', borderBottom: '2px solid #3b82f6' }}>
                  Historial de Entregas
                </span>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('clients')}
                    style={{
                      background: 'none', border: 'none',
                      borderBottom: activeTab === 'clients' ? '2px solid #16a34a' : '2px solid transparent',
                      color: activeTab === 'clients' ? '#0f172a' : '#94a3b8',
                      fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', padding: '4px 0'
                    }}>
                    Clientes
                  </button>
                  <button
                    onClick={() => setActiveTab('prospects')}
                    style={{
                      background: 'none', border: 'none',
                      borderBottom: activeTab === 'prospects' ? '2px solid #16a34a' : '2px solid transparent',
                      color: activeTab === 'prospects' ? '#0f172a' : '#94a3b8',
                      fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', padding: '4px 0'
                    }}>
                    Prospectos
                  </button>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text" placeholder="Buscar..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', width: '220px', fontSize: '0.8rem', fontWeight: 600, outline: 'none', background: '#f8fafc' }}
                />
              </div>
              <button style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <Filter size={14} /> Filtros
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>

            {/* COLUMNA UNICA: LISTA DE ÓRDENES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTab === 'recent' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {backordersEntregados.map((b, i) => (
                    <div key={i} style={{ padding: '12px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{b.cliente}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{b.producto} • {b.cantidad} pzas</p>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        background: '#f0fdf4',
                        color: '#16a34a',
                        border: '1px solid #bbf7d0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        ENTREGADO
                      </span>
                    </div>
                  ))}
                  {backordersEntregados.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No hay entregas recientes.</p>
                  )}
                </div>
              ) : (
                Object.values(pendingByFolio).filter(o => {
                  const matchesSearch = o.cliente.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        o.documento.toLowerCase().includes(searchQuery.toLowerCase());
                  const prospect = (prospects || []).find(p => p.name === o.cliente);
                  const isClient = prospect ? prospect.isClient : true;
                  
                  if (activeTab === 'clients') return matchesSearch && isClient;
                  if (activeTab === 'prospects') return matchesSearch && !isClient;
                  return matchesSearch;
                }).map((order, i) => {
                  const totalPzas = order.items.reduce((sum, it) => sum + it.pendiente, 0);
                  return (
                    <div key={i} style={{ background: '#fcfcfc', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr auto', gap: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '10px' }}><Building2 size={20} color="#16a34a" /></div>
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{order.cliente}</h4>
                            <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700 }}>#{order.documento}</span>
                          </div>
                        </div>
                        <div style={{ borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', padding: '0 20px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                            {expandOrderItems(order.items).slice(0, 2).map((it, idx) => (
                              <span key={idx} style={{ padding: '4px 8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.7rem', color: '#475569', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                {it.producto} ({it.pendiente})
                              </span>
                            ))}
                            {expandOrderItems(order.items).length > 2 && (
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, paddingLeft: '4px' }}>
                                +{expandOrderItems(order.items).length - 2} más...
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {order.items.some(it => (it.dispatchHistory && it.dispatchHistory.length > 0) || it.estado === 'Parcial') && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <Package size={22} color="#2563eb" strokeWidth={2.5} />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 800, lineHeight: '1' }}>ENTREGA PARCIAL</span>
                                <span style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, marginTop: '4px' }}>
                                  {Math.max(1, ...order.items.map(it => it.dispatchHistory?.length || 0))}/{expandOrderItems(order.items).length} despachos
                                </span>
                              </div>
                            </div>
                          )}
                          <button
                            onClick={() => openDispatchModal(order)}
                            style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            Gestionar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* PAGINACIÓN COMPACTA */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}><ChevronLeft size={14} color="#94a3b8" /></button>
                <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>1</button>
                <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}><ChevronRight size={14} color="#94a3b8" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EL MODAL DE LOGÍSTICA */}
      {selectedOrder && (() => {
        const prospect = (prospects || []).find(p => p.name === selectedOrder.cliente);
        const isClientOrder = prospect ? prospect.isClient : true;

        const totalSelectedItems = selectedOrder.items.filter(it => selectedItems[it.id]).length;
        const totalSelectedPieces = selectedOrder.items.reduce((sum, it) => sum + (selectedItems[it.id] ? (parseInt(deliveredQtys[it.id]) || 0) : 0), 0);
        const totalPendingPieces = selectedOrder.items.reduce((sum, it) => sum + it.pendiente, 0);
        const allHistories = selectedOrder.originalItems.reduce((acc, it) => [...acc, ...(it.dispatchHistory || [])], []);
        const dispatchHistory = Array.from(new Map(allHistories.map(item => [item.id, item])).values())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((dh, i) => ({ ...dh, type: dh.type === 'Entrega final' ? dh.type : `Parcial #${i + 1}` }));
        
        return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ width: '95%', maxWidth: isClientOrder ? '1200px' : '1000px', background: '#fff', borderRadius: '32px', padding: '48px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', maxHeight: '95vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.2)' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-1px' }}>Estado del Despacho</h3>
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#64748b' }}>Folio: <span style={{ color: '#3b82f6' }}>#{selectedOrder.documento}</span> • {selectedOrder.cliente}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '12px', padding: '12px', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {isClientOrder && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
                  <button onClick={() => setIsPartialMode(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: !isPartialMode ? '#fff' : 'transparent', color: !isPartialMode ? '#3b82f6' : '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', boxShadow: !isPartialMode ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                    ENTREGA COMPLETA
                  </button>
                  <button onClick={() => setIsPartialMode(true)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: isPartialMode ? '#fff' : 'transparent', color: isPartialMode ? '#3b82f6' : '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', boxShadow: isPartialMode ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                    ENTREGA PARCIAL
                  </button>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={14} /> {isPartialMode ? `${totalSelectedPieces} de ${totalPendingPieces} piezas enviadas` : "Se enviarán todos los productos pendientes"}
                </span>
              </div>
            )}

            {/* Stepper Flow */}
            <div style={{ position: 'relative', marginBottom: '60px', padding: '0 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>

                {[
                  { id: 1, title: 'Pedido recibido', desc: 'Validando orden y disponibilidad.', icon: ClipboardCheck, status: 'Completado', date: '10 May 2024, 09:15 AM' },
                  { id: 2, title: 'Preparación', desc: 'Selección y embalaje de productos.', icon: Package, status: 'Completado', date: '10 May 2024, 10:40 AM' },
                  { id: 3, title: 'En tránsito', desc: 'Tu pedido va en camino a destino.', icon: Truck, status: 'En progreso', date: 'En progreso' },
                  { id: 4, title: 'Entregado', desc: 'Confirmación de entrega exitosa.', icon: UserCheck, status: 'Pendiente', date: 'Pendiente' }
                ].map((step, idx, arr) => (
                  <div key={step.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                    {/* Circle Number */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: step.status === 'Completado' ? '#16a34a' : (step.status === 'En progreso' ? '#fff' : '#fff'),
                      border: step.status === 'Completado' ? 'none' : (step.status === 'En progreso' ? '2px solid #16a34a' : '2px solid #e2e8f0'),
                      color: step.status === 'Completado' ? '#fff' : (step.status === 'En progreso' ? '#16a34a' : '#94a3b8'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      marginBottom: '20px',
                      boxShadow: step.status === 'En progreso' ? '0 0 0 4px rgba(22, 163, 74, 0.1)' : 'none',
                      zIndex: 2
                    }}>
                      {step.status === 'Completado' ? <Check size={22} /> : step.id}
                    </div>

                    {/* Step Info */}
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: step.status === 'Pendiente' ? '#94a3b8' : '#0f172a' }}>{step.title}</h5>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5', maxWidth: '160px', height: '40px' }}>{step.desc}</p>

                    {/* Icon & Status */}
                    <div style={{ marginTop: '24px', position: 'relative' }}>
                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '16px' }}>
                        {(() => { const Icon = step.icon; return <Icon size={48} color={step.status === 'Completado' ? '#16a34a' : (step.status === 'En progreso' ? '#16a34a' : '#cbd5e1')} />; })()}
                        {step.status === 'Completado' && (
                          <div style={{ position: 'absolute', bottom: '12px', right: '-4px', background: '#16a34a', borderRadius: '50%', padding: '3px', border: '2px solid #fff' }}>
                            <Check size={12} color="#fff" />
                          </div>
                        )}
                        {step.status === 'En progreso' && (
                          <div style={{ position: 'absolute', bottom: '12px', right: '-4px', background: '#16a34a', borderRadius: '50%', padding: '3px', border: '2px solid #fff' }}>
                            <Clock size={12} color="#fff" />
                          </div>
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: step.status === 'Completado' ? '#64748b' : (step.status === 'En progreso' ? '#16a34a' : '#94a3b8'),
                        margin: 0
                      }}>{step.date}</p>
                    </div>

                    {/* Connecting Line */}
                    {idx < arr.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '22px',
                        left: 'calc(50% + 30px)',
                        right: 'calc(-50% + 30px)',
                        height: '3px',
                        background: step.status === 'Completado' ? '#16a34a' : '#e2e8f0',
                        zIndex: 0
                      }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics Detail Grid */}
            {/* Logistics Detail Grid (Optimizado con Catálogos) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2px',
              background: '#e2e8f0',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              marginBottom: '40px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              {[
                { label: 'Transportista', key: 'carrier', options: carrierOptions, icon: Briefcase, color: '#16a34a' },
                { label: 'Número de guía', key: 'tracking', icon: Zap, color: '#3b82f6', isInput: true },
                { label: 'Unidad asignada', key: 'unitInfo', options: unitOptions, icon: Truck, color: '#f59e0b' },
                { label: 'Chofer', key: 'driverName', icon: UserCheck, color: '#ef4444', isInput: true }
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '20px', borderRight: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ background: `${item.color}10`, padding: '12px', borderRadius: '14px', flexShrink: 0 }}>
                    {(() => { const Icon = item.icon; return <Icon size={22} color={item.color} />; })()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>{item.label}</p>
                    {item.options ? (
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select
                          value={logisticsForm[item.key]}
                          onChange={(e) => setLogisticsForm({ ...logisticsForm, [item.key]: e.target.value })}
                          style={{
                            width: '100%',
                            border: 'none',
                            background: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            outline: 'none',
                            cursor: 'pointer',
                            padding: '4px 20px 4px 0',
                            appearance: 'none',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                          }}
                        >
                          {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={logisticsForm[item.key]}
                        onChange={(e) => setLogisticsForm({ ...logisticsForm, [item.key]: e.target.value })}
                        placeholder={`Ej. ${item.label === 'Chofer' ? 'Carlos R.' : 'AG-940'}`}
                        style={{ width: '100%', border: 'none', background: 'none', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', outline: 'none', padding: '4px 0' }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Section: Products & Delivery Info */}
            <div style={{ display: 'grid', gridTemplateColumns: isClientOrder ? '1.5fr 1fr' : '1fr 1fr', gap: '32px' }}>

              {/* Products Card & Historial (Left Col) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {isClientOrder ? (
                  <>
                    <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Productos en esta orden</h4>
                        <span style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>{selectedOrder.items.length} pendientes de envío</span>
                      </div>
                      
                      {/* Tabla Premium */}
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' }}>Producto</th>
                              <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', textAlign: 'center' }}>Pedido</th>
                              <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', textAlign: 'center' }}>Enviado</th>
                              <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', textAlign: 'center' }}>Pendiente</th>
                              <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', textAlign: 'center' }}>Enviar ahora</th>
                              <th style={{ padding: '12px 8px', color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9', textAlign: 'center', minWidth: '80px' }}>Avance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map(it => {
                              const pedidoOri = it.pedidoOri;
                              const enviadoOri = it.enviadoOri;
                              const currentDelQty = parseInt(deliveredQtys[it.id]) || 0;
                              const isSelected = selectedItems[it.id];
                              
                              const advancePrc = Math.round(((enviadoOri + (isClientOrder && isPartialMode ? (isSelected ? currentDelQty : 0) : it.pendiente)) / pedidoOri) * 100);

                              return (
                                <tr key={it.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: (!isClientOrder || !isPartialMode || isSelected) ? 1 : 0.5 }}>
                                  <td style={{ padding: '16px 8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      {isClientOrder && isPartialMode && (
                                        <input 
                                          type="checkbox" 
                                          checked={!!isSelected}
                                          onChange={(e) => setSelectedItems(prev => ({...prev, [it.id]: e.target.checked}))}
                                          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                                        />
                                      )}
                                      <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '8px' }}>
                                        <Package size={16} color="#16a34a" />
                                      </div>
                                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{it.producto.toUpperCase()}</span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '16px 8px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>{pedidoOri}</td>
                                  <td style={{ padding: '16px 8px', textAlign: 'center', fontWeight: 800, color: '#16a34a', fontSize: '0.85rem' }}>{enviadoOri}</td>
                                  <td style={{ padding: '16px 8px', textAlign: 'center', fontWeight: 800, color: '#f59e0b', fontSize: '0.85rem' }}>{it.pendiente}</td>
                                  <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                                    {isClientOrder && isPartialMode && it.pendiente > 0 ? (
                                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', overflow: 'hidden' }}>
                                        <button onClick={() => setDeliveredQtys(p => ({...p, [it.id]: Math.max(0, currentDelQty - 1)}))} disabled={!isSelected} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: isSelected ? 'pointer' : 'not-allowed', color: '#64748b' }}>-</button>
                                        <input type="text" value={currentDelQty} onChange={(e) => setDeliveredQtys(p => ({...p, [it.id]: e.target.value}))} disabled={!isSelected} style={{ width: '30px', textAlign: 'center', border: 'none', outline: 'none', fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }} />
                                        <button onClick={() => setDeliveredQtys(p => ({...p, [it.id]: Math.min(it.pendiente, currentDelQty + 1)}))} disabled={!isSelected} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: isSelected ? 'pointer' : 'not-allowed', color: '#64748b' }}>+</button>
                                      </div>
                                    ) : (
                                      <span style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>Completo</span>
                                    )}
                                  </td>
                                  <td style={{ padding: '16px 8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${advancePrc}%`, height: '100%', background: advancePrc === 100 ? '#16a34a' : '#22c55e' }}></div>
                                      </div>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', width: '30px' }}>{advancePrc}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '24px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div> Enviado completo</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div> Pendiente parcial</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }}></div> Pendiente total</span>
                      </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 24px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Historial de despachos</h4>
                      
                      {dispatchHistory.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8', fontSize: '0.85rem' }}>
                          <History size={20} />
                          <p style={{ margin: 0, fontWeight: 600 }}>No hay despachos anteriores para esta orden.</p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {dispatchHistory.map((dh, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: i === dispatchHistory.length - 1 && totalPendingPieces === 0 ? '0' : '24px' }}>
                              {/* Línea conectora */}
                              {(i < dispatchHistory.length - 1 || totalPendingPieces > 0) && (
                                <div style={{ position: 'absolute', left: '16px', top: '32px', bottom: 0, width: '2px', background: '#e2e8f0' }}></div>
                              )}
                              
                              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-start' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: dh.status === 'Entregado' ? '#16a34a' : '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {dh.status === 'Entregado' ? <Check size={18} /> : <Truck size={18} />}
                                </div>
                              </div>
                              
                              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: '2px' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{dh.type}</h5>
                                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800, background: dh.status === 'Entregado' ? '#dcfce7' : '#dbeafe', color: dh.status === 'Entregado' ? '#16a34a' : '#3b82f6' }}>
                                      {dh.status}
                                    </span>
                                  </div>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                                    {new Date(dh.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <div style={{ textAlign: 'left', minWidth: '150px' }}>
                                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{dh.items.length} productos • {dh.totalPieces} piezas</p>
                                </div>
                                <div style={{ textAlign: 'left', minWidth: '150px' }}>
                                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Guía: {dh.guide}</p>
                                </div>
                                <div>
                                  <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }} onClick={() => alert('Detalle de los productos: ' + dh.items.map(it => it.cantidad + 'x ' + it.producto).join(', '))}>
                                    Ver detalle
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Step de Pendiente */}
                          {totalPendingPieces > 0 && (
                            <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                              <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-start' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fff', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                </div>
                              </div>
                              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: '2px' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Entrega final</h5>
                                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800, background: '#f1f5f9', color: '#64748b' }}>
                                      Pendiente
                                    </span>
                                  </div>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Pendiente de envío</p>
                                </div>
                                <div style={{ textAlign: 'left', minWidth: '150px' }}>
                                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>{selectedOrder.items.filter(it => it.pendiente > 0).length} productos • {totalPendingPieces} piezas</p>
                                </div>
                                <div style={{ textAlign: 'left', minWidth: '150px' }}>
                                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Sin guía asignada</p>
                                </div>
                                <div style={{ width: '85px' }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <h4 style={{ margin: '0 0 24px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Productos en esta orden ({selectedOrder.items.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {selectedOrder.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#f8fafc', borderRadius: '16px' }}>
                          <div style={{ width: '50px', height: '50px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                            <Package size={24} color="#16a34a" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{it.producto.toUpperCase()}</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Pendiente original: {it.pendiente} pzas</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Info & Resumen (Right Col) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {isClientOrder && isPartialMode && (
                  <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '32px', border: '1.5px solid #f1f5f9' }}>
                    <h4 style={{ margin: '0 0 24px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Resumen del envío parcial</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={16}/> Productos seleccionados</span>
                        <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>{totalSelectedItems}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={16}/> Total de piezas</span>
                        <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>{totalSelectedPieces}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Scale size={16}/> Peso estimado</span>
                        <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 800 }}>--- kg</span>
                      </div>
                    </div>
                    <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#166534', fontWeight: 800 }}>Después de este envío quedarán:</p>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#15803d', fontSize: '0.8rem', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <li>{selectedOrder.items.length - totalSelectedItems} productos pendientes</li>
                        <li>{totalPendingPieces - totalSelectedPieces} piezas pendientes</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Información de entrega</h4>
                    {!isClientOrder && <span style={{ padding: '4px 10px', background: '#fff7ed', color: '#f97316', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800 }}>NUEVO CLIENTE</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <p style={{ margin: 0, width: '90px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Dirección:</p>
                      <input
                        className="search-input"
                        style={{ flex: 1, padding: '8px', fontSize: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        placeholder="Ingresa la dirección"
                        value={logisticsForm.address}
                        onChange={(e) => setLogisticsForm({ ...logisticsForm, address: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <p style={{ margin: 0, width: '90px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Contacto:</p>
                      <input
                        className="search-input"
                        style={{ flex: 1, padding: '8px', fontSize: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        placeholder="Nombre de quien recibe"
                        value={logisticsForm.contact}
                        onChange={(e) => setLogisticsForm({ ...logisticsForm, contact: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <p style={{ margin: 0, width: '90px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Teléfono:</p>
                      <input
                        className="search-input"
                        style={{ flex: 1, padding: '8px', fontSize: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        placeholder="Teléfono"
                        value={logisticsForm.phone}
                        onChange={(e) => setLogisticsForm({ ...logisticsForm, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  {(!logisticsForm.address || !logisticsForm.phone) && (
                    <div style={{ marginTop: '16px', padding: '12px', background: '#fff1f2', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <AlertCircle size={16} color="#e11d48" />
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#e11d48', fontWeight: 600 }}>Falta información crítica para el despacho.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '48px', borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  border: '1.5px solid #e2e8f0',
                  background: '#fff',
                  color: '#475569',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                Cancelar
              </button>
              <button
                onClick={handleConfirmDispatch}
                style={{
                  padding: '16px 40px',
                  borderRadius: '16px',
                  border: 'none',
                  background: isClientOrder && isPartialMode ? '#3b82f6' : '#16a34a',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: isClientOrder && isPartialMode ? '0 10px 20px -5px rgba(59, 130, 246, 0.4)' : '0 10px 20px -5px rgba(22, 163, 74, 0.4)',
                  transition: 'all 0.2s'
                }}>
                <Truck size={20} /> 
                {isClientOrder && isPartialMode ? 'Generar despacho parcial' : 'Confirmar Despacho'}
              </button>
            </div>
          </div>
        </div>
      );
      })()}

      {/* Modal de confirmación y alertas de logística */}
      {alertModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <style>{`
            @keyframes scaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '30px',
            width: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            animation: 'scaleUp 0.15s ease-out',
            position: 'relative'
          }}>
            <div style={{
              background: alertModal.type === 'success-dispatch' 
                ? '#f0fdf4' 
                : (alertModal.type === 'confirm' ? '#eff6ff' : '#fef2f2'),
              color: alertModal.type === 'success-dispatch' 
                ? '#16a34a' 
                : (alertModal.type === 'confirm' ? '#3b82f6' : '#dc2626'),
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              {alertModal.type === 'success-dispatch' ? (
                <CheckCircle2 size={32} />
              ) : (alertModal.type === 'confirm' ? (
                <Truck size={32} />
              ) : (
                <AlertTriangle size={32} />
              ))}
            </div>
            
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 850,
              color: '#0f172a',
              marginBottom: '10px',
              margin: 0
            }}>
              {alertModal.title}
            </h3>
            
            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              marginBottom: '24px',
              marginTop: '10px'
            }}>
              {alertModal.message}
            </p>
            
            <div style={{
              display: 'flex',
              flexDirection: alertModal.type === 'success-dispatch' ? 'column' : 'row',
              gap: '12px',
              justifyContent: 'center'
            }}>
              {alertModal.type === 'confirm' && (
                <>
                  <button
                    onClick={() => setAlertModal(prev => ({ ...prev, show: false }))}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      color: '#475569',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      setAlertModal(prev => ({ ...prev, show: false }));
                      if (typeof alertModal.onConfirm === 'function') {
                        alertModal.onConfirm();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#16a34a',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Confirmar
                  </button>
                </>
              )}

              {alertModal.type === 'success-dispatch' && (
                <>
                  <button
                    onClick={() => {
                      setAlertModal(prev => ({ ...prev, show: false }));
                      setSelectedOrder(null);
                      if (logisticsForm.address) {
                        const query = encodeURIComponent(logisticsForm.address);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#16a34a',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <MapPin size={18} /> Ver en Mapa
                  </button>
                  <button
                    onClick={() => {
                      setAlertModal(prev => ({ ...prev, show: false }));
                      setSelectedOrder(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      color: '#475569',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Volver a Logística
                  </button>
                </>
              )}

              {alertModal.type === 'danger' && (
                <button
                  onClick={() => setAlertModal(prev => ({ ...prev, show: false }))}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#dc2626',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CentroControlModule({ onBack, user, activities, backorders, prospects }) {
  const [activeTab, setActiveTab] = React.useState('live');

  // Mocks for Auditoria and Aprobaciones
  const [approvals, setApprovals] = React.useState([
    { id: 1, type: 'Descuento', client: 'Frutos de la Tierra', user: 'Edgar Leyton', date: new Date().toISOString(), amount: '$15,000 MXN', discount: '15%', reason: 'Cliente frecuente, solicitó igualar oferta de competidor.', status: 'pending' },
    { id: 2, type: 'Crédito', client: 'RANCHO LOS CABALLOS', user: 'Oficina Celaya', date: new Date(Date.now() - 3600000).toISOString(), amount: '$45,000 MXN', details: 'Ampliación de línea a 60 días', reason: 'Expansión de terreno', status: 'pending' }
  ]);

  const [auditLogs] = React.useState([
    { id: 1, time: new Date().toISOString(), user: 'Magdalena Dominguez', action: 'Aplicó descuento de 5%', target: 'Folio AGRO-303161' },
    { id: 2, time: new Date(Date.now() - 7200000).toISOString(), user: 'Edgar Leyton', action: 'Convirtió Prospecto a Cliente', target: 'Grecia Flores' },
    { id: 3, time: new Date(Date.now() - 86400000).toISOString(), user: 'Administrador Master', action: 'Actualizó stock de producto', target: 'ECLIPSE LD (+150 unid.)' },
    { id: 4, time: new Date(Date.now() - 90000000).toISOString(), user: 'Oficina Celaya', action: 'Canceló pedido', target: 'Folio AGRO-590404' }
  ]);

  const handleApprove = (id) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };

  const handleReject = (id) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  };

  return (
    <div className="centro-control-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Centro de Control Directivo</h1>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Supervisión de operaciones, auditoría de seguridad y aprobaciones.</p>
        </div>
      </div>

      <div className="control-tabs" style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <button onClick={() => setActiveTab('live')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'live' ? '#fff' : 'transparent', color: activeTab === 'live' ? '#16a34a' : '#64748b', fontWeight: activeTab === 'live' ? 700 : 500, boxShadow: activeTab === 'live' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
           Actividad en Vivo
        </button>
        <button onClick={() => setActiveTab('approvals')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'approvals' ? '#fff' : 'transparent', color: activeTab === 'approvals' ? '#eab308' : '#64748b', fontWeight: activeTab === 'approvals' ? 700 : 500, boxShadow: activeTab === 'approvals' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
           Aprobaciones Pendientes {approvals.filter(a => a.status === 'pending').length > 0 && <span style={{ background: '#eab308', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{approvals.filter(a => a.status === 'pending').length}</span>}
        </button>
        <button onClick={() => setActiveTab('audit')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'audit' ? '#fff' : 'transparent', color: activeTab === 'audit' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'audit' ? 700 : 500, boxShadow: activeTab === 'audit' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
           Bitácora de Auditoría
        </button>
      </div>

      <div className="control-content" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', minHeight: '500px' }}>
        {activeTab === 'live' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '20px' }}>Actividad Comercial Reciente</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {(activities || []).slice(0, 10).map((act, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {act.client ? act.client.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '0.95rem' }}>{act.title || act.type}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{act.description || act.subtitle}</p>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    {act.date || new Date(act.rawDate || act.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {(!activities || activities.length === 0) && (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No hay actividad reciente registrada en el CRM.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '20px' }}>Autorizaciones Requeridas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {approvals.map(app => (
                <div key={app.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: app.status === 'pending' ? '#fff' : '#f8fafc', opacity: app.status === 'pending' ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ padding: '4px 10px', background: '#fef9c3', color: '#a16207', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>{app.type}</span>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Solicitado por <strong>{app.user}</strong></span>
                      </div>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>{app.client}</h3>
                      <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>Monto de Operación: <strong>{app.amount}</strong></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(app.date).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#334155', fontSize: '0.9rem' }}><strong>Detalles:</strong> {app.discount ? `Descuento del ${app.discount}` : app.details}</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}><strong>Justificación:</strong> {app.reason}</p>
                  </div>
                  
                  {app.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleReject(app.id)} style={{ padding: '8px 20px', background: '#fff', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Rechazar</button>
                      <button onClick={() => handleApprove(app.id)} style={{ padding: '8px 20px', background: '#16a34a', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Autorizar Operación</button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'right', fontWeight: 700, color: app.status === 'approved' ? '#16a34a' : '#ef4444' }}>
                      {app.status === 'approved' ? 'Operación Autorizada' : 'Operación Rechazada'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '20px' }}>Bitácora de Auditoría (Acciones de Usuarios)</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 15px', color: '#475569', fontSize: '0.85rem', fontWeight: 700 }}>FECHA / HORA</th>
                    <th style={{ padding: '12px 15px', color: '#475569', fontSize: '0.85rem', fontWeight: 700 }}>USUARIO</th>
                    <th style={{ padding: '12px 15px', color: '#475569', fontSize: '0.85rem', fontWeight: 700 }}>ACCIÓN REALIZADA</th>
                    <th style={{ padding: '12px 15px', color: '#475569', fontSize: '0.85rem', fontWeight: 700 }}>OBJETIVO / AFECTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', color: '#64748b', fontSize: '0.85rem' }}>{new Date(log.time).toLocaleString()}</td>
                      <td style={{ padding: '15px', color: '#0f172a', fontSize: '0.9rem', fontWeight: 600 }}>{log.user}</td>
                      <td style={{ padding: '15px', color: '#334155', fontSize: '0.9rem' }}>{log.action}</td>
                      <td style={{ padding: '15px', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600 }}>{log.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
