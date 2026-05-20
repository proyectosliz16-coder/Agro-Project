import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { AGRIFLOW_LOGO } from './logo_data.js';
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
  Sliders
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
    // Determinar dinámicamente si el cliente tiene un historial de venta ganada/cerrada o si ya es cliente recurrente
    const clientName = (bo.cliente || '').trim().toLowerCase();
    
    let isNew = !!bo.isNewClient;
    if (clientName && clientName !== 'venta directa') {
      const prospectMatch = (prospects || []).find(p => p.name.trim().toLowerCase() === clientName);
      const hasClosedSaleInCRM = prospectMatch && (prospectMatch.isClient || prospectMatch.stage === 'Venta Cerrada' || prospectMatch.stage === 'Venta Completada');
      const hasExistingClosedRecord = (backorders || []).some(
        x => x.cliente.trim().toLowerCase() === clientName && x.isNewClient === false
      );
      if (hasClosedSaleInCRM || hasExistingClosedRecord) {
        isNew = false;
      }
    } else {
      isNew = false; // Venta Directa o sin nombre siempre va a Backorders
    }

    const matchesType = isNewClientFilter ? isNew : !isNew;
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
                                const doc = new jsPDF();
                                // IMPORTANTE: Filtrar los items usando la misma lógica de folio que el reduce
                                const curFolio = order.documento;
                                const items = backorders.filter(it => {
                                  const itFolio = it.documento || `AGRO-${it.id}`;
                                  return itFolio === curFolio;
                                });

                                if (items.length === 0) {
                                  alert("No se encontraron productos para este folio.");
                                  return;
                                }

                                doc.addImage(AGRIFLOW_LOGO, 'PNG', 15, 15, 40, 20);
                                doc.setFontSize(22); doc.setTextColor(45, 90, 63);
                                doc.text('DETALLE DE PEDIDO', 105, 28);
                                doc.setFontSize(10); doc.setTextColor(100);
                                doc.text(`Folio: ${order.documento}`, 105, 36);
                                doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 41);
                                doc.setDrawColor(45, 90, 63); doc.line(15, 52, 195, 52);
                                doc.setFontSize(12); doc.setTextColor(0); doc.text('INFORMACIÓN DE VENTA', 15, 65);
                                doc.setFontSize(10); doc.text(`Cliente: ${order.cliente}`, 15, 73);
                                doc.text(`Atendió: ${order.vendedor || 'Sistema'}`, 15, 78);

                                const bTab = items.map(it => [
                                  it.producto || 'Sin descripción',
                                  it.cantidad || 0,
                                  `$${(it.precio || 0).toLocaleString('es-MX')}`,
                                  `$${((it.precio || 0) * (it.cantidad || 0)).toLocaleString('es-MX')}`
                                ]);

                                const tV = items.reduce((s, it) => s + ((it.precio || 0) * (it.cantidad || 0)), 0);

                                autoTable(doc, {
                                  startY: 88,
                                  head: [['PRODUCTO', 'CANT.', 'PRECIO UNIT.', 'SUBTOTAL']],
                                  body: bTab,
                                  theme: 'striped',
                                  headStyles: { fillColor: [45, 90, 63] },
                                  foot: [['', '', 'TOTAL NETO:', `$${tV.toLocaleString('es-MX')}`]],
                                  footStyles: { fillColor: [45, 90, 63], textColor: [255, 255, 255], fontStyle: 'bold' }
                                });
                                doc.save(`Pedido_${order.documento}.pdf`);
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
      const doc = new jsPDF();
      const now = new Date().toLocaleString('es-MX');

      // Estilo Corporativo AgriFlow Pro
      doc.setFontSize(24);
      doc.setTextColor(45, 90, 63); // Verde AgriFlow
      doc.text('AgriFlow Pro', 14, 25);
      
      doc.setFontSize(14);
      doc.setTextColor(51, 65, 85);
      doc.text('REPORTE OFICIAL DE INVENTARIO Y STOCK', 14, 35);

      // Metadata
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado por: ${user?.name || 'Sistema'}`, 14, 45);
      doc.text(`Fecha de Impresión: ${now}`, 14, 50);

      // Resumen de KPI
      const totalVal = products.reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseFloat(p.quantity || 0)), 0);
      const lowStockCount = products.filter(p => parseInt(p.quantity) <= (parseInt(p.minStock) || 10)).length;
      doc.text(`Total de Productos: ${products.length}`, 14, 60);
      doc.text(`Valor Total del Almacén: $${totalVal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 14, 65);
      doc.text(`Productos en Alerta de Stock Bajo: ${lowStockCount}`, 14, 70);

      // Tabla de Datos
      autoTable(doc, {
        startY: 78,
        head: [['Producto', 'Categoría', 'Stock', 'Min Stock', 'Costo', 'IVA', 'Precio Venta', 'Valor Total']],
        body: products.map(p => [
          p.name,
          p.category || 'General',
          p.quantity,
          p.minStock || 10,
          `$${parseFloat(p.cost || 0).toFixed(2)}`,
          `${p.tax || 16}%`,
          `$${parseFloat(p.price || 0).toFixed(2)}`,
          `$${(parseFloat(p.price || 0) * parseFloat(p.quantity || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [45, 90, 63] },
        footStyles: { fillColor: [248, 250, 252], textColor: [45, 90, 63], fontStyle: 'bold' }
      });

      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text('Este documento es un reporte interno oficial de AgriFlow Pro.', 14, finalY);

      // Guardar PDF
      const formattedDate = new Date().toISOString().slice(0, 10);
      doc.save(`Reporte_Inventario_${formattedDate}.pdf`);
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

          const isWon = p => p.stage === 'Venta Completada' || p.status === 'Ganado' || p.stage === 'Venta Cerrada' || p.stage === 'Depósito (Venta)';

          // PIPELINE ACTIVO (Global, es una "foto" actual, no importa cuándo se creó)
          const activePipelineCurrent = prospects.filter(p => !isWon(p) && p.stage !== 'Perdido');
          const valorPipeline = Math.round(activePipelineCurrent.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0));
          const trendPipeline = 0; // Sin historial para comparar exactamente con el mes anterior

          // TASA DE CONVERSIÓN GLOBAL (Ganados vs Total de Prospectos)
          const totalGanados = prospects.filter(isWon);
          const tasaConversion = prospects.length > 0 ? Math.round((totalGanados.length / prospects.length) * 100) : 0;
          const trendTasaConversion = 0; // Simplificado para mostrar el real global

          // GANADOS Y PERDIDOS (Mes actual vs Mes Anterior para comparar cierres)
          const ganadosActuales = prospects.filter(p => (p.closedAt ? isCurrentMonth(p.closedAt) : isCurrentMonth(p.createdAt)) && isWon(p));
          const ganadosAnteriores = prospects.filter(p => (p.closedAt ? isLastMonth(p.closedAt) : isLastMonth(p.createdAt)) && isWon(p));

          const perdidosActuales = prospects.filter(p => p.stage === 'Perdido' && (p.closedAt ? isCurrentMonth(p.closedAt) : isCurrentMonth(p.createdAt)));
          const perdidosAnteriores = prospects.filter(p => p.stage === 'Perdido' && (p.closedAt ? isLastMonth(p.closedAt) : isLastMonth(p.createdAt)));

          const pagadosActuales = carteraList.filter(c => c.status === 'Pagado' && isCurrentMonth(c.createdAt));
          const pagadosAnteriores = carteraList.filter(c => c.status === 'Pagado' && isLastMonth(c.createdAt));

          const ticketPromedio = pagadosActuales.length > 0 ? Math.round(pagadosActuales.reduce((sum, c) => sum + (c.amount || 0), 0) / pagadosActuales.length) : 0;
          const ticketPromedioAnt = pagadosAnteriores.length > 0 ? Math.round(pagadosAnteriores.reduce((sum, c) => sum + (c.amount || 0), 0) / pagadosAnteriores.length) : 0;
          const trendTicket = ticketPromedioAnt > 0 ? Math.round(((ticketPromedio - ticketPromedioAnt) / ticketPromedioAnt) * 100) : 0;

          const cicloVenta = ganadosActuales.length > 0 ? Math.round(ganadosActuales.reduce((sum, p) => sum + Math.max(1, (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24)), 0) / ganadosActuales.length) : 0;
          const cicloVentaAnt = ganadosAnteriores.length > 0 ? Math.round(ganadosAnteriores.reduce((sum, p) => sum + Math.max(1, (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24)), 0) / ganadosAnteriores.length) : 0;
          const trendCiclo = cicloVenta - cicloVentaAnt;

          const trendGanados = ganadosAnteriores.length > 0 ? Math.round(((ganadosActuales.length - ganadosAnteriores.length) / ganadosAnteriores.length) * 100) : (ganadosActuales.length > 0 ? 100 : 0);
          const trendPerdidos = perdidosAnteriores.length > 0 ? Math.round(((perdidosActuales.length - perdidosAnteriores.length) / perdidosAnteriores.length) * 100) : (perdidosActuales.length > 0 ? 100 : 0);

          const funnelDataRaw = [
            { title: 'Prospectos / Contacto', stageFilter: ['Contacto', 'Llamada', 'Agendar Cita', 'Evaluación'] },
            { title: 'Cotizaciones', stageFilter: ['Cotizarle', 'Cotización'] },
            { title: 'Negociación', stageFilter: ['Negociación'] },
            { title: 'Cierres', stageFilter: ['Venta Cerrada', 'Venta Completada', 'Depósito (Venta)', 'Nuevo Cliente'] }
          ].map(f => {
            // El primer grupo sirve como catch-all para etapas nuevas no clasificadas que siguen activas
            const amount = prospects.filter(p => {
              if (f.title === 'Cierres') return isWon(p) || p.stage === 'Nuevo Cliente' || p.status === 'Ganado';
              if (f.title === 'Cotizaciones') return f.stageFilter.includes(p.stage);
              if (f.title === 'Negociación') return f.stageFilter.includes(p.stage);
              if (f.title === 'Prospectos / Contacto') {
                return !isWon(p) && p.stage !== 'Perdido' && !['Cotizarle', 'Cotización', 'Negociación', 'Nuevo Cliente'].includes(p.stage);
              }
              return false;
            }).reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
            return { ...f, amount };
          });
          const totalFunnel = funnelDataRaw.reduce((sum, f) => sum + f.amount, 0) || 1;

          const FunnelStage = ({ color, width, percentage, title, amount }) => (
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
                  clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' // Subtle trapezoid
                }}>
                  {percentage}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>${amount.toLocaleString('es-MX')}</div>
              </div>
            </div>
          );



          return (
            <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px 0' }}>
              <ViewHeader title="Rendimiento Comercial" onBack={() => setActiveTab('Dashboard')} />

              <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '40px 32px' }}>

                {/* HEADER CON STATS (ESTILO PREMIUM) */}
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

                {/* CONTENIDO (CARDS EXISTENTES) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* TOP CARDS ROW */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>

                    {/* 1. Tasa de Conversión */}
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

                    {/* 2. Top Vendedores */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Top Vendedores <Info size={14} color="#cbd5e1" />
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, maxHeight: showFullRanking ? '300px' : 'none', overflowY: showFullRanking ? 'auto' : 'visible', paddingRight: showFullRanking ? '8px' : '0' }}>
                        {visibleSellers.sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, showFullRanking ? visibleSellers.length : 3).map((s, idx) => (
                          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: idx === 0 ? '#fef08a' : idx === 1 ? '#e2e8f0' : '#ffedd5', color: idx === 0 ? '#ca8a04' : idx === 1 ? '#64748b' : '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>{idx + 1}</span>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                                <img src={s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{s.name.split(' ')[0]}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>${Math.round(s.sales || 0).toLocaleString('es-MX')}</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: idx === 2 ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', width: '35px', justifyContent: 'flex-end' }}>
                                {idx === 2 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />} {idx === 0 ? '15' : idx === 1 ? '8' : '4'}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {visibleSellers.length > 3 && (
                        <button onClick={() => setShowFullRanking(!showFullRanking)} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', marginTop: '16px' }}>
                          {showFullRanking ? 'Ocultar ranking' : 'Ver ranking completo >'}
                        </button>
                      )}
                    </div>

                    {/* 3. Distribución del Pipeline por Etapa */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Distribución del Pipeline por Etapa <Info size={14} color="#cbd5e1" />
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start', paddingLeft: '20px' }}>
                        {funnelDataRaw.map((f, i) => {
                          const colors = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'];
                          const percentage = Math.round((f.amount / totalFunnel) * 100) || 0;
                          const width = Math.max(15, percentage) + '%';
                          return <FunnelStage key={i} color={colors[i]} width={width} percentage={percentage + '%'} title={f.title} amount={f.amount} />;
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
          const carteraPendiente = carteraList.filter(c => c.status !== 'Pagado');
          const carteraPagada = carteraList.filter(c => c.status === 'Pagado');

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

          // Clasificación de Backorders (Mock por antigüedad si no hay fechas precisas)
          const backordersPendientes = backorders.filter(b => b.pendiente > 0);
          const criticos = backordersPendientes.filter((_, i) => i % 4 === 0).length; // 25% mock
          const riesgo = backordersPendientes.filter((_, i) => i % 4 === 1 || i % 4 === 2).length; // 50% mock
          const tiempo = backordersPendientes.length - criticos - riesgo;

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
                      <span style={{ fontSize: '1rem', fontWeight: 800 }}>4 días</span>
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
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
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Rotación</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>2.3x</span>
                      <Sparkline color="#a855f7" />
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
    { name: 'Recibir Pedido', icon: Package, color: '#3b82f6' },
    { name: 'Venta Completada', icon: CheckCircle2, color: '#059669' },
    { name: 'Perdido', icon: ShieldAlert, color: '#ef4444' }
  ];
  
  const clientStages = [
    { name: 'Contacto', icon: Phone, color: '#10b981' },
    { name: 'Negociación', icon: FileText, color: '#10b981' },
    { name: 'Recibir Pedido', icon: Package, color: '#3b82f6' },
    { name: 'Por Menores', icon: ClipboardList, color: '#10b981' },
    { name: 'Depósito (Venta)', icon: DollarSign, color: '#059669' }
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
      // 1. SI PASA A RECIBIR PEDIDO, ACTIVAR LOGÍSTICA E INVENTARIO
      if (newStage === 'Recibir Pedido') {
        const p = (prospects || []).find(item => item.id === id);
        if (p) {
          const draftBOs = (backorders || []).filter(bo => bo.cliente === p.name && bo.estado === 'Cotización');
          
          if (draftBOs.length > 0) {
            for (const bo of draftBOs) {
              // A. Activar en Logística/Facturación
              await fetch(`/api/backorders/${bo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...bo, estado: 'Entrega Pendiente' })
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
                estado: 'Entrega Pendiente',
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
        alert('Cita guardada correctamente.');
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
    const doc = new jsPDF();
    const now = new Date().toLocaleString('es-MX');

    doc.setFontSize(22);
    doc.setTextColor(45, 90, 63);
    doc.text('AgriFlow Pro - Cotización Comercial', 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${now}`, 14, 32);

    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Cliente: ${p.name}`, 14, 50);
    doc.text(`Contacto: ${p.phone || 'N/A'} | ${p.email || 'N/A'}`, 14, 57);

    autoTable(doc, {
      startY: 70,
      head: [['Descripción del Producto/Servicio', 'Monto Estimado', 'Moneda']],
      body: [
        [p.interest || 'Servicio General', `$${(p.budget || 0).toLocaleString('es-MX')}`, 'MXN']
      ],
      theme: 'grid',
      headStyles: { fillColor: [45, 90, 63], textColor: [255, 255, 255] },
      styles: { fontSize: 10 }
    });

    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text('Esta cotización tiene una vigencia de 15 días naturales.', 14, finalY);
    doc.text('AgriFlow Pro - Transformando el campo con tecnología.', 14, finalY + 7);

    doc.save(`Cotizacion_${p.name.replace(/\s+/g, '_')}.pdf`);
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
                            {idx > 0 && (
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx - 1].name, p.isClient)}
                                style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Regresar a etapa anterior"
                              >
                                <ChevronLeft size={16} />
                              </button>
                            )}
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
                            {idx > 0 && (
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx - 1].name, p.isClient)}
                                style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                              >
                                <ChevronLeft size={16} />
                              </button>
                            )}
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
                              onClick={() => updateProspectStage(p.id, 'Recibir Pedido', p.isClient)}
                              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <CheckCircle2 size={16} /> Enviar a Facturación
                            </button>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => updateProspectStage(p.id, 'Cotizarle', p.isClient)}
                                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                              >
                                ← Cotización
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('¿Marcar este prospecto como PERDIDO?')) {
                                    updateProspectStage(p.id, 'Perdido', p.isClient);
                                  }
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
                            {idx > 0 && (
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx - 1].name, p.isClient)}
                                style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              >
                                <ChevronLeft size={16} />
                              </button>
                            )}
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
                            {idx > 0 && (
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx - 1].name, p.isClient)}
                                style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              >
                                <ChevronLeft size={16} />
                              </button>
                            )}
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
                            <button
                              onClick={() => {
                                setPorMenoresProspect(p);
                                // Intentar recuperar datos previos si los hay
                                let parsed = { stock: false, transport: false, rfc: '', cfdi: 'Gastos en general', extra: '' };
                                if (p.notes && p.notes.includes('CHECKLIST_JSON:')) {
                                  try {
                                    const jsonStr = p.notes.split('CHECKLIST_JSON:')[1];
                                    parsed = { ...parsed, ...JSON.parse(jsonStr) };
                                  } catch (e) { console.error('Error parsing checklist'); }
                                }
                                setPorMenoresData(parsed);
                                setShowPorMenoresModal(true);
                              }}
                              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #dbeafe', background: '#eff6ff', color: '#1d4ed8', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                              <FileCheck2 size={16} />
                              Logística y Validación
                            </button>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {idx > 0 && (
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx - 1].name, p.isClient)}
                                style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              >
                                <ChevronLeft size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => updateProspectStage(p.id, config[idx + 1].name, p.isClient)}
                              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)' }}
                            >
                              <DollarSign size={16} /> A Depósito
                            </button>
                          </div>
                        </div>
                      ) : stage.name === 'Depósito (Venta)' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ background: '#fefce8', padding: '12px', borderRadius: '16px', border: '1px solid #fef08a', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#a16207', fontWeight: 800 }}>💰 PENDIENTE DE PAGO</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#854d0e', fontWeight: 900 }}>${(p.budget || 0).toLocaleString('es-MX')}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {idx > 0 && (
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx - 1].name, p.isClient)}
                                style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              >
                                <ChevronLeft size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setPaymentProspect(p);
                                setPaymentData(prev => ({ ...prev, amount: p.budget || 0 }));
                                setShowPaymentModal(true);
                              }}
                              style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#059669', color: '#fff', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(5, 150, 105, 0.2)' }}
                            >
                              <CheckCircle2 size={18} /> Registrar Pago
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                            {idx > 0 && (
                              <button
                                onClick={() => updateProspectStage(p.id, config[idx - 1].name, p.isClient)}
                                style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                              >
                                <ChevronLeft size={16} />
                              </button>
                            )}
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
                            onClick={() => updateProspectStage(p.id, 'Contacto', true, true)}
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
  const pagadas = (carteraList || []).filter(c => c.status?.toLowerCase() === 'pagado');

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
              <button className="btn-secondary" onClick={() => window.location.reload()}><AlertCircle size={16} /> Sincronizar Datos</button>
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
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: '#0f172a' }}>{c.client}</td>
                    <td style={{ padding: '16px 24px', fontWeight: 900, fontSize: '1.1rem' }}>${(c.amount || 0).toLocaleString('es-MX')}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>{c.seller || 'N/A'}</td>
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
                        await fetch(`/api/prospects/${paymentProspect.id}`, { method: 'DELETE' });
                        if (refreshData) refreshData();
                        setShowPaymentModal(false);
                        alert('¡Pago registrado exitosamente! La venta se ha movido al Histórico Liquidado.');
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
                        <div>
                          {prospect.stage === 'Venta Completada' ? (
                            <span style={{ background: '#f0fdf4', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #bbf7d0' }}>
                              <CheckCircle2 size={14} /> CLIENTE ACTIVO
                            </span>
                          ) : prospect.stage === 'Venta Cerrada' ? (
                            prospectOrders.length === 0 && mode === 'clients' ? (
                              <span style={{ background: '#fef2f2', color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #fecaca' }}>
                                <AlertTriangle size={14} /> PEDIDO CANCELADO
                              </span>
                            ) : (
                              <span style={{ background: '#fffbeb', color: '#d97706', fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #fde68a' }}>
                                <Clock size={14} /> PEDIDO PENDIENTE
                              </span>
                            )
                          ) : (
                            <span style={{ background: mode === 'clients' ? '#f8fafc' : '#eff6ff', color: mode === 'clients' ? '#64748b' : '#2563eb', fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: mode === 'clients' ? '1px solid #e2e8f0' : '1px solid #bfdbfe' }}>
                              <Users size={14} /> {prospect.stage.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Quick Stage Actions */}
                        {!prospect.isClient ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {prospect.stage === 'Contacto' && (
                              <button onClick={() => updateStage(prospect, 'Evaluación')} style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0d9488', padding: '8px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer' }}>Evaluar →</button>
                            )}
                            {prospect.stage === 'Evaluación' && (
                              <button onClick={() => updateStage(prospect, 'Negociación')} style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', padding: '8px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer' }}>Negociar →</button>
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
    saveAs(blob, `Cartera_Vencida_${new Date().toISOString().split('T')[0]}.xlsx`);
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
function ReportesModule({ onBack, sellers, carteraList, backorders, activities, prospects }) {
  const reports = [
    { id: 'ventas', title: 'Ventas vs Presupuesto', desc: 'Comparativo de ventas reales contra presupuesto por vendedor' },
    { id: 'cartera', title: 'Cartera por Antigüedad', desc: 'Detalle de cuentas por cobrar segmentadas por rangos' },
    { id: 'tasa', title: 'Tasa de Conversión', desc: 'Metas Alcanzadas vs Prospectos en Proceso (Global)' },
    { id: 'backorders', title: 'Backorders por Cliente', desc: 'Resumen de pedidos pendientes agrupados por cliente' },
    { id: 'comercial', title: 'Efectividad Comercial', desc: 'Análisis de actividades comerciales y resultados' },
    { id: 'productos', title: 'Backorders por Producto', desc: 'Productos con mayor demanda pendiente' },
  ];

  const generatePDF = (reportId) => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString('es-MX');

    // Inyectar el Logo (Base64 directo)
    try {
      doc.addImage(AGRIFLOW_LOGO, 'PNG', 14, 8, 28, 28);
    } catch (e) {
      console.warn("Logo fallido:", e);
    }

    if (reportId === 'ventas') {
      doc.setFontSize(18);
      doc.setTextColor(45, 90, 63);
      doc.text('AgriFlow Pro - Reporte de Ventas YTD', 50, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${now}`, 50, 30);

      const tableData = (sellers || []).map(s => [
        s.name,
        `$${(s.sales || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        `$${(s.budget || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        `${s.budget > 0 ? ((s.sales / s.budget) * 100).toFixed(1) : '0'}%`
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Vendedor', 'Ventas Logradas', 'Presupuesto Anual', '% Progreso']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [45, 90, 63] }
      });

      const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : 100;

      // Draw Bar Chart in PDF
      doc.setFontSize(14);
      doc.setTextColor(45, 90, 63);
      doc.text('Gráfica de Rendimiento vs Presupuesto', 14, finalY + 15);

      const chartY = finalY + 25;
      const chartHeight = 60;
      const chartWidth = 180;
      const maxPdfVal = Math.max(...(sellers || []).map(s => Math.max(s.budget, s.sales) || 1));

      doc.setDrawColor(200);
      doc.line(14, chartY + chartHeight, 14 + chartWidth, chartY + chartHeight); // Eje X

      if (sellers && sellers.length > 0) {
        const barWidth = Math.min(15, (chartWidth / sellers.length) * 0.4);
        const gap = (chartWidth - (sellers.length * barWidth * 2)) / (sellers.length + 1);

        let currentX = 14 + gap;
        sellers.forEach(s => {
          const budgetH = (s.budget / maxPdfVal) * chartHeight;
          const salesH = (s.sales / maxPdfVal) * chartHeight;

          // Presupuesto
          doc.setFillColor(30, 58, 138);
          doc.rect(currentX, chartY + chartHeight - budgetH, barWidth, budgetH, 'F');

          // Ventas
          doc.setFillColor(45, 90, 63);
          doc.rect(currentX + barWidth, chartY + chartHeight - salesH, barWidth, salesH, 'F');

          doc.setFontSize(8);
          doc.setTextColor(100);
          const nameParts = (s.name || '').split(' ');
          doc.text(nameParts[0], currentX + barWidth, chartY + chartHeight + 5, { align: 'center' });

          currentX += (barWidth * 2) + gap;
        });

        // Leyenda
        const legendY = chartY + chartHeight + 15;
        doc.setFillColor(30, 58, 138);
        doc.rect(14, legendY, 5, 5, 'F');
        doc.text('Presupuesto Anual', 21, legendY + 4);

        doc.setFillColor(45, 90, 63);
        doc.rect(60, legendY, 5, 5, 'F');
        doc.text('Ventas Logradas', 67, legendY + 4);
      }

      doc.save(`Reporte_Ventas_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportId === 'cartera') {
      doc.setFontSize(18);
      doc.setTextColor(45, 90, 63);
      doc.text('AgriFlow Pro - Estado de Cartera Vencida', 50, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${now}`, 50, 30);

      const tableData = (carteraList || []).map(c => [
        new Date(c.createdAt).toLocaleDateString(),
        c.client,
        c.seller,
        c.ageGroup,
        `$${parseFloat(c.amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Fecha', 'Cliente', 'Vendedor', 'Antigüedad', 'Monto']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [45, 90, 63] }
      });

      doc.save(`Reporte_Cartera_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportId === 'backorders') {
      doc.setFontSize(18);
      doc.setTextColor(45, 90, 63);
      doc.text('AgriFlow Pro - Reporte de Backorders por Cliente', 50, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${now}`, 50, 30);

      const tableData = (backorders || []).map(b => [
        b.cliente,
        b.producto,
        b.vendedor,
        b.cantidad,
        b.pendiente,
        `$${(b.precio || 0).toLocaleString('es-MX')}`,
        `$${((b.precio || 0) * (b.cantidad || 0)).toLocaleString('es-MX')}`,
        b.estado
      ]);

      const totalValue = (backorders || []).reduce((sum, b) => sum + ((b.precio || 0) * (b.cantidad || 0)), 0);

      autoTable(doc, {
        startY: 40,
        head: [['Cliente', 'Producto', 'Vendedor', 'Cant.', 'Pend.', 'Precio', 'Subtotal', 'Estado']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [45, 90, 63], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        foot: [['', '', '', '', '', 'TOTAL:', `$${totalValue.toLocaleString('es-MX')}`, '']],
        footStyles: { fillColor: [248, 250, 252], textColor: [45, 90, 63], fontStyle: 'bold', fontSize: 8 }
      });

      doc.save(`Reporte_Backorders_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportId === 'comercial') {
      doc.setFontSize(18);
      doc.setTextColor(45, 90, 63);
      doc.text('AgriFlow Pro - Efectividad Comercial Y Acciones', 50, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${now}`, 50, 30);

      const tableData = (activities || []).map(a => [
        a.date,
        a.client,
        a.type,
        a.description.substring(0, 50) + '...',
        a.status
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Fecha', 'Cliente', 'Actividad', 'Detalle', 'Estado']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [45, 90, 63] }
      });

      doc.save(`Reporte_Efectividad_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportId === 'productos') {
      doc.setFontSize(18);
      doc.setTextColor(45, 90, 63);
      doc.text('AgriFlow Pro - Demanda Pendiente por Producto', 50, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${now}`, 50, 30);

      const productMap = {};
      (backorders || []).forEach(b => {
        if (!productMap[b.producto]) {
          productMap[b.producto] = { name: b.producto, total: 0, customers: new Set() };
        }
        productMap[b.producto].total += b.pendiente;
        productMap[b.producto].customers.add(b.cliente);
      });

      const tableData = Object.values(productMap).map(p => [
        p.name,
        p.total,
        p.customers.size,
        p.total > 100 ? 'ALTA DEMANDA' : 'PENDIENTE'
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Producto', 'Unidades Pendientes', 'Clientes Afectados', 'Estado']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [45, 90, 63] }
      });

      doc.save(`Reporte_Productos_${new Date().toISOString().split('T')[0]}.pdf`);
    } else if (reportId === 'tasa') {
      doc.setFontSize(18);
      doc.setTextColor(45, 90, 63);
      doc.text('AgriFlow Pro - Embudo de Conversión Comercial', 50, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${now}`, 50, 30);

      const total = (prospects || []).length;
      const closed = (prospects || []).filter(p => p.stage === 'Venta Cerrada').length;
      const rate = total > 0 ? ((closed / total) * 100).toFixed(1) : '0';

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Resumen Global: ${closed} de ${total} prospectos convertidos con éxito.`, 50, 40);

      doc.setFontSize(14);
      doc.setTextColor(45, 90, 63);
      doc.text(`TASA DE CONVERSIÓN: ${rate}%`, 14, 55);

      const tableData = (prospects || []).map(p => [
        p.name,
        p.stage,
        `$${(p.budget || 0).toLocaleString('es-MX')}`,
        p.stage === 'Venta Cerrada' ? 'FINALIZADO' : 'PENDIENTE'
      ]);

      autoTable(doc, {
        startY: 65,
        head: [['Prospecto', 'Etapa Actual', 'Presupuesto Estimado', 'Estado']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [45, 90, 63] }
      });

      doc.save(`Reporte_Conversion_${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  const generateExcel = async (reportId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte AgriFlow');

    // 1. Agregar Logo
    try {
      const imageId = workbook.addImage({
        base64: AGRIFLOW_LOGO,
        extension: 'png',
      });
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 80, height: 80 }
      });
    } catch (e) {
      console.warn("Excel logo error:", e);
    }

    // 2. Encabezado de Texto (Igual que el PDF)
    const reportTitles = {
      ventas: 'Reporte de Ventas YTD',
      cartera: 'Estado de Cartera Vencida',
      backorders: 'Reporte de Backorders por Cliente',
      comercial: 'Efectividad Comercial Y Acciones',
      productos: 'Demanda Pendiente por Producto',
      tasa: 'Embudo de Conversión Comercial'
    };

    const titleCell = worksheet.getCell('B2');
    titleCell.value = `AgriFlow Pro - ${reportTitles[reportId] || 'Reporte de Operaciones'}`;
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF2D5A3F' } };

    const dateCell = worksheet.getCell('B3');
    dateCell.value = `Generado el: ${new Date().toLocaleString('es-MX')}`;
    dateCell.font = { name: 'Arial', size: 10, color: { argb: 'FF666666' } };

    // Ajustar anchos iniciales para pegar el texto al logo
    worksheet.getColumn(1).width = 12; // Columna A (Logo)
    worksheet.getColumn(2).width = 40; // Columna B (Texto)

    // Espacio para logo e información (6 filas)
    for (let i = 0; i < 6; i++) worksheet.addRow([]);

    let headers = [];
    let rows = [];
    let filename = `Reporte_${reportId}_${new Date().toISOString().split('T')[0]}.xlsx`;

    if (reportId === 'ventas') {
      headers = ['Vendedor', 'Ventas Logradas', 'Presupuesto Anual', 'Cumplimiento %'];
      rows = (sellers || []).map(s => [
        s.name,
        s.sales,
        s.budget,
        s.budget > 0 ? `${((s.sales / s.budget) * 100).toFixed(1)}%` : '0%'
      ]);
    } else if (reportId === 'cartera') {
      headers = ['Fecha', 'Cliente', 'Vendedor', 'Antigüedad', 'Monto'];
      rows = (carteraList || []).map(c => [
        new Date(c.createdAt).toLocaleDateString(),
        c.client,
        c.seller,
        c.ageGroup,
        c.amount
      ]);
    } else if (reportId === 'backorders') {
      headers = ['Cliente', 'Producto', 'Vendedor', 'Cant. Orig', 'Pendiente', 'Precio Unit.', 'Subtotal', 'Estado'];
      rows = (backorders || []).map(b => [
        b.cliente, b.producto, b.vendedor, b.cantidad, b.pendiente, b.precio || 0, (b.precio || 0) * (b.cantidad || 0), b.estado
      ]);
    } else if (reportId === 'comercial') {
      headers = ['Fecha', 'Cliente', 'Actividad', 'Detalle', 'Estado'];
      rows = (activities || []).map(a => [
        a.date, a.client, a.type, a.description, a.status
      ]);
    } else if (reportId === 'productos') {
      headers = ['Producto', 'Unidades Pendientes', 'Clientes Afectados', 'Estado'];
      const productMap = {};
      (backorders || []).forEach(b => {
        if (!productMap[b.producto]) {
          productMap[b.producto] = { name: b.producto, total: 0, customers: new Set() };
        }
        productMap[b.producto].total += b.pendiente;
        productMap[b.producto].customers.add(b.cliente);
      });
      rows = Object.values(productMap).map(p => [
        p.name,
        p.total,
        p.customers.size,
        p.total > 100 ? 'ALTA DEMANDA' : 'PENDIENTE'
      ]);
    } else if (reportId === 'tasa') {
      headers = ['Prospecto', 'Etapa', 'Presupuesto', 'Estado'];
      rows = (prospects || []).map(p => [
        p.name, p.stage, p.budget, p.stage === 'Venta Cerrada' ? 'CERRADA' : 'EN PROCESO'
      ]);
    }

    // Estilo
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
function ProductosModule({ onBack, onNavigate, returnView = 'Ventas', quotingProspect, setQuotingProspect, manualClientName, setManualClientName, cart, setCart, addToCart, removeFromCart, updateCartQty, products, setProducts, user, refreshData, prospects, backorders, editingFolio, setEditingFolio, setAutoEditProspectId }) {
  // Filtrar prospectos para mostrar solo clientes con entregas completadas, dirección y contacto conocidos
  const validDropdownClients = (() => {
    const valid = (prospects || []).filter(p => {
      if (!p.name) return false;
      const nameLower = p.name.trim().toLowerCase();
      if (nameLower === 'venta directa') return false;

      const hasAddress = p.location && p.location.trim() !== '';
      const hasContact = (p.phone && p.phone.trim() !== '') || (p.email && p.email.trim() !== '');
      const hasDeliveredOrder = (backorders || []).some(
        bo => bo.cliente && bo.cliente.trim().toLowerCase() === nameLower && bo.pendiente === 0
      );

      return hasAddress && hasContact && hasDeliveredOrder;
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
            })()
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

        // 2. Generar PDF Profesional con jsPDF
        const doc = new jsPDF();
        const now = new Date().toLocaleString('es-MX');

        // Estilo Corporativo
        doc.setFontSize(24);
        doc.setTextColor(45, 90, 63);
        doc.text('AgriFlow Pro', 14, 25);
        doc.setFontSize(14);
        doc.text('COTIZACIÓN FORMAL DE PRODUCTOS', 14, 35);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Vendedor: ${user?.name}`, 14, 45);
        doc.text(`Fecha: ${now}`, 14, 50);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Prospecto: ${quotingProspect.name}`, 14, 60);

        autoTable(doc, {
          startY: 70,
          head: [['Descripción del Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
          body: cart.map(item => [
            item.name,
            item.qty,
            `$${item.price.toLocaleString('es-MX')}`,
            `$${(item.qty * item.price).toLocaleString('es-MX')}`
          ]),
          foot: [['', '', 'TOTAL NETO', `$${cartTotal.toLocaleString('es-MX')}`]],
          theme: 'striped',
          headStyles: { fillColor: [45, 90, 63] },
          footStyles: { fillColor: [248, 250, 252], textColor: [45, 90, 63], fontStyle: 'bold' }
        });

        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Esta cotización tiene una vigencia de 15 días.', 14, finalY);
        // doc.save(`Cotizacion_${quotingProspect.name.replace(/\s+/g, '_')}.pdf`);

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
          title="Cotizador Maestro" 
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

function MainDashboard({ user, setView, prospects, carteraList, backorders, activities }) {
  // --- Cálculos de Datos Reales ---
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Agrupación por Folios con distinción entre Pedidos Nuevos y Backorders (Parciales)
  const pendingItems = (backorders || []).filter(b => (parseFloat(b.pendiente) || 0) > 0);

  // Variable total para etiquetas descriptivas
  const pendingFoliosCount = new Set(pendingItems.map(b => b.documento)).size;

  // Pedidos en proceso: Son folios de CLIENTES NUEVOS (prospectos)
  const newItems = pendingItems.filter(b => b.isNewClient === true);
  const newFoliosCount = new Set(newItems.map(b => b.documento)).size;

  // Backorders pendientes: Son folios de CLIENTES EXISTENTES
  const partialItems = pendingItems.filter(b => !b.isNewClient);
  const partialFoliosCount = new Set(partialItems.map(b => b.documento)).size;
  const pendingUnitsSum = pendingItems.reduce((sum, b) => sum + (parseFloat(b.pendiente) || 0), 0);

  const dispatchItems = pendingItems.filter(b => !b.driverName);
  const dispatchFoliosCount = new Set(dispatchItems.map(b => b.documento)).size;

  const deliveredTodayItems = (backorders || []).filter(b => b.deliveredAt && new Date(b.deliveredAt).toDateString() === now.toDateString());
  const deliveredTodayFoliosCount = new Set(deliveredTodayItems.map(b => b.documento)).size;

  // Cotizaciones Pendientes: Prospectos en etapa de Negociación
  const pendingQuotesCount = (prospects || []).filter(p => !p.isClient && p.stage === 'Negociación').length;

  // Ventas Totales (Se eliminó filtro de fecha para asegurar que se capturen todos los datos reales del sistema)
  const totalSales = (carteraList || []).filter(c => {
    const status = (c.status || '').toLowerCase().trim();
    return ['pagado', 'pagada', 'liquidado', 'cobrado', 'completado', 'liquidada'].includes(status);
  }).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

  const dayOfMonth = now.getDate() || 1;
  const dailyAvg = totalSales / dayOfMonth;

  // Cartera Vencida
  const unpaidItems = (carteraList || []).filter(c => {
    const status = (c.status || '').toLowerCase().trim();
    return !['pagado', 'pagada', 'liquidado', 'cobrado', 'completado', 'liquidada'].includes(status);
  });
  const overdueCartera = unpaidItems.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const overdueInvoices = unpaidItems.length;

  const totalDebt = (carteraList || []).reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

  // Construcción de Actividad Reciente Real
  const combinedActivity = [
    ...(backorders || []).slice(-10).map(b => ({
      id: `bo-${b.id}`,
      type: 'order',
      title: `Pedido registrado`,
      subtitle: `${b.cliente} (${b.producto}) - $${(parseFloat(b.precio) * parseFloat(b.cantidad)).toLocaleString('es-MX')}`,
      time: b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente',
      rawDate: b.createdAt ? new Date(b.createdAt) : new Date(0)
    })),
    ...(carteraList || []).slice(-10).map(c => ({
      id: `ca-${c.id}`,
      type: 'sale',
      title: c.status === 'Pagado' ? 'Cobro realizado' : 'Factura generada',
      subtitle: `${c.client} - $${parseFloat(c.amount).toLocaleString('es-MX')}`,
      time: 'Hoy',
      rawDate: c.createdAt ? new Date(c.createdAt) : new Date(0)
    })),
    ...(prospects || []).slice(-10).map(p => ({
      id: `pr-${p.id}`,
      type: 'prospect',
      title: `Nuevo prospecto`,
      subtitle: `${p.name} ${p.budget ? `- Presupuesto: $${parseFloat(p.budget).toLocaleString('es-MX')}` : ''}`,
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
        body: JSON.stringify({ billingStatus: 'Pagado' })
      });
      if (resp.ok) {
        setInvoicePreview({ ...selectedBill, ...billingForm });
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

            <button
              onClick={() => { setSearchPending(''); setFilterPriority('Todas'); setActiveSection('Todos'); }}
              style={{ width: '100%', marginTop: '24px', padding: '12px', background: 'none', border: 'none', color: '#059669', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Ver todas las pendientes <ArrowRight size={16} />
            </button>
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

            <button
              onClick={() => { setActiveHistoryTab('Todos'); setSearchHistory(''); setActiveSection('Todos'); }}
              style={{ width: '100%', marginTop: '24px', padding: '12px', background: 'none', border: 'none', color: '#059669', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Ver todo el historial <ArrowRight size={16} />
            </button>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '850px', maxHeight: '95vh', overflowY: 'auto', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative', fontFamily: "'Inter', sans-serif" }}>

            <div style={{ padding: '40px', borderBottom: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '60px', height: '60px', background: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={32} color="#fff" />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>AgriFlow</h1>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>Tecnología para el Agro</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>FACTURA</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 700 }}>Serie/Folio: <span style={{ color: '#0f172a' }}>INV-{String(invoicePreview.id).padStart(5, '0')}</span></p>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>Fecha: {new Date().toLocaleString('es-MX')}</p>
              </div>
            </div>

            <div style={{ padding: '40px' }}>
              <div style={{ display: 'flex', gap: '40px', marginBottom: '32px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Emisor</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>AgriFlow Corporativo S.A. de C.V.</p>
                  <p style={{ margin: '0 0 2px 0', color: '#475569', fontSize: '0.85rem' }}>RFC: AGR240501XX1</p>
                  <p style={{ margin: '0 0 2px 0', color: '#475569', fontSize: '0.85rem' }}>Régimen: 601 - General de Ley Personas Morales</p>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>CP: 76000, Querétaro, México</p>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Receptor</h3>
                  <p style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>{invoicePreview.cliente}</p>
                  <p style={{ margin: '0 0 2px 0', color: '#475569', fontSize: '0.85rem' }}>RFC: {invoicePreview.clientRFC || 'XAXX010101000'} {!invoicePreview.clientRFC && '(Público General)'}</p>
                  <p style={{ margin: '0 0 2px 0', color: '#475569', fontSize: '0.85rem' }}>Uso CFDI: G03 - Gastos en general</p>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>CP: {invoicePreview.clientCP || '00000'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '32px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Método de Pago</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>PUE - Una sola exhibición</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Forma de Pago</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>{invoicePreview.paymentMethod || '03 - Transferencia'}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Moneda</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>MXN - Peso Mexicano</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Tipo Comprobante</p>
                  <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>I - Ingreso</p>
                </div>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: 800 }}>Clave/Unidad</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: 800 }}>Descripción</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontWeight: 800 }}>Cant</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontWeight: 800 }}>P. Unitario</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontWeight: 800 }}>Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
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
                <div style={{ width: '250px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#475569', fontSize: '0.9rem' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontWeight: 700 }}>{(invoicePreview.precio / 1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#475569', fontSize: '0.9rem' }}>
                    <span>IVA (16%):</span>
                    <span style={{ fontWeight: 700 }}>{(invoicePreview.precio - (invoicePreview.precio / 1.16)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #e2e8f0', marginTop: '8px', color: '#0f172a', fontSize: '1.2rem', fontWeight: 900 }}>
                    <span>Total:</span>
                    <span style={{ color: '#16a34a' }}>{(invoicePreview.precio || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px', display: 'flex', gap: '24px' }}>
                <div style={{ width: '130px', height: '130px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={40} color="#cbd5e1" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>UUID (Folio Fiscal)</p>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem', fontFamily: 'monospace' }}>550e8400-e29b-41d4-a716-446655440000</p>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Sello Digital del Emisor</p>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.55rem', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: '1.2' }}>iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFmklEQVR4nO2dS27cRhCG...</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Cadena Original del Timbre</p>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.55rem', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: '1.2' }}>||1.1|550e8400-e29b-41d4-a716-446655440000|2024-05-12T14:30:00|SAT970701NN3|...</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button onClick={() => setInvoicePreview(null)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#475569', fontWeight: 800, cursor: 'pointer' }}>
                  Cerrar
                </button>
                <button onClick={() => window.print()} style={{ padding: '12px 24px', background: '#2563eb', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)' }}>
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

  // Estado centralizado de datos (desde la BD)
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [carteraList, setCarteraList] = useState([]);
  const [backorders, setBackorders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [quotingProspect, setQuotingProspect] = useState(null);
  const [manualClientName, setManualClientName] = useState('');
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
      case 'Dashboard': return <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} />;
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
      case 'Reportes': return <ReportesModule onBack={() => setView('Dashboard')} sellers={sellers} carteraList={carteraList} backorders={backorders} activities={activities} prospects={prospects} />;
      case 'Cotizador': return <ProductosModule
        onBack={() => setView('Dashboard')}
        onNavigate={handleNavigateWithData}
        returnView={previousView}
        quotingProspect={quotingProspect}
        setQuotingProspect={setQuotingProspect}
        manualClientName={manualClientName}
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
      case 'Sistema': return <SistemaModule onBack={() => setView('Dashboard')} />;
      default: return <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} activities={activities} />;
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
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === 'Dashboard'} onClick={() => setView('Dashboard')} />
          <SidebarItem icon={ClipboardList} label="Pedidos" active={view === 'Pedidos'} onClick={() => setView('Pedidos')} />
          <SidebarItem icon={Package} label="Backorders" active={view === 'Backorders'} onClick={() => setView('Backorders')} />
          <SidebarItem icon={Truck} label="Logística" active={view === 'Logistica'} onClick={() => setView('Logistica')} />

          <SidebarSection title="COMERCIAL" isOpen={comercialOpen} onToggle={() => setComercialOpen(!comercialOpen)} />
          {comercialOpen && (
            <>
              <SidebarItem icon={Receipt} label="Facturación" active={view === 'Facturacion'} onClick={() => setView('Facturacion')} />
              <SidebarItem icon={Receipt} label="Cotizador" active={view === 'Cotizador'} onClick={() => setView('Cotizador')} />

              {user?.role !== 'Vendedor' && user?.role !== 'vendedor' && (
                <SidebarItem icon={FileText} label="Inventario" active={view === 'Inventario'} onClick={() => setView('Inventario')} />
              )}

              <SidebarItem icon={TrendingUp} label="KPIs" active={view === 'KPIs'} onClick={() => setView('KPIs')} />
              <SidebarItem icon={DollarSign} label="Pipeline de Ventas" active={view === 'Ventas'} onClick={() => setView('Ventas')} />
              <SidebarItem icon={Users} label="Prospectos" active={view === 'Prospectos'} onClick={() => setView('Prospectos')} />
              <SidebarItem icon={Users} label="Clientes" active={view === 'Clientes'} onClick={() => setView('Clientes')} />
              <SidebarItem icon={Building2} label="Cartera" active={view === 'Cartera'} onClick={() => setView('Cartera')} />
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

              <SidebarItem icon={ShieldAlert} label="Sistema" active={view === 'Sistema'} onClick={() => setView('Sistema')} />
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

  useEffect(() => {
    fetch('/api/system/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoadingStats(false); })
      .catch(() => setLoadingStats(false));

    fetch('/api/system/logs')
      .then(r => r.json())
      .then(data => { setLogs(data); setLoadingLogs(false); })
      .catch(() => setLoadingLogs(false));
  }, []);

  const logTypes = ['Todos', 'INFO', 'WARNING', 'ERROR', 'DEBUG'];
  const filteredLogs = logFilter === 'Todos' ? logs : logs.filter(l => l.type === logFilter);

  const logColors = {
    INFO: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', badge: '#dcfce7' },
    WARNING: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', badge: '#fef3c7' },
    ERROR: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: '#fee2e2' },
    DEBUG: { bg: '#f8fafc', border: '#e2e8f0', text: '#64748b', badge: '#f1f5f9' },
  };

  const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const statCards = stats ? [
    { label: 'Usuarios Registrados', value: stats.users, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Productos en Sistema', value: stats.products, icon: Package, color: '#10b981', bg: '#f0fdf4' },
    { label: 'Backorders Activos', value: stats.backorders, icon: AlertCircle, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Prospectos', value: stats.prospects, icon: TrendingUp, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Vendedores en Ranking', value: stats.sales, icon: BarChart2, color: '#2d5a3f', bg: '#f0fdf4' },
    { label: 'Uptime del Servidor', value: formatUptime(stats.uptime), icon: Settings, color: '#64748b', bg: '#f8fafc' },
  ] : [];

  const errorCount = logs.filter(l => l.type === 'ERROR').length;
  const warnCount = logs.filter(l => l.type === 'WARNING').length;

  return (
    <div className="module-container">
      <ViewHeader 
        title="Supervisión del Sistema" 
        subtitle="Panel exclusivo del Administrador Master" 
        icon={ShieldAlert} 
        onBack={onBack}
      >
        <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>
          {[
            { label: 'Errores', val: errorCount, icon: AlertCircle, color: '#dc2626', bg: '#fef2f2' },
            { label: 'Alertas', val: warnCount, icon: TrendingUp, color: '#b45309', bg: '#fffbeb' },
            { label: 'Estado', val: errorCount === 0 ? '✓ Ok' : '! Rev', icon: CheckCircle2, color: '#15803d', bg: '#f0fdf4' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', padding: '12px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', minWidth: '140px' }}>
              <div style={{ background: stat.bg, padding: '8px', borderRadius: '10px' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <div>
                <p style={{ color: stat.color, fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>{stat.label}</p>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{stat.val}</span>
              </div>
            </div>
          ))}
        </div>
      </ViewHeader>

      {/* Estadísticas de BD */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>📊 Estado de la Base de Datos</h3>
        {loadingStats ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Cargando estadísticas...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="module-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                  <div style={{ width: '48px', height: '48px', background: card.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color={card.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{card.value}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{card.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visor de Logs */}
      <div className="module-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#2d5a3f" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Logs de Auditoría</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {logTypes.map(t => (
              <button
                key={t}
                onClick={() => setLogFilter(t)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                  background: logFilter === t ? '#1a2e23' : '#f1f5f9',
                  color: logFilter === t ? 'white' : '#64748b',
                  transition: 'all 0.2s'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
          {loadingLogs ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Cargando logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No hay logs de tipo "{logFilter}"</div>
          ) : filteredLogs.map(log => {
            const c = logColors[log.type] || logColors.DEBUG;
            return (
              <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: '10px' }}>
                <span style={{ padding: '2px 8px', background: c.badge, color: c.text, borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.5px', flexShrink: 0, marginTop: '2px' }}>
                  {log.type}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '0.9rem', fontWeight: 500 }}>{log.message}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', flexShrink: 0, fontFamily: 'monospace' }}>{formatTime(log.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}




// 12. Módulo de Logística (Rediseño Profesional 2026)
function LogisticaModule({ onBack, backorders, handleDeliver, refreshData, prospects }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('dispatch'); // 'dispatch' | 'recent'
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

  // Agrupar pedidos pendientes por Folio (documento)
  const pendingByFolio = (backorders || [])
    .filter(b => (b.pendiente || 0) > 0 && b.estado !== 'Cotización')
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
    setSelectedOrder(order);
    const initialQtys = {};
    order.items.forEach(it => {
      initialQtys[it.id] = it.pendiente;
    });
    setDeliveredQtys(initialQtys);

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

          const promises = selectedOrder.items.map(it => {
            const delQty = parseInt(deliveredQtys[it.id]) || 0;
            const newPendiente = Math.max(0, it.pendiente - delQty);
            const isFullyDelivered = newPendiente === 0;

            return fetch(`/api/backorders/${it.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pendiente: newPendiente,
                estado: isFullyDelivered ? 'Completado' : 'Parcial',
                deliveredQty: (it.deliveredQty || 0) + delQty,
                driverName: logisticsForm.driverName,
                unitInfo: logisticsForm.unitInfo,
                routeInfo: logisticsForm.routeInfo,
                deliveryNotes: `Entregado en: ${logisticsForm.address}. Obs: ${logisticsForm.deliveryNotes}`,
                deliveredAt: isFullyDelivered ? new Date().toISOString() : undefined,
                billingStatus: 'Listo para Facturar'
              })
            });
          });

          await Promise.all(promises);

          // AUTOMATIZACIÓN: Si el pedido se entregó completo, pasar prospecto a Venta Completada
          const allFullyDelivered = selectedOrder.items.every(it => {
            const delQty = parseInt(deliveredQtys[it.id]) || 0;
            return (it.pendiente - delQty) <= 0;
          });

          if (existingProspect && allFullyDelivered) {
            await fetch(`/api/prospects/${existingProspect.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ stage: 'Venta Completada' })
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
            { label: 'Órdenes por despachar', val: Object.keys(pendingByFolio).length, sub: 'Total pendientes', icon: ClipboardList, color: '#16a34a', bg: '#f0fdf4', tabKey: 'dispatch' },
            { label: 'Entregas recientes', val: backordersEntregados.length, sub: 'Últimos 7 días', icon: CheckCircle2, color: '#3b82f6', bg: '#eff6ff', tabKey: 'recent' }
          ].map((stat, i) => {
            const isActive = activeTab === stat.tabKey;
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
              <button
                onClick={() => setActiveTab('dispatch')}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: activeTab === 'dispatch' ? '2px solid #16a34a' : '2px solid transparent',
                  color: activeTab === 'dispatch' ? '#0f172a' : '#94a3b8',
                  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', padding: '4px 0'
                }}>
                Por Despachar <span style={{ marginLeft: '4px', opacity: 0.6 }}>({Object.keys(pendingByFolio).length})</span>
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: activeTab === 'recent' ? '2px solid #16a34a' : '2px solid transparent',
                  color: activeTab === 'recent' ? '#0f172a' : '#94a3b8',
                  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', padding: '4px 0'
                }}>
                Historial Completo
              </button>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>

            {/* COLUMNA IZQUIERDA: LISTA DE ÓRDENES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTab === 'dispatch' ? (
                filteredDispatch.map((order, i) => {
                  const totalPzas = order.items.reduce((sum, it) => sum + it.pendiente, 0);
                  return (
                    <div key={i} style={{ background: '#fcfcfc', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 100px', gap: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '10px' }}><Building2 size={20} color="#16a34a" /></div>
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{order.cliente}</h4>
                            <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700 }}>#{order.documento}</span>
                          </div>
                        </div>
                        <div style={{ borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', padding: '0 20px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                            {order.items.slice(0, 2).map((it, idx) => (
                              <span key={idx} style={{ padding: '4px 8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.7rem', color: '#475569', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                {it.producto} ({it.pendiente})
                              </span>
                            ))}
                            {order.items.length > 2 && (
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, paddingLeft: '4px' }}>
                                +{order.items.length - 2} más...
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>

                          <button
                            onClick={() => openDispatchModal(order)}
                            style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 16px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', width: '120px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            Gestionar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
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
                </div>
              )}

              {/* PAGINACIÓN COMPACTA */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}><ChevronLeft size={14} color="#94a3b8" /></button>
                <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>1</button>
                <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}><ChevronRight size={14} color="#94a3b8" /></button>
              </div>
            </div>

            {/* COLUMNA DERECHA: BARRA LATERAL (DENTRO DEL MISMO BOX) */}
            <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} color="#3b82f6" /> Entregas Recientes
              </h3>

              <div style={{ flex: 1 }}>
                {backordersEntregados.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <div style={{ width: '100px', height: '120px', background: '#eff6ff', borderRadius: '12px', margin: '0 auto 20px auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ClipboardCheck size={40} color="#bfdbfe" />
                      <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '30px', height: '30px', background: '#22c55e', borderRadius: '50%', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={16} color="#fff" />
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, lineHeight: '1.5' }}>Aún no hay entregas registradas hoy.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {backordersEntregados.slice(0, 5).map((b, i) => (
                      <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{b.cliente}</span>
                          <Check size={12} color="#16a34a" />
                        </div>
                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>{b.producto} • {b.cantidad} pzas</p>
                      </div>
                    ))}
                    <button
                      onClick={() => setActiveTab('recent')}
                      style={{ marginTop: '12px', padding: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                      Ver todo el historial
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EL MODAL SE MANTIENE IGUAL POR AHORA (YA ES FUNCIONAL) */}
      {selectedOrder && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ width: '95%', maxWidth: '1000px', background: '#fff', borderRadius: '32px', padding: '48px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', maxHeight: '95vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.2)' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>Estado del Despacho</h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '8px', fontWeight: 600 }}>
                  Folio: <span style={{ color: '#3b82f6' }}>#{selectedOrder.documento}</span> • <span style={{ color: '#1e293b' }}>{selectedOrder.cliente}</span>
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '16px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }}><X size={24} color="#64748b" /></button>
            </div>

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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

              {/* Products Card */}
              <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h4 style={{ margin: '0 0 24px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Productos en esta orden ({selectedOrder.items.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#f8fafc', borderRadius: '16px' }}>
                      <div style={{ width: '50px', height: '50px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                        <Package size={24} color="#16a34a" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{it.producto.toUpperCase()} ({it.pendiente} pzas)</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Presentación: 20 KG / Fertilizante</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info Card */}
              <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Información de entrega</h4>
                  {selectedOrder.isNewClient && <span style={{ padding: '4px 10px', background: '#fff7ed', color: '#f97316', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800 }}>NUEVO CLIENTE</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <p style={{ margin: 0, width: '100px', fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Dirección:</p>
                    <input
                      className="search-input"
                      style={{ flex: 1, padding: '8px', fontSize: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      placeholder="Ingresa la dirección de entrega"
                      value={logisticsForm.address}
                      onChange={(e) => setLogisticsForm({ ...logisticsForm, address: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <p style={{ margin: 0, width: '100px', fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Contacto:</p>
                    <input
                      className="search-input"
                      style={{ flex: 1, padding: '8px', fontSize: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      placeholder="Nombre de quien recibe"
                      value={logisticsForm.contact}
                      onChange={(e) => setLogisticsForm({ ...logisticsForm, contact: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <p style={{ margin: 0, width: '100px', fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Teléfono:</p>
                    <input
                      className="search-input"
                      style={{ flex: 1, padding: '8px', fontSize: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      placeholder="Teléfono de contacto"
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

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '48px' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  flex: 0.3,
                  padding: '18px',
                  borderRadius: '20px',
                  border: '2px solid #e2e8f0',
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
                  flex: 1,
                  padding: '18px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#16a34a',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 20px -5px rgba(22, 163, 74, 0.4)',
                  transition: 'all 0.2s'
                }}>
                <Truck size={22} /> Confirmar Despacho
              </button>
            </div>
          </div>
        </div>
      )}

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

export default App;

