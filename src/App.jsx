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
  FileCheck2
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon size={20} />
    <span>{label}</span>
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
    { title: 'Vendedor', email: 'vendedor@agriflow.com', icon: SellIcon, color: '#22c55e', desc: 'Ventas/Campo' }
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

function ViewHeader({ title, onBack }) {
  return (
    <header className="header">
      <div className="path-header">
        <span className="breadcrumb" style={{ cursor: 'pointer' }} onClick={onBack}>Dashboard</span>
        <span className="breadcrumb"> / {title}</span>
      </div>
    </header>
  );
}

// 1. Módulo de Backorders
function BackordersModule({ onBack, user, refreshAllData, onEditOrder }) {
  const [backorders, setBackorders] = useState([]); // Iniciamos vacío
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [filterCliente, setFilterCliente] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const deleteBackorder = async (id) => {
    console.log(`Intentando eliminar backorder ID: ${id} (tipo: ${typeof id})`);
    try {
      const numericId = parseInt(id);
      const res = await fetch(`/api/backorders/${numericId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log(`Respuesta del servidor: ${res.status}`);
      if (res.ok) {
        console.log('Eliminación confirmada por el servidor');
        setBackorders(prev => prev.filter(bo => bo.id !== numericId));
        if (typeof refreshAllData === 'function') refreshAllData();
        alert('Pedido eliminado correctamente');
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Error del servidor:', res.status, errData);
        alert(`Error al eliminar: ${errData.error || 'Respuesta inválida del servidor'}`);
      }
    } catch (err) {
      console.error('Error de red crítico:', err);
      alert('Error de conexión con el servidor de backorders');
    }
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

  return (
    <div className="module-container">
      <ViewHeader title="Backorders" onBack={onBack} />
      <div className="module-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Backorders</h2>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>Gestión de pedidos pendientes</p>
      </div>

      <div className="module-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 180px', gap: '24px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem', marginBottom: '8px', color: '#64748b' }}>Cliente / Folio</label>
            <input
              type="text"
              placeholder="Buscar por cliente o número de documento..."
              className="search-input"
              style={{ width: '100%' }}
              value={filterCliente}
              onChange={(e) => setFilterCliente(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem', marginBottom: '8px', color: '#64748b' }}>Estado Global</label>
            <select
              className="select-input"
              style={{ width: '100%' }}
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Completado">Completado</option>
              <option value="Pendiente Entrega">Pendiente</option>
            </select>
          </div>
          <button
            className="btn-primary"
            style={{ height: '42px', justifyContent: 'center', background: '#2d5a3f' }}
            onClick={() => console.log("Refrescando filtros...")}
          >
            <Search size={18} style={{ marginRight: '8px' }} /> Filtrar
          </button>
        </div>
      </div>

      <div className="module-card">
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
              ) : backorders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No se encontraron pedidos pendientes.
                  </td>
                </tr>
              ) : (
                backorders
                  .filter(bo => {
                    const searchStr = (filterCliente || "").toLowerCase();
                    return (bo.cliente || "").toLowerCase().includes(searchStr) ||
                      (bo.documento || "").toLowerCase().includes(searchStr);
                  })
                  .reduce((acc, curr) => {
                    const folio = curr.documento || `PED-${curr.id}`;
                    const existing = acc.find(o => o.documento === folio);
                    if (existing) {
                      existing.cantidad += curr.cantidad;
                      existing.pendiente += curr.pendiente;
                      if (curr.estado !== 'Completado') existing.estado = 'En Proceso';
                      return acc;
                    }
                    return [...acc, { ...curr, documento: folio }];
                  }, [])
                  .map(order => (
                    <tr key={order.documento}>
                      <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.cliente}</td>
                      {(user?.role === 'Master' || user?.role === 'Admin' || user?.role === 'Administrador' || user?.role === 'Administrador Master') &&
                        <td style={{ fontSize: '0.85rem', color: '#2d5a3f', fontWeight: 600 }}>{order.vendedor}</td>}
                      <td style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: '#0369a1' }}>{order.documento}</span>
                          <button
                            onClick={() => {
                              const doc = new jsPDF();
                              // IMPORTANTE: Filtrar los items usando la misma lógica de folio que el reduce
                              const curFolio = order.documento;
                              const items = backorders.filter(it => {
                                const itFolio = it.documento || `PED-${it.id}`;
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
                        <span className={`badge ${order.estado === 'Completado' || order.estado === 'Completo' ? 'badge-success' : 'badge-process'}`}>
                          {order.estado}
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
                            onClick={() => {
                              if (window.confirm(`¿Eliminar pedido ${order.documento}?`)) {
                                // Eliminar todos los productos con este folio
                                backorders.filter(it => (it.documento || `PED-${it.id}`) === order.documento).forEach(it => deleteBackorder(it.id));
                              }
                            }}
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
  );
}

// 2. Módulo Inventario (Antes Cotizador)
function CotizadorModule({ onBack, onNavigate, products, setProducts, refreshAllData }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    category: 'Materiales',
    quantity: '',
    cost: '',
    margin: '',
    price: '',
    tax: 16
  });
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

    if (name === 'cost' || name === 'margin') {
      const cost = parseFloat(name === 'cost' ? value : formData.cost) || 0;
      const margin = parseFloat(name === 'margin' ? value : formData.margin) || 0;
      const calculatedPrice = cost * (1 + margin / 100);
      newData.price = calculatedPrice.toFixed(2);
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
      setFormData({ name: '', desc: '', category: 'Materiales', quantity: '', cost: '', margin: '', price: '', tax: 16 });
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
      tax: product.tax || 16
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <div className="module-container">
      <ViewHeader title="Inventario" onBack={onBack} />

      <div className="module-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Inventario</h2>
          <p style={{ color: '#64748b' }}>Inventario de Productos</p>
        </div>
        {!showForm && (
          <button
            className="btn-primary"
            style={{ background: '#2d5a3f' }}
            onClick={() => {
              setFormData({ name: '', desc: '', category: 'Materiales', quantity: '', cost: '', margin: '', price: '', tax: 16 });
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Nuevo Producto
          </button>
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
              <label>Categoría</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="select-input" style={{ width: '100%' }}>
                <option value="Materiales">Materiales</option>
                <option value="Insumos">Insumos</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Cantidad (Stock)</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
              </div>
              <div className="form-group">
                <label>Costo ($)</label>
                <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} step="0.01" required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Margen de Utilidad (%)</label>
                <input type="number" name="margin" value={formData.margin} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} step="0.1" required />
              </div>
              <div className="form-group">
                <label>Precio Final ($)</label>
                <input type="number" name="price" value={formData.price} readOnly className="search-input" style={{ width: '100%', background: '#f1f5f9' }} />
              </div>
            </div>
            <div className="form-group">
              <label>Tasa de IVA (%)</label>
              <select name="tax" value={formData.tax} onChange={handleInputChange} className="select-input" style={{ width: '100%' }}>
                <option value={16}>16% (General)</option>
                <option value={8}>8% (Fronterizo)</option>
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
                  <th style={{ padding: '0 16px', textAlign: 'left' }}>NOMBRE</th>
                  <th style={{ padding: '0 16px', textAlign: 'center' }}>CATEGORÍA</th>
                  <th style={{ padding: '0 16px', textAlign: 'center' }}>STOCK</th>
                  <th style={{ padding: '0 16px', textAlign: 'right' }}>COSTO</th>
                  <th style={{ padding: '0 16px', textAlign: 'center' }}>MARGEN</th>
                  <th style={{ padding: '0 16px', textAlign: 'center' }}>IVA</th>
                  <th style={{ padding: '0 16px', textAlign: 'right' }}>PRECIO</th>
                  <th style={{ padding: '0 16px', textAlign: 'center' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {(!products || products.length === 0) ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No hay productos registrados.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '16px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, color: '#1a2e21', fontSize: '0.95rem' }}>{p.name}</span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{p.description || p.desc || 'Sin descripción'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#1a2e21' }}>{p.category || 'General'}</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{p.quantity}</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', color: '#64748b', fontWeight: 500 }}>
                        ${parseFloat(p.cost || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>{p.margin}%</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span className={`badge ${p.tax === 0 ? 'badge-neutral' : 'badge-primary'}`} style={{ background: p.tax === 16 ? '#dbeafe' : p.tax === 8 ? '#fef9c3' : '#f1f5f9', color: p.tax === 16 ? '#1e40af' : p.tax === 8 ? '#854d0e' : '#64748b' }}>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Módulo de Ventas
function KpisModule({ onBack, sellers, setSellers, refreshSellers, prospects, backorders, carteraList, user }) {
  const [animate, setAnimate] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState(null);
  const [budgetVal, setBudgetVal] = React.useState('');
  const [openHistory, setOpenHistory] = React.useState(null);
  const [budgetType, setBudgetType] = React.useState('Anual');

  const isAdmin = user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'admin' || user?.role === 'Administrador';

  React.useEffect(() => {
    refreshSellers();
  }, []);

  React.useEffect(() => {
    if (sellers?.length > 0) {
      setTimeout(() => setAnimate(true), 150);
    }
  }, [sellers]);

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

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      <ViewHeader title="Centro de Rendimiento (KPIs)" onBack={onBack} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="module-header" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none', paddingBottom: 0, marginBottom: '24px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>Dashboard Analítico</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '4px' }}>Visor de inteligencia de ventas: Metas, Ingresos Reales y Predicción de Pipeline.</p>
        </div>

        {isAdmin && (
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

        {/* Global Master Graph Panel */}
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

        {/* Detailed Individual Profiling Grid */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Users size={24} color="#0f172a" />
          <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Perfiles Individuales de Desempeño</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(auto-fill, minmax(400px, 1fr))' : '1fr', gap: '24px' }}>
          {visibleSellers.map((s, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#475569' }}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{s.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> Vendedor Oficial • AgriFlow
                    </p>
                  </div>
                </div>
              </div>

              {/* Central Donut Chart + Metrics Layout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
                <CircularProgress real={s.progress} estimated={Math.max(0, s.estimatedProgress - s.progress)} size={110} strokeWidth={12} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Acumulado Real</p>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', margin: 0 }}>${(s.sales || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}</h3>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '0.5px' }}>Pronóstico (Pipeline)</p>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TrendingUp size={14} /> + ${(s.estimadas || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                    </h3>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Objetivo Anual (Presupuesto)</span>
                  <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>${(s.budget || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}</span>
                </div>

                {/* Advanced Progress Track */}
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: animate ? `${Math.min(s.progress, 100)}%` : '0%', height: '100%', background: 'linear-gradient(to right, #166534, #22c55e)', transition: 'width 1s ease-out' }}></div>
                </div>
              </div>

              {isAdmin && (
                <div style={{ marginTop: '20px' }}>
                  {editingBudget === s.id ? (
                    <div style={{ display: 'flex', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '200px' }}>
                        <select value={budgetType} onChange={e => setBudgetType(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, color: '#475569', outline: 'none', background: '#fff' }}>
                          <option value="Semanal">Semanal</option>
                          <option value="Mensual">Mensual</option>
                          <option value="Trimestral">Trimestral</option>
                          <option value="Semestral">Semestral</option>
                          <option value="Anual">Anual</option>
                        </select>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>$</span>
                          <input type="number" style={{ width: '100%', padding: '10px 10px 10px 24px', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', boxSizing: 'border-box' }} placeholder="Nuevo Presupuesto" value={budgetVal} onChange={e => setBudgetVal(e.target.value)} autoFocus />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleSaveBudget(s.id)} style={{ padding: '0 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>Guardar</button>
                        <button onClick={() => setEditingBudget(null)} style={{ padding: '0 16px', background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingBudget(s.id); setBudgetVal(s.budget); }} style={{ width: '100%', padding: '14px', background: '#fff', color: '#0f172a', border: '2px dashed #cbd5e1', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s hover:{borderColor: "#94a3b8"}' }}>
                      <Pencil size={16} /> Ajustar Planeación y Meta
                    </button>
                  )}
                </div>
              )}

              {!isAdmin && (
                <div style={{ textAlign: 'center', background: (s.budget || 0) - (s.sales || 0) <= 0 ? 'linear-gradient(to right, #f0fdf4, #dcfce7)' : 'linear-gradient(to right, #fffbeb, #fef3c7)', borderRadius: '12px', padding: '16px', border: `1px solid ${(s.budget || 0) - (s.sales || 0) <= 0 ? '#bbf7d0' : '#fde68a'}` }}>
                  <p style={{ fontSize: '0.75rem', color: (s.budget || 0) - (s.sales || 0) <= 0 ? '#166534' : '#b45309', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Estatus de Logro</p>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: (s.budget || 0) - (s.sales || 0) <= 0 ? '#15803d' : '#d97706', margin: 0 }}>
                    {(s.budget || 0) - (s.sales || 0) <= 0 ? '¡Meta del año conseguida! 🎉🚀' : `Faltan ${((s.budget || 0) - (s.sales || 0)).toLocaleString('es-MX', { maximumFractionDigits: 0 })} para la meta.`}
                  </h4>
                </div>
              )}
              <button
                onClick={() => setOpenHistory(openHistory === s.id ? null : s.id)}
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '16px', fontWeight: 600, color: '#334155', transition: 'all 0.2s' }}>
                <ClipboardList size={18} /> {openHistory === s.id ? 'Ocultar Historial Operativo' : 'Ver Historial Operativo de Desempeño'}
              </button>

              {openHistory === s.id && (
                <div style={{ marginTop: '20px', borderTop: '1px dashed #cbd5e1', paddingTop: '20px' }}>

                  {/* Pipeline Activo */}
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} color="#d97706" /> Pipeline (En Negociación)</h5>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '8px' }}>
                      {(prospects || []).filter(p => (p.seller === s.name || ((p.id % Math.max(1, sellers.length)) === s.id % Math.max(1, sellers.length))) && p.stage !== 'Venta Cerrada' && p.stage !== 'Perdido').map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #f8fafc', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{p.name}</span>
                          <span style={{ color: '#059669', fontWeight: 700 }}>${(p.budget || 0).toLocaleString('es-MX')}</span>
                        </div>
                      ))}
                      {((prospects || []).filter(p => (p.seller === s.name || ((p.id % Math.max(1, sellers.length)) === s.id % Math.max(1, sellers.length))) && p.stage !== 'Venta Cerrada' && p.stage !== 'Perdido').length === 0) && <div style={{ padding: '8px', color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>No hay ventas activas en progreso.</div>}
                    </div>
                  </div>

                  {/* Backorders (No Estregadas) */}
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} color="#dc2626" /> Ventas No Entregadas (Backorders)</h5>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '8px' }}>
                      {(backorders || []).filter(b => b.vendedor === s.name).map(b => (
                        <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #fee2e2', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600, color: '#991b1b' }}>{b.cliente} <span style={{ fontWeight: 'normal', color: '#dc2626' }}>({b.producto})</span></span>
                          <span style={{ color: '#b91c1c', fontWeight: 700 }}>{b.pendiente} pzas</span>
                        </div>
                      ))}
                      {((backorders || []).filter(b => b.vendedor === s.name).length === 0) && <div style={{ padding: '8px', color: '#fca5a5', fontSize: '0.8rem', textAlign: 'center' }}>Todas las ventas están entregadas al 100%.</div>}
                    </div>
                  </div>

                  {/* Cartera Activa */}
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} color="#2563eb" /> Historial de Cobranza (Cartera)</h5>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '8px' }}>
                      {(carteraList || []).filter(c => c.seller === s.name).map(c => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #dbeafe', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 600, color: '#1e40af' }}>{c.client}</span>
                          <span style={{ color: '#1d4ed8', fontWeight: 700 }}>${(c.amount || 0).toLocaleString('es-MX')}</span>
                        </div>
                      ))}
                      {((carteraList || []).filter(c => c.seller === s.name).length === 0) && <div style={{ padding: '8px', color: '#93c5fd', fontSize: '0.8rem', textAlign: 'center' }}>Felicidades, sin saldos pendientes.</div>}
                    </div>
                  </div>

                </div>
              )}

            </div>
          ))}
          {visibleSellers.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
              <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}><TrendingUp size={32} color="#94a3b8" /></div>
              <h3 style={{ color: '#475569', fontSize: '1.3rem', fontWeight: 700 }}>No hay metas o desempeño que visualizar aún.</h3>
              <p style={{ color: '#94a3b8' }}>Contacta a tu administrador para que configure tus objetivos de venta.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



function VentasModule({ onBack, onNavigate, setQuotingProspect, user, backorders = [], carteraList = [], prospects = [], refreshData }) {
  const isAdmin = user?.role === 'Master' || user?.role === 'Administrador Master' || user?.role === 'Administrador' || user?.role === 'admin';
  const [activeTab, setActiveTab] = React.useState('pipeline');
  const [pipelineType, setPipelineType] = React.useState('prospects');
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
    { name: 'Llamada', icon: Phone, color: '#10b981' },
    { name: 'Agendar Cita', icon: Calendar, color: '#10b981' },
    { name: 'Cotizarle', icon: FileText, color: '#10b981' },
    { name: 'Negociación', icon: TrendingUp, color: '#f59e0b' },
    { name: 'Recibir Pedido', icon: Package, color: '#3b82f6' },
    { name: 'Venta Completada', icon: CheckCircle2, color: '#059669' },
    { name: 'Perdido', icon: ShieldAlert, color: '#ef4444' }
  ];

  const clientStages = [
    { name: 'Llamada', icon: Phone, color: '#10b981' },
    { name: 'Cotización', icon: FileText, color: '#10b981' },
    { name: 'Recibir Pedido', icon: Package, color: '#10b981' },
    { name: 'Por Menores', icon: ClipboardList, color: '#10b981' },
    { name: 'Depósito (Venta)', icon: DollarSign, color: '#059669' }
  ];

  const updateProspectStage = async (id, newStage, isClientValue, isConversion = false) => {
    try {
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
        setShowSaleClosureModal(false);
        if (refreshData) refreshData();
        alert(`¡Felicidades! Venta cerrada con ${closingProspect.name}.`);
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
    const items = (prospects || []).filter(p => !!p.isClient === (pipelineType === 'clients'));

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
                    <stage.icon size={16} color="white" />
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{stage.name}</h4>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', background: '#fff', padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>{stageItems.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {stageItems.length === 0 ? (
                  <div style={{ padding: '24px', border: '2px dashed #cbd5e1', borderRadius: '18px', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.3)' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: 600 }}>Sin {pipelineType === 'clients' ? 'órdenes' : 'prospectos'} activas en esta etapa.</p>
                    {idx === 0 && (
                      <button onClick={() => alert('Próximamente: Podrás agregar clientes aquí directamente.')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#fff', color: '#10b981', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        + Nuevo Ingreso
                      </button>
                    )}
                  </div>
                ) : (
                  stageItems.map(p => (
                    <div key={p.id} className="kanban-card" style={{ background: '#fff', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative', transition: 'transform 0.2s' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <p style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', fontSize: '0.95rem' }}>{p.name}</p>
                          {stage.name === 'Llamada' && <Phone size={14} color="#64748b" />}
                        </div>
                        {stage.name === 'Llamada' ? (
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

                      {stage.name === 'Llamada' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => { setCallingTo(p); setIsCalling(true); }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}
                          >
                            <Phone size={16} fill="white" /> Realizar Llamada
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
                              onClick={() => {
                                setClosingProspect(p);
                                const initialAmount = p.budget ? Number(p.budget).toFixed(2) : '';
                                setSaleClosureForm(prev => ({ ...prev, finalAmount: initialAmount }));
                                setShowSaleClosureModal(true);
                              }}
                              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              A venta
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

                          <button
                            onClick={() => updateProspectStage(p.id, 'Venta Completada', p.isClient)}
                            style={{ width: '100%', padding: '12px', borderRadius: '14px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >
                            <Truck size={16} /> Confirmar Entrega
                          </button>
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
                      ) : stage.name === 'Cotizarle' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                            <button
                              onClick={() => { setQuotingProspect(p); onNavigate('Cotizador'); }}
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
                              A negociación
                            </button>
                          </div>
                          <button
                            onClick={() => { setEditingNotesFor(p); setCurrentNotes(p.notes || ''); setShowNotesModal(true); }}
                            style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Bitácora
                          </button>
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
                            onClick={() => updateProspectStage(p.id, 'Llamada', true, true)}
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
      <ViewHeader title="Centro de Comando de Ventas" onBack={onBack} />

      <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 20px' }}>

        {/* Encabezado Principal Orientado al Usuario */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', marginTop: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>Flujos de Tráfico</h2>
              <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>Ventas 2025</div>
            </div>
            <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>Gobernanza comercial: De la primera llamada al depósito final.</p>
          </div>

          <div style={{ display: 'flex', background: '#fff', padding: '6px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <button onClick={() => setActiveTab('pipeline')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'pipeline' ? '#0f172a' : 'transparent', color: activeTab === 'pipeline' ? '#fff' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>
              Tableros (Pipelines)
            </button>
            <button onClick={() => setActiveTab('registros')} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'registros' ? '#0f172a' : 'transparent', color: activeTab === 'registros' ? '#fff' : '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>
              Histórico Liquidado
            </button>
          </div>
        </div>

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
                              <button onClick={() => { setQuotingProspect(negotiatingProspect); onNavigate('Cotizador'); }} style={{ marginTop: '16px', color: '#3b82f6', border: '1px solid #3b82f6', background: 'none', fontWeight: 800, cursor: 'pointer', padding: '8px 16px', borderRadius: '10px' }}>Configurar Pedido Ahora</button>
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
                    {saleClosureForm.invoiceRequired && (
                      <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>RFC del Cliente</label>
                        <input
                          type="text"
                          placeholder="RFC de Facturación"
                          value={saleClosureForm.rfc}
                          onChange={(e) => setSaleClosureForm({ ...saleClosureForm, rfc: e.target.value.toUpperCase() })}
                          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}
                        />
                      </div>
                    )}
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
                  style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', background: '#fff', color: '#1d4ed8', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #dbeafe' }}
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
function ProspectosModule({ onBack, prospects, setProspects, refreshProspects }) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', interest: '', location: '', budget: '', stage: 'Contacto'
  });

  useEffect(() => {
    refreshProspects();
  }, []);

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
          budget: parseFloat(formData.budget) || 0
        })
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingId) {
          setProspects(prospects.map(p => p.id === editingId ? saved : p));
        } else {
          setProspects([saved, ...prospects]);
        }
        closeForm();
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
    setFormData({ name: '', phone: '', email: '', interest: '', location: '', budget: '', stage: 'Contacto' });
  };

  const deleteProspect = async (id) => {
    if (window.confirm('¿Eliminar este prospecto definitivamente?')) {
      try {
        const res = await fetch(`/api/prospects/${id}`, { method: 'DELETE' });
        if (res.ok) setProspects(prev => prev.filter(p => p.id !== id));
      } catch (err) { console.error(err); }
    }
  };

  const stages = [
    { label: 'Contacto', count: prospects.filter(p => p.stage === 'Contacto').length },
    { label: 'Evaluación', count: prospects.filter(p => p.stage === 'Evaluación').length },
    { label: 'Negociación', count: prospects.filter(p => p.stage === 'Negociación').length },
  ];

  if (loading) return <div className="module-container" style={{ padding: '80px', textAlign: 'center' }}><h3>Cargando prospectos reales...</h3></div>;

  return (
    <div className="module-container">
      <ViewHeader title="Prospectos" onBack={onBack} />
      <div className="module-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Prospectos</h2>
          <p style={{ color: '#64748b' }}>Gestión del embudo de ventas</p>
        </div>
        {!showForm && (
          <button
            className="btn-primary"
            style={{ background: '#2d5a3f' }}
            onClick={() => setShowForm(true)}
          >
            + Nuevo Prospecto
          </button>
        )}
      </div>

      {showForm ? (
        <div className="module-card">
          <h3 style={{ marginBottom: '20px' }}>{editingId ? 'Editar Prospecto' : 'Nuevo Prospecto'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
            <div className="form-group">
              <label>Nombre del Cliente / Empresa</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="form-group">
              <label>Interés (Producto / Servicio)</label>
              <input type="text" name="interest" value={formData.interest} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
            </div>
            <div className="form-group">
              <label>Ubicación</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Presupuesto Estimado ($)</label>
                <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} />
              </div>
              <div className="form-group">
                <label>Etapa Inicial</label>
                <select name="stage" value={formData.stage} onChange={handleInputChange} className="select-input" style={{ width: '100%' }}>
                  <option value="Contacto">Contacto</option>
                  <option value="Evaluación">Evaluación</option>
                  <option value="Negociación">Negociación</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
              <button type="submit" className="btn-primary" style={{ background: '#2d5a3f' }}>{editingId ? 'Guardar Cambios' : 'Guardar Prospecto'}</button>
              <button type="button" className="btn-secondary" onClick={closeForm}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Stages Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {stages.map((stage, idx) => (
              <div key={idx} className="module-card" style={{ textAlign: 'center', padding: '16px', borderTop: '4px solid #10b981' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{stage.count}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{stage.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {prospects.map((prospect) => (
              <div key={prospect.id} className="module-card" style={{ padding: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ maxWidth: '70%', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>{prospect.name}</h3>
                    <span className="badge" style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.75rem', marginTop: '8px', display: 'inline-block' }}>{prospect.stage}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEdit(prospect)}
                      style={{ padding: '5px 10px', borderRadius: '8px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      title="Editar Prospecto"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteProspect(prospect.id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', display: 'flex', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)' }}
                      title="Eliminar Prospecto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.9rem' }}>
                    <Phone size={18} color="#94a3b8" />
                    <span>{prospect.phone || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.9rem' }}>
                    <Users size={18} color="#94a3b8" />
                    <span>{prospect.email || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.9rem' }}>
                    <Package size={18} color="#94a3b8" />
                    <span>{prospect.interest}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.9rem' }}>
                    <MapPin size={18} color="#94a3b8" />
                    <span>{prospect.location || 'N/A'}</span>
                  </div>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Presupuesto estimado</p>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2d5a3f' }}>${prospect.budget.toLocaleString('es-MX')}</h4>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// 6. Módulo de Cartera
function CarteraModule({ onBack, carteraList, setCarteraList, refreshCartera }) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ client: '', seller: 'Edgar Leyton', amount: '', ageGroup: '1-30' });
  const [hoverSegment, setHoverSegment] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' });

  useEffect(() => {
    refreshCartera();
  }, []);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const calculateDynamicSellers = () => {
    const map = {};
    const activeCartera = carteraList.filter(c => c.status !== 'Pagado');
    for (const item of activeCartera) {
      if (!map[item.seller]) {
        map[item.seller] = { name: item.seller, m1: 0, m2: 0, m3: 0, m4: 0, total: 0 };
      }
      const amount = parseFloat(item.amount);
      if (item.ageGroup === '1-30') map[item.seller].m1 += amount;
      if (item.ageGroup === '31-60') map[item.seller].m2 += amount;
      if (item.ageGroup === '61-90') map[item.seller].m3 += amount;
      if (item.ageGroup === '+90') map[item.seller].m4 += amount;
      map[item.seller].total += amount;
    }
    return Object.values(map).sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const calculateDynamicTotals = () => {
    const activeCartera = carteraList.filter(c => c.status !== 'Pagado');
    let m1 = 0, m2 = 0, m3 = 0, m4 = 0;
    for (const item of activeCartera) {
      const amount = parseFloat(item.amount);
      if (item.ageGroup === '1-30') m1 += amount;
      if (item.ageGroup === '31-60') m2 += amount;
      if (item.ageGroup === '61-90') m3 += amount;
      if (item.ageGroup === '+90') m4 += amount;
    }
    return { m1, m2, m3, m4, total: m1 + m2 + m3 + m4 };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cartera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) })
      });
      if (res.ok) {
        const created = await res.json();
        setCarteraList([created, ...carteraList]);
        setShowForm(false);
        setFormData({ client: '', seller: 'Edgar Leyton', amount: '', ageGroup: '1-30' });
      }
    } catch (err) { console.error(err); }
  };

  const sellersDebt = calculateDynamicSellers();
  const totals = calculateDynamicTotals();

  const summary = [
    { label: '1-30 días', amount: `$${totals.m1.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, color: '#facc15' },
    { label: '31-60 días', amount: `$${totals.m2.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, color: '#f97316' },
    { label: '61-90 días', amount: `$${totals.m3.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, color: '#f87171' },
    { label: '+90 días', amount: `$${totals.m4.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, color: '#ef4444' },
  ];

  const payDebt = async (id) => {
    if (window.confirm("¿Marcar registro como pagado?")) {
      try {
        const res = await fetch(`/api/cartera/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Pagado' })
        });
        if (res.ok) {
          // Actualizamos el estado local sin eliminar, para que VentasModule lo vea como Pagado
          setCarteraList(prev => prev.map(c => c.id === id ? { ...c, status: 'Pagado' } : c));
          if (typeof refreshCartera === 'function') refreshCartera();
          alert('¡Cobro registrado con éxito!');
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(`Error al cobrar: ${errData.error || 'Respuesta inválida'}`);
        }
      } catch (err) {
        console.error('Error en cobro:', err);
        alert('Error de conexión al procesar el cobro');
      }
    }
  };

  if (loading) return <div className="module-container" style={{ padding: '80px', textAlign: 'center' }}><h3>Cargando Cartera Dinámica...</h3></div>;

  return (
    <div className="module-container">
      <ViewHeader title="Cartera" onBack={onBack} />
      <div className="module-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Cartera Vencida</h2>
          <p style={{ color: '#64748b' }}>Monitoreo de cuentas por cobrar desde la BD</p>
        </div>
        {!showForm && (
          <button
            className="btn-primary"
            style={{ background: '#2d5a3f' }}
            onClick={() => setShowForm(true)}
          >
            + Registrar Deuda
          </button>
        )}
      </div>

      {showForm ? (
        <div className="module-card">
          <h3 style={{ marginBottom: '20px' }}>Registrar Nueva Cartera (Deuda)</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
            <div className="form-group">
              <label>Cliente / Empresa deudora</label>
              <input type="text" className="search-input" style={{ width: '100%' }} value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Vendedor responsable</label>
                <input type="text" className="search-input" style={{ width: '100%' }} value={formData.seller} onChange={e => setFormData({ ...formData, seller: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Monto Adeudado ($)</label>
                <input type="number" className="search-input" style={{ width: '100%' }} value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Antigüedad del saldo</label>
              <select className="select-input" style={{ width: '100%' }} value={formData.ageGroup} onChange={e => setFormData({ ...formData, ageGroup: e.target.value })}>
                <option value="1-30">1-30 días</option>
                <option value="31-60">31-60 días</option>
                <option value="61-90">61-90 días</option>
                <option value="+90">+90 días</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ background: '#2d5a3f' }}>Guardar Deuda</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
            {summary.map((item, idx) => (
              <div key={idx} className="module-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{item.label}</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{item.amount}</h3>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', marginBottom: '24px' }}>
            {/* Distribution Card */}
            <div className="module-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '32px' }}>Distribución por Antigüedad</h3>
              {(() => {
                const p1 = totals.total > 0 ? Math.round((totals.m1 / totals.total) * 100) : 0;
                const p2 = totals.total > 0 ? Math.round((totals.m2 / totals.total) * 100) : 0;
                const p3 = totals.total > 0 ? Math.round((totals.m3 / totals.total) * 100) : 0;
                let p4 = totals.total > 0 ? 100 - p1 - p2 - p3 : 0;
                if (totals.total > 0 && p4 < 0) p4 = 0;

                const circleTransition = { transition: 'stroke-dasharray 0.8s ease-in-out, stroke-dashoffset 0.8s ease-in-out, stroke-width 0.2s', cursor: 'pointer' };

                return (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '280px', margin: '10px 0' }}>
                    {totals.total > 0 ? (
                      <>
                        <svg viewBox="0 0 36 36" style={{ width: '200px', height: '200px', transform: 'rotate(-90deg)', overflow: 'visible' }}>
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />

                          {p1 > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#facc15" strokeWidth={hoverSegment?.id === 1 ? "5.5" : "4"} strokeDasharray={`${p1} 100`} strokeDashoffset="0" style={circleTransition} onMouseEnter={() => setHoverSegment({ id: 1, title: '1-30 días', percent: p1, color: '#ca8a04' })} onMouseLeave={() => setHoverSegment(null)} />}

                          {p2 > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#f97316" strokeWidth={hoverSegment?.id === 2 ? "5.5" : "4"} strokeDasharray={`${p2} 100`} strokeDashoffset={`-${p1}`} style={circleTransition} onMouseEnter={() => setHoverSegment({ id: 2, title: '31-60 días', percent: p2, color: '#c2410c' })} onMouseLeave={() => setHoverSegment(null)} />}

                          {p3 > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#f87171" strokeWidth={hoverSegment?.id === 3 ? "5.5" : "4"} strokeDasharray={`${p3} 100`} strokeDashoffset={`-${p1 + p2}`} style={circleTransition} onMouseEnter={() => setHoverSegment({ id: 3, title: '61-90 días', percent: p3, color: '#b91c1c' })} onMouseLeave={() => setHoverSegment(null)} />}

                          {p4 > 0 && <circle cx="18" cy="18" r="16" fill="none" stroke="#ef4444" strokeWidth={hoverSegment?.id === 4 ? "5.5" : "4"} strokeDasharray={`${p4} 100`} strokeDashoffset={`-${p1 + p2 + p3}`} style={circleTransition} onMouseEnter={() => setHoverSegment({ id: 4, title: '+90 días', percent: p4, color: '#991b1b' })} onMouseLeave={() => setHoverSegment(null)} />}
                        </svg>

                        {/* Info Centro Dinámico */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', transition: 'all 0.3s ease' }}>
                          {hoverSegment ? (
                            <>
                              <p style={{ fontSize: '0.85rem', color: hoverSegment.color, fontWeight: 700, margin: 0, transition: 'color 0.3s' }}>{hoverSegment.title}</p>
                              <p style={{ fontSize: '1.6rem', color: hoverSegment.color, fontWeight: 800, margin: 0, transition: 'color 0.3s' }}>{hoverSegment.percent}%</p>
                            </>
                          ) : (
                            <>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: 0, letterSpacing: '0.5px' }}>TOTAL</p>
                              <p style={{ fontSize: '1.2rem', color: '#1a2e21', fontWeight: 800, margin: 0 }}>100%</p>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Agrega datos para generar la gráfica</p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Alerts Card */}
            <div className="module-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <AlertCircle size={20} color="#f97316" />
                <h3 style={{ fontSize: '1.1rem' }}>Alertas de Cobranza</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {totals.m4 > 0 && (
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fee2e2', padding: '16px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#991b1b', fontSize: '0.9rem', marginBottom: '4px' }}>Cartera crítica +90 días</h4>
                    <p style={{ color: '#b91c1c', fontSize: '0.8rem' }}>${totals.m4.toLocaleString('es-MX')} requiere acción inmediata</p>
                  </div>
                )}
                {totals.m3 > 0 && (
                  <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', padding: '16px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#854d0e', fontSize: '0.9rem', marginBottom: '4px' }}>Cartera en riesgo 61-90 días</h4>
                    <p style={{ color: '#a16207', fontSize: '0.8rem' }}>${totals.m3.toLocaleString('es-MX')} debe ser monitoreada</p>
                  </div>
                )}
                <div style={{ background: '#fffbeb', border: '1.5px solid #fef3c7', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ color: '#854d0e', fontSize: '0.9rem', marginBottom: '4px' }}>Cartera reciente</h4>
                  <p style={{ color: '#a16207', fontSize: '0.8rem' }}>${totals.m1.toLocaleString('es-MX')} en periodo 1-30 días</p>
                </div>
              </div>
            </div>
          </div>

          <div className="module-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Detalle de facturas vencidas</h3>
            <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>FECHA</th>
                    <th style={{ textAlign: 'left' }}>CLIENTE</th>
                    <th style={{ textAlign: 'left' }}>RANGO</th>
                    <th style={{ textAlign: 'right' }}>MONTO</th>
                    <th style={{ textAlign: 'center' }}>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {carteraList.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>Agrega deudas para visualizarlas</td></tr>
                  ) : carteraList.filter(c => c.status !== 'Pagado').slice(0, 50).map(c => (
                    <tr key={c.id}>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>{c.client} <br /><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.seller}</span></td>
                      <td><span className="badge" style={{ background: '#f1f5f9' }}>{c.ageGroup}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>${parseFloat(c.amount).toLocaleString('es-MX')}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => payDebt(c.id)} style={{ padding: '4px 8px', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                          Cobrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="module-card" style={{ textAlign: 'center', padding: '32px', marginBottom: '24px' }}>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Total Cartera Vencida Consolidada</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a2e21' }}>${totals.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h2>
          </div>

          {/* Detailed Table Card */}
          <div className="module-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Consolidado por Vendedor</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('name')}>VENDEDOR {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={{ textAlign: 'right', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('m1')}>1-30 DÍAS {sortConfig.key === 'm1' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={{ textAlign: 'right', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('m2')}>31-60 DÍAS {sortConfig.key === 'm2' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={{ textAlign: 'right', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('m3')}>61-90 DÍAS {sortConfig.key === 'm3' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={{ textAlign: 'right', cursor: 'pointer', userSelect: 'none', color: '#991b1b' }} onClick={() => handleSort('m4')}>+90 DÍAS {sortConfig.key === 'm4' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={{ textAlign: 'right', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('total')}>TOTAL {sortConfig.key === 'total' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  </tr>
                </thead>
                <tbody>
                  {sellersDebt.map((debt, idx) => {
                    const percentOfTotal = totals.total > 0 ? (debt.total / totals.total) * 100 : 0;
                    return (
                      <tr key={idx} style={{ transition: 'background-color 0.3s' }}>
                        <td style={{ fontWeight: 600 }}>{debt.name}</td>
                        <td style={{ textAlign: 'right', color: '#64748b' }}>${debt.m1.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td style={{ textAlign: 'right', color: '#64748b' }}>${debt.m2.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td style={{ textAlign: 'right', color: '#64748b' }}>${debt.m3.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td style={{ textAlign: 'right', color: debt.m4 > 0 ? '#dc2626' : '#94a3b8', fontWeight: debt.m4 > 0 ? 700 : 400 }}>
                          ${debt.m4.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          {debt.m4 > 50000 && <span style={{ marginLeft: '6px', fontSize: '0.8rem' }} title="Riesgo Extremo">⚠️</span>}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#1a2e21' }}>
                          <span>${debt.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                          <div style={{ marginTop: '8px', height: '4px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ height: '100%', width: `${percentOfTotal}%`, background: '#2d5a3f', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

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
        b.estado
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Cliente', 'Producto', 'Vendedor', 'Cant. Orig', 'Pendiente', 'Estado']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [45, 90, 63] }
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
      headers = ['Cliente', 'Producto', 'Vendedor', 'Cant. Orig', 'Pendiente', 'Estado'];
      rows = (backorders || []).map(b => [
        b.cliente, b.producto, b.vendedor, b.cantidad, b.pendiente, b.estado
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
    <div className="module-container">
      <ViewHeader title="Reportes" onBack={onBack} />
      <div className="module-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Reportes</h2>
        <p style={{ color: '#64748b' }}>Exporta información detallada de tus operaciones en PDF y Excel</p>
      </div>

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
function ProductosModule({ onBack, onNavigate, quotingProspect, setQuotingProspect, manualClientName, setManualClientName, cart, setCart, addToCart, removeFromCart, updateCartQty, products, setProducts, user, refreshData, prospects, backorders, editingFolio, setEditingFolio }) {
  const cartTotal = cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);

  const handleFinalizeQuote = async () => {
    if (cart.length === 0) return;

    try {
      // 1. Determinar el Folio (Si estamos editando, usamos el anterior)
      let folio = editingFolio;
      if (editingFolio) {
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
            estado: 'Entrega Pendiente',
            prioridad: 'Media'
          })
        });

        // Descontar del Inventario (unidades físicas)
        await fetch(`/api/products/${item.id}/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decrementBy: item.qty })
        });
      }

      if (quotingProspect) {
        // MODO COTIZACION PARA PROSPECTO
        const itemsList = cart.map(item => `${item.name} (${item.qty})`).join(', ');

        // 1. Actualizar Prospecto en BD
        await fetch(`/api/prospects/${quotingProspect.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interest: itemsList.substring(0, 200), // Limitar longitud
            budget: cartTotal,
            stage: 'Negociación' // Avanzamos automáticamente a negociación
          })
        });

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
        doc.save(`Cotizacion_${quotingProspect.name.replace(/\s+/g, '_')}.pdf`);

        alert(`📄 Cotización finalizada y registrada.\n- Se descontaron ${cart.length} productos del inventario.\n- Se generaron los Backorders correspondientes.\n- El prospecto avanzó a Negociación.`);
        setQuotingProspect(null);
        setManualClientName('');
        setEditingFolio(null);
        setCart([]);
        if (typeof refreshData === 'function') refreshData(); // Forzar actualización de stock en UI
        onNavigate('Ventas');
        return;
      }

      // MODO VENTA DIRECTA (CLIENTE EXISTENTE)
      await fetch('/api/ventas/add-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerName: user?.name,
          amount: cartTotal
        })
      });

      alert(`🎉 ¡Operación finalizada con éxito por ${user?.name}!\nInventario actualizado y Backorders generados.\nTotal: $${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`);
      setCart([]);
      setEditingFolio(null);
      setManualClientName('');
      if (typeof refreshData === 'function') refreshData();
      onNavigate('Dashboard');
    } catch (err) {
      console.error(err);
      onNavigate('Dashboard');
    }
  };

  const handleBack = () => {
    if (quotingProspect) {
      setQuotingProspect(null);
      onNavigate('Ventas');
    } else {
      onBack();
    }
  };

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    const qty = parseInt(value);
    if (qty > 0) {
      setQuantities({ ...quantities, [id]: qty });
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas las categorías' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="module-container">
      <ViewHeader title={quotingProspect ? "Generador de Cotización" : "Cotizador"} onBack={handleBack} />
      {quotingProspect && (
        <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', padding: '20px 24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 15px -1px rgba(2, 132, 199, 0.2)' }}>
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

      {!quotingProspect && (
        <div className="module-card" style={{
          marginBottom: '24px',
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
                value={manualClientName}
                onChange={(e) => setManualClientName(e.target.value)}
              >
                <option value="">-- Seleccionar cliente de la lista --</option>
                {prospects.map(p => (
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
                onChange={(e) => setManualClientName(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="module-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Cotizador</h2>
          <p style={{ color: '#64748b' }}>Gestión de productos y cotizaciones</p>
        </div>
      </div>

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
            <table className="data-table">
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>CATEGORÍA</th>
                  <th>STOCK</th>
                  <th>COSTO</th>
                  <th>MARGEN</th>
                  <th>IVA</th>
                  <th>PRECIO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{p.name}</span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.description || p.desc || 'Sin descripción'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{p.category || 'N/A'}</span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.quantity}</td>
                      <td style={{ textAlign: 'right', color: '#64748b' }}>${p.cost?.toFixed(2)}</td>
                      <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{p.margin}%</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: p.tax === 0 ? '#f1f5f9' : '#eff6ff', color: p.tax === 0 ? '#64748b' : '#3b82f6', fontWeight: 600 }}>
                          {p.tax || 0}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#1a2e21' }}>${p.price?.toFixed(2)}</td>
                      <td style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                        <input
                          type="number"
                          min="1"
                          value={quantities[p.id] || 1}
                          onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                          style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'center' }}
                        />
                        <button
                          onClick={() => addToCart(p, quantities[p.id] || 1)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', height: 'auto', minHeight: 'unset' }}
                          title="Agregar al carrito"
                        >
                          Agregar
                        </button>
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Carrito</h3>
              <Package size={20} color="#2d5a3f" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '140px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px', fontStyle: 'italic', fontSize: '0.85rem' }}>
                  Tu carrito está vacío. <br />Agrega productos de la lista.
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
                style={{ width: '100%', justifyContent: 'center', background: quotingProspect ? '#0284c7' : '#2d5a3f', height: '50px', fontSize: '1rem', borderRadius: '14px', gap: '10px' }}
                onClick={handleFinalizeQuote}
                disabled={cart.length === 0}
              >
                {quotingProspect ? <><FileText size={20} /> Finalizar Cotización</> : 'Finalizar Cotización'}
              </button>
            </div>
          </div>

          {/* Estado de Cuenta / Pendientes Section */}
          <div className="module-card" style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Clock size={20} color="#0369a1" />
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
  );
}

function MainDashboard({ user, setView, prospects, carteraList, backorders }) {
  const totalBackorders = backorders.reduce((sum, b) => sum + (b.pendiente || 0), 0);
  const totalCartera = (carteraList || []).filter(c => c.status?.toLowerCase() !== 'pagado').reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalVentas = (carteraList || []).filter(c => c.status?.toLowerCase() === 'pagado').reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <>
      <header className="header">
        <div className="path-header">
          <span className="breadcrumb">Dashboard</span>
        </div>
      </header>

      <section className="welcome-section">
        <h2>Bienvenido, {user.name}</h2>
        <p>Aquí está el resumen de tus operaciones</p>
      </section>

      <div className="stats-grid" style={{ marginTop: '32px' }}>
        <StatCard icon={Package} label="Backorders Activos" value={totalBackorders.toString()} subtext={`${backorders.length} órdenes`} iconClass="icon-orange" />
        <StatCard icon={TrendingUp} label="Ventas del Mes" value={`$${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} subtext="Acumulado 2025" iconClass="icon-green" />
        <StatCard icon={FileText} label="Cotizaciones Pendientes" value="0" subtext="Por revisar" iconClass="icon-blue" />
        <StatCard icon={DollarSign} label="Cartera Vencida" value={`$${totalCartera.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} subtext="Total por cobrar" iconClass="icon-pink" />
        <StatCard icon={Users} label="Prospectos Activos" value={prospects.length.toString()} subtext="En proceso" iconClass="icon-green" />
      </div>

      <div className="dashboard-grid-main">
        <div className="alerts-card">
          <div className="section-header">
            <AlertCircle size={22} color="#ff9800" />
            <h3>Alertas</h3>
          </div>
          <div className="alert-list">
            <AlertItem icon={Package} title="378 unidades pendientes" subtitle="Revisar backorders urgentes" variant="alert-yellow" />
            <AlertItem icon={DollarSign} title="Cartera vencida alta" subtitle="Iniciar plan de cobranza" variant="alert-red" />
          </div>
        </div>

        <div className="quick-access-card">
          <div className="section-header">
            <h3>Accesos rápidos</h3>
          </div>
          <div className="quick-list">
            <QuickAccessItem icon={FileText} label="Nueva cotización" onClick={() => setView('Cotizador')} />
            <QuickAccessItem icon={Users} label="Agregar prospecto" onClick={() => setView('Prospectos')} />
            <QuickAccessItem icon={Package} label="Actualizar backorders" onClick={() => setView('Backorders')} />
            <QuickAccessItem icon={DollarSign} label="Revisar cartera" onClick={() => setView('Cartera')} />
          </div>
        </div>
      </div>
    </>
  );
}

function PersonalModule({ onBack, user }) {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '1234', phone: '', avatar: '', role: 'Vendedor'
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (e) { console.error(e); }
  };

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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      // Si no hay avatar, no enviamos el campo para evitar payloads innecesarios
      if (!payload.avatar) delete payload.avatar;

      console.log('Registrando usuario:', payload.name, payload.role);

      const resp = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      console.log('Respuesta del servidor:', resp.status, data);

      if (resp.ok) {
        setShowModal(false);
        setAvatarPreview(null);
        setFormData({ name: '', username: '', email: '', password: '1234', phone: '', avatar: '', role: 'Vendedor' });
        await fetchUsers();
        console.log('Usuario registrado y lista actualizada');
      } else {
        alert('Error al registrar: ' + (data.error || JSON.stringify(data)));
      }
    } catch (e) {
      console.error('Error de red:', e);
      alert('Error de conexión: ' + e.message);
    }
  };

  const roleStyles = {
    'Administrador Master': { bg: '#1a2e23', color: '#a7f3d0' },
    'Administrador': { bg: '#1e3a8a', color: '#bfdbfe' },
    'Vendedor': { bg: '#374151', color: '#d1fae5' },
    'vendedor': { bg: '#374151', color: '#d1fae5' },
  };

  return (
    <div className="module-container">
      {/* Header */}
      <div className="module-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button className="btn-secondary" onClick={onBack} style={{ width: 'fit-content', marginBottom: '8px' }}>← Volver</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #1a2e23, #2d5a3f)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Gestión de Personal</h2>
              <p style={{ color: '#64748b', margin: 0 }}>{users.length} miembro{users.length !== 1 ? 's' : ''} en el equipo</p>
            </div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ background: '#2d5a3f', borderRadius: '14px', padding: '12px 24px', fontSize: '0.95rem' }}>
          + Nuevo Miembro
        </button>
      </div>

      {/* Tarjetas de usuarios */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {users.map(u => {
          const rs = roleStyles[u.role] || roleStyles['vendedor'];
          return (
            <div key={u.id} className="module-card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
            >
              {/* Banner superior */}
              <div style={{ height: '72px', background: 'linear-gradient(135deg, #1a2e23 0%, #2d5a3f 100%)' }} />

              {/* Avatar */}
              <div style={{ padding: '0 24px', marginTop: '-36px', position: 'relative' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '4px solid white', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  {u.avatar
                    ? <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2d5a3f' }}>{u.name?.charAt(0).toUpperCase()}</span>
                  }
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '12px 24px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 2px', color: '#1e293b' }}>{u.name}</h3>
                    {u.username && <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>@{u.username}</p>}
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800, background: rs.bg, color: rs.color, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    {u.role}
                  </span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                    <Mail size={14} color="#94a3b8" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                  </div>
                  {u.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                      <Phone size={14} color="#94a3b8" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem' }}>
                    <Calendar size={14} color="#cbd5e1" />
                    <span>Ingresó el {new Date(u.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Nuevo Miembro del Equipo</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleRegister}>
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
                  <label>Contraseña Inicial</label>
                  <input type="text" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="search-input" style={{ width: '100%' }} />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select className="select-input" style={{ width: '100%' }} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="Vendedor">Vendedor</option>
                    {user?.role === 'Administrador Master' && <option value="Administrador">Administrador</option>}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#2d5a3f', borderRadius: '12px', padding: '14px' }}>
                  ✓ Registrar Miembro
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


function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('Dashboard');
  const [cart, setCart] = useState([]);

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

      setSellers(v);
      setCarteraList(c);
      setBackorders(b);
      setActivities(a);
      setProspects(p);
      setProducts(pr);
    } catch (err) { console.error('Error sincronizando datos globales:', err); }
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
    // 1. Filtrar los productos originales de este folio
    const items = backorders.filter(it => (it.documento || `PED-${it.id}`) === order.documento);

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

  if (!user) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }


  const renderView = () => {
    switch (view) {
      case 'Dashboard': return <MainDashboard user={user} setView={setView} prospects={prospects} carteraList={carteraList} backorders={backorders} />;
      case 'Backorders': return <BackordersModule
        onBack={() => setView('Dashboard')}
        user={user}
        refreshAllData={refreshAllData}
        onEditOrder={handleEditOrder}
      />;
      case 'Inventario': return <CotizadorModule onBack={() => setView('Dashboard')} onNavigate={setView} products={products} setProducts={setProducts} refreshAllData={refreshAllData} />;
      case 'KPIs': return <KpisModule onBack={() => setView('Dashboard')} sellers={sellers} setSellers={setSellers} refreshSellers={refreshAllData} prospects={prospects} backorders={backorders} carteraList={carteraList} user={user} />;
      case 'Ventas': return <VentasModule onBack={() => setView('Dashboard')} onNavigate={setView} setQuotingProspect={setQuotingProspect} user={user} backorders={backorders} carteraList={carteraList} prospects={prospects} refreshData={refreshAllData} />;
      case 'Prospectos': return <ProspectosModule onBack={() => setView('Dashboard')} prospects={prospects} setProspects={setProspects} refreshProspects={refreshAllData} />;
      case 'Cartera': return <CarteraModule onBack={() => setView('Dashboard')} carteraList={carteraList} setCarteraList={setCarteraList} refreshCartera={refreshAllData} />;
      case 'Reportes': return <ReportesModule onBack={() => setView('Dashboard')} sellers={sellers} carteraList={carteraList} backorders={backorders} activities={activities} prospects={prospects} />;
      case 'Cotizador': return <ProductosModule
        onBack={() => setView('Dashboard')}
        onNavigate={setView}
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
      />;
      case 'Personal': return <PersonalModule onBack={() => setView('Dashboard')} user={user} />;
      case 'Sistema': return <SistemaModule onBack={() => setView('Dashboard')} />;
      default: return <MainDashboard user={user} setView={setView} />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ color: '#4CAF50' }}>
            <LayoutGrid size={32} />
          </div>
          <h1>AgriFlow</h1>
        </div>

        <nav className="sidebar-nav">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === 'Dashboard'} onClick={() => setView('Dashboard')} />
          <SidebarItem icon={Package} label="Backorders" active={view === 'Backorders'} onClick={() => setView('Backorders')} />

          {/* Módulos condicionales por Rol */}
          <SidebarItem icon={Package} label="Cotizador" active={view === 'Cotizador'} onClick={() => setView('Cotizador')} />

          {user?.role !== 'Vendedor' && user?.role !== 'vendedor' && (
            <SidebarItem icon={FileText} label="Inventario" active={view === 'Inventario'} onClick={() => setView('Inventario')} />
          )}

          <SidebarItem icon={TrendingUp} label="KPIs" active={view === 'KPIs' || view === 'Ventas'} onClick={() => setView('KPIs')} />

          <SidebarItem icon={DollarSign} label="Ventas" active={view === 'Ventas'} onClick={() => setView('Ventas')} />
          <SidebarItem icon={Users} label="Prospectos" active={view === 'Prospectos'} onClick={() => setView('Prospectos')} />
          <SidebarItem icon={DollarSign} label="Cartera" active={view === 'Cartera'} onClick={() => setView('Cartera')} />

          {user?.role !== 'Vendedor' && user?.role !== 'vendedor' && (
            <SidebarItem icon={BarChart2} label="Reportes" active={view === 'Reportes'} onClick={() => setView('Reportes')} />
          )}

          {/* Gestión de Personal (Solo Master y Admin) */}
          {user?.role !== 'Vendedor' && user?.role !== 'vendedor' && (
            <SidebarItem icon={Users} label="Personal" active={view === 'Personal'} onClick={() => setView('Personal')} />
          )}

          {/* Revisar Sistema (Solo Administrador Master) */}
          {user?.role === 'Administrador Master' && (
            <SidebarItem icon={ShieldAlert} label="Sistema" active={view === 'Sistema'} onClick={() => setView('Sistema')} />
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{user.name.charAt(0)}</div>
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
      <div className="module-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button className="btn-secondary" onClick={onBack} style={{ width: 'fit-content', marginBottom: '8px' }}>← Volver</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #1a2e23, #2d5a3f)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={22} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Supervisión del Sistema</h2>
              <p style={{ color: '#64748b', margin: 0 }}>Panel exclusivo del Administrador Master</p>
            </div>
          </div>
        </div>

        {/* Resumen rápido de alertas */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ padding: '12px 20px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>{errorCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>ERRORES</div>
          </div>
          <div style={{ padding: '12px 20px', background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309' }}>{warnCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>ALERTAS</div>
          </div>
          <div style={{ padding: '12px 20px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>{errorCount === 0 ? '✓' : '!'}</div>
            <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>ESTADO</div>
          </div>
        </div>
      </div>

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

export default App;

