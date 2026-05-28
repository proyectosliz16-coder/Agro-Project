import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Download,
  X
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

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@agriflow.com') {
      onLogin({ email: 'admin@agriflow.com', name: 'Admin', role: 'admin' });
    } else if (email === 'vendedor@agriflow.com') {
      onLogin({ email: 'vendedor@agriflow.com', name: 'Edgar Leyton', role: 'vendedor' });
    } else {
      alert('Credenciales no válidas. Prueba con las credenciales de prueba de abajo.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>AgriFlow Pro</h1>
        <p>Sistema integrado de gestión comercial para empresas agrícolas. Controla backorders, cotizaciones, ventas y cartera desde un solo lugar.</p>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar sesión</h2>
          <p className="subtitle">Ingresa tus credenciales para acceder</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Iniciar sesión</button>
          </form>

          <div className="login-footer">
            <p>Credenciales de prueba:</p>
            <div className="credential">
              <strong>Admin:</strong> admin@agriflow.com
            </div>
            <div className="credential">
              <strong>Vendedor:</strong> vendedor@agriflow.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
function BackordersModule({ onBack, user }) {
  const [backorders, setBackorders] = useState([
    { id: 1, cliente: 'AGRICOLA ZARATTINI', vendedor: 'Edgar Leyton', producto: 'ECLIPSE LD 20KG', documento: 'PED-2024-001', cantidad: 150, pendiente: 0, estado: 'Completado', prioridad: '52 días' },
    { id: 2, cliente: 'AGRICOLA ZARATTINI', vendedor: 'Oficina Celaya', producto: 'TUERAS RECTAS', documento: 'PED-2024-002', cantidad: 200, pendiente: 50, estado: 'Parcial', prioridad: '42 días' },
    { id: 3, cliente: 'GENARO TREJO', vendedor: 'Magdalena Dominguez', producto: 'SUSTRATO 250L', documento: 'PED-2024-003', cantidad: 50, pendiente: 8, estado: 'Parcial', prioridad: '37 días' },
    { id: 4, cliente: 'AGRICOLA ZARATTINI', vendedor: 'Edgar Leyton', producto: 'ECLIPSE LD 20KG', documento: 'PED-2024-004', cantidad: 150, pendiente: 112, estado: 'En Proceso', prioridad: '52 días' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    pendiente: 0,
    estado: ''
  });

  const handleEditClick = (order) => {
    setEditingId(order.id);
    setEditForm({
      pendiente: order.pendiente,
      estado: order.estado
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleSaveClick = (id) => {
    setBackorders(backorders.map(order => {
      if (order.id === id) {
        return {
          ...order,
          pendiente: parseInt(editForm.pendiente),
          estado: editForm.estado
        };
      }
      return order;
    }));
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  return (
    <div className="module-container">
      <ViewHeader title="Backorders" onBack={onBack} />
      <div className="module-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Backorders</h2>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>Gestión de pedidos pendientes</p>
      </div>

      <div className="module-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr 180px', gap: '20px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem', marginBottom: '8px', color: '#64748b' }}>Cliente</label>
            <input type="text" placeholder="Buscar cliente..." className="search-input" style={{ width: '100%' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem', marginBottom: '8px', color: '#64748b' }}>Producto</label>
            <input type="text" placeholder="Buscar producto..." className="search-input" style={{ width: '100%' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem', marginBottom: '8px', color: '#64748b' }}>Estado</label>
            <select className="select-input" style={{ width: '100%' }}>
              <option>Todos</option>
              <option>Completado</option>
              <option>Parcial</option>
              <option>En Proceso</option>
            </select>
          </div>
          <button className="btn-primary" style={{ height: '42px', justifyContent: 'center', background: '#2d5a3f' }}>
            <LayoutGrid size={18} style={{ marginRight: '8px' }} /> Filtrar
          </button>
        </div>
      </div>

      <div className="module-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>CLIENTE</th>
                {user?.role === 'vendedor' && <th>VENDEDOR</th>}
                <th>PRODUCTO</th>
                <th>DOCUMENTO</th>
                <th>CANTIDAD</th>
                <th>PENDIENTE</th>
                <th>ESTADO</th>
                <th>PRIORIDAD</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {backorders.map(bo => (
                <tr key={bo.id}>
                  <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{bo.cliente}</td>
                  {user?.role === 'vendedor' && <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{bo.vendedor}</td>}
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{bo.producto}</td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{bo.documento}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{bo.cantidad}</td>
                  <td style={{ textAlign: 'center' }}>
                    {editingId === bo.id ? (
                      <input
                        type="number"
                        name="pendiente"
                        value={editForm.pendiente}
                        onChange={handleInputChange}
                        style={{ width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'center' }}
                      />
                    ) : (
                      <span style={{ color: bo.pendiente > 0 ? '#f59e0b' : '#64748b', fontWeight: 700 }}>{bo.pendiente}</span>
                    )}
                  </td>
                  <td>
                    {editingId === bo.id ? (
                      <select
                        name="estado"
                        value={editForm.estado}
                        onChange={handleInputChange}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="Completado">Completado</option>
                        <option value="Parcial">Parcial</option>
                        <option value="En Proceso">En Proceso</option>
                      </select>
                    ) : (
                      <span className={`badge ${bo.estado === 'Completado' ? 'badge-success' : bo.estado === 'Parcial' ? 'badge-partial' : 'badge-process'}`}>
                        {bo.estado}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 500 }}>{bo.prioridad}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {editingId === bo.id ? (
                        <>
                          <button
                            onClick={() => handleSaveClick(bo.id)}
                            style={{ border: 'none', background: 'none', color: '#10b981', cursor: 'pointer', padding: '4px' }}
                            title="Guardar"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button
                            onClick={handleCancelClick}
                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Cancelar"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditClick(bo)}
                          style={{ border: 'none', background: 'none', color: '#2d5a3f', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                          title="Editar"
                        >
                          <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '6px' }}>
                            <Pencil size={16} />
                          </div>
                          Atualizar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 2. Módulo Inventario (Antes Cotizador)
function CotizadorModule({ onBack, onNavigate, products, setProducts }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    category: 'Materiales',
    quantity: '',
    cost: '',
    margin: '',
    price: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedProducts = products.map(p =>
        p.id === editingId
          ? {
            ...p,
            ...formData,
            quantity: parseInt(formData.quantity) || 0,
            cost: parseFloat(formData.cost) || 0,
            margin: parseFloat(formData.margin) || 0,
            price: parseFloat(formData.price) || 0
          }
          : p
      );
      setProducts(updatedProducts);
      setEditingId(null);
    } else {
      const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        cost: parseFloat(formData.cost) || 0,
        margin: parseFloat(formData.margin) || 0,
        price: parseFloat(formData.price) || 0
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
    setFormData({ name: '', desc: '', category: 'Materiales', quantity: '', cost: '', margin: '', price: '' });
  };

  const deleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      desc: product.desc,
      category: product.category || 'Materiales',
      quantity: product.quantity,
      cost: product.cost,
      margin: product.margin,
      price: product.price
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
              setFormData({ name: '', desc: '', category: 'Materiales', quantity: '', cost: '', margin: '', price: '' });
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
                          <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{p.desc || 'Sin descripción'}</span>
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
function VentasModule({ onBack }) {
  const sellers = [
    { name: 'Edgar Leyton', email: 'edgar@agriflow.com', sales: 271218, budget: 3283322, progress: 8, cartera: [180500, 45000, 22000, 10000] },
    { name: 'Oficina Celaya', email: 'celaya@agriflow.com', sales: 342156, budget: 2800000, progress: 12, cartera: [210000, 55000, 30000, 15000] },
    { name: 'Magdalena Dominguez', email: 'magdalena@agriflow.com', sales: 198450, budget: 2500000, progress: 8, cartera: [150000, 38000, 18000, 8000] },
    { name: 'Cecilia Granillo', email: 'cecilia@agriflow.com', sales: 156789, budget: 2200000, progress: 7, cartera: [120000, 30000, 15000, 7000] },
  ];

  return (
    <div className="module-container">
      <ViewHeader title="Ventas" onBack={onBack} />
      <div className="module-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Ventas</h2>
        <p style={{ color: '#64748b' }}>Panel de rendimiento por vendedor</p>
      </div>

      <div className="module-card">
        <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Ventas vs Presupuesto 2025</h3>
        <div style={{ height: '300px', width: '100%', borderBottom: '1px solid #e2e8f0', borderLeft: '1px solid #e2e8f0', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 20px', gap: '8px', overflow: 'hidden' }}>
          {/* Mock Chart Gridlines */}
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ position: 'absolute', width: '100%', height: '1px', background: '#f1f5f9', bottom: `${i * 25}%`, left: 0 }}>
              <span style={{ position: 'absolute', left: '-50px', fontSize: '0.7rem', color: '#94a3b8' }}>{i === 4 ? '700000' : i === 3 ? '550000' : i === 2 ? '400000' : i === 1 ? '350000' : '0'}</span>
            </div>
          ))}

          {/* Bars */}
          {sellers.map((s, idx) => (
            <React.Fragment key={idx}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px' }}>
                <div style={{ width: '22px', height: '90%', background: '#1e3a8a', borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: '22px', height: `${s.progress * 5}%`, background: '#365314', borderRadius: '2px 2px 0 0' }}></div>
              </div>
              {/* Extra spacing bars like in the image to fill the chart */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px' }}>
                <div style={{ width: '22px', height: '75%', background: '#1e3a8a', borderRadius: '2px 2px 0 0' }}></div>
                <div style={{ width: '22px', height: '15%', background: '#365314', borderRadius: '2px 2px 0 0' }}></div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12px', paddingLeft: '20px' }}>
          {sellers.map((s, idx) => (
            <span key={idx} style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>{s.name.split(' ')[0]}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#1e3a8a' }}></div>
            <span style={{ fontSize: '0.8rem' }}>Presupuesto</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#365314' }}></div>
            <span style={{ fontSize: '0.8rem' }}>Ventas</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        {sellers.map((s, idx) => (
          <div key={idx} className="module-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{s.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.email}</p>
              </div>
              <div style={{ width: '32px', height: '32px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} color="#22c55e" />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Progreso</span>
                <strong>{s.progress}%</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                <div style={{ width: `${s.progress}%`, height: '100%', background: '#4CAF50', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Ventas YTD</p>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>${s.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Presupuesto</p>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>${s.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <DollarSign size={16} color="#94a3b8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Cartera Vencida</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                {['1-30d', '31-60d', '61-90d', '+90d'].map((period, pIdx) => (
                  <div key={period}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>${s.cartera[pIdx].toLocaleString()}</p>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Módulo Comercial
function ComercialModule({ onBack }) {
  const [activitiesList, setActivitiesList] = useState(() => {
    try {
      const saved = localStorage.getItem('agro_activities');
      return saved ? JSON.parse(saved) : [
        { id: 1, type: 'MessageSquare', client: 'AGRICOLA ZARATTINI', description: 'Envío de cotización #32789d97', date: '2026-01-15', time: '19:32', status: 'Completada' }
      ];
    } catch (e) {
      console.error('Error parsing activities:', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('agro_activities', JSON.stringify(activitiesList));
  }, [activitiesList]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Phone',
    client: '',
    description: '',
    date: '',
    time: ''
  });

  const activityTypes = [
    { icon: Phone, label: 'Call', name: 'Phone', color: '#eff6ff', iconColor: '#3b82f6' },
    { icon: Mail, label: 'Email', name: 'Mail', color: '#f5f3ff', iconColor: '#8b5cf6' },
    { icon: MessageSquare, label: 'Whatsapp', name: 'MessageSquare', color: '#f0fdf4', iconColor: '#22c55e' },
    { icon: Users, label: 'Visit', name: 'Users', color: '#fff7ed', iconColor: '#f97316' },
    { icon: Calendar, label: 'Meeting', name: 'Calendar', color: '#fdf2f8', iconColor: '#db2777' },
  ];

  const getIcon = (typeName) => {
    const type = activityTypes.find(t => t.name === typeName) || activityTypes[0];
    return type.icon;
  };

  const activityCounts = activityTypes.map(type => ({
    ...type,
    count: activitiesList.filter(a => a.type === type.name).length
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newActivity = {
      id: activitiesList.length + 1,
      ...formData,
      status: 'Pendiente'
    };
    setActivitiesList([newActivity, ...activitiesList]);
    setShowForm(false);
    setFormData({ type: 'Phone', client: '', description: '', date: '', time: '' });
  };

  return (
    <div className="module-container">
      <ViewHeader title="Comercial" onBack={onBack} />
      <div className="module-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Gestión Comercial</h2>
          <p style={{ color: '#64748b' }}>Calendario de actividades y seguimiento</p>
        </div>
        {!showForm && (
          <button
            className="btn-primary"
            style={{ background: '#2d5a3f' }}
            onClick={() => setShowForm(true)}
          >
            + Nueva Actividad
          </button>
        )}
      </div>

      {showForm ? (
        <div className="module-card">
          <h3 style={{ marginBottom: '20px' }}>Nueva Actividad</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
            <div className="form-group">
              <label>Tipo de Actividad</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="select-input" style={{ width: '100%' }}>
                {activityTypes.map(type => (
                  <option key={type.name} value={type.name}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cliente / Prospecto</label>
              <input type="text" name="client" value={formData.client} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="search-input" style={{ width: '100%', minHeight: '80px', fontFamily: 'inherit' }} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
              </div>
              <div className="form-group">
                <label>Hora</label>
                <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="search-input" style={{ width: '100%' }} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ background: '#2d5a3f' }}>Guardar Actividad</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {activityCounts.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="module-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', gap: '8px' }}>
                  <div style={{ width: '40px', height: '40px', background: act.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={act.iconColor} />
                  </div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{act.count}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{act.label}</span>
                </div>
              );
            })}
          </div>

          <div className="module-card" style={{ padding: 0, overflow: 'hidden' }}>
            {activitiesList.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No hay actividades registradas.</div>
            ) : (
              // Group by date logic could go here, for now just listing simple or handling the first date group for demo
              <>
                <div style={{ background: '#2d5a3f', color: 'white', padding: '12px 24px', fontWeight: 700 }}>
                  Actividades Recientes
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activitiesList.map((notif) => {
                    const Icon = getIcon(notif.type);
                    return (
                      <div key={notif.id} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={24} color="#22c55e" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{notif.type} - {notif.client}</h4>
                            <span className={`badge ${notif.status === 'Completada' ? 'badge-success' : 'badge-process'}`} style={{ fontWeight: 500, fontSize: '0.75rem' }}>{notif.status}</span>
                          </div>
                          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 500 }}>{notif.description}</p>
                          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', color: '#94a3b8', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Users size={14} /> <span>Edgar Leyton</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={14} /> <span>{notif.date} {notif.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 5. Módulo de Prospectos
function ProspectosModule({ onBack }) {
  const [prospects, setProspects] = useState(() => {
    try {
      const saved = localStorage.getItem('agro_prospects');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          name: 'Agricola San Juan',
          phone: '5512345678',
          email: 'contacto@sanjuan.com',
          interest: 'Fertilizantes - 50 Tons',
          location: 'Celaya, GTO',
          budget: 500000,
          stage: 'Contacto'
        }
      ];
    } catch (e) {
      console.error('Error parsing prospects:', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('agro_prospects', JSON.stringify(prospects));
  }, [prospects]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: '',
    location: '',
    budget: '',
    stage: 'Contacto'
  });

  const stages = [
    { label: 'Contacto', count: prospects.filter(p => p.stage === 'Contacto').length },
    { label: 'Evaluación', count: prospects.filter(p => p.stage === 'Evaluación').length },
    { label: 'Negociación', count: prospects.filter(p => p.stage === 'Negociación').length },
    { label: 'Ganado', count: prospects.filter(p => p.stage === 'Ganado').length },
    { label: 'Perdido', count: prospects.filter(p => p.stage === 'Perdido').length },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProspect = {
      id: prospects.length + 1,
      ...formData,
      budget: parseFloat(formData.budget) || 0
    };
    setProspects([...prospects, newProspect]);
    setShowForm(false);
    setFormData({ name: '', phone: '', email: '', interest: '', location: '', budget: '', stage: 'Contacto' });
  };

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
          <h3 style={{ marginBottom: '20px' }}>Nuevo Prospecto</h3>
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
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ background: '#2d5a3f' }}>Guardar Prospecto</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Stages Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {stages.map((stage, idx) => (
              <div key={idx} className="module-card" style={{ textAlign: 'center', padding: '16px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{stage.count}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{stage.label}</span>
              </div>
            ))}
          </div>

          {/* Prospect List / Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {prospects.map((prospect) => (
              <div key={prospect.id} className="module-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{prospect.name}</h3>
                  <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem' }}>{prospect.stage}</span>
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
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2d5a3f' }}>${prospect.budget.toLocaleString()}</h4>
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
function CarteraModule({ onBack }) {
  const summary = [
    { label: '1-30 días', amount: '$2,121,000.00', color: '#facc15' },
    { label: '31-60 días', amount: '$542,000.00', color: '#f97316' },
    { label: '61-90 días', amount: '$272,000.00', color: '#f87171' },
    { label: '+90 días', amount: '$116,000.00', color: '#ef4444' },
  ];

  const sellersDebt = [
    { name: 'Edgar Leyton', m1: 180500, m2: 45000, m3: 22000, m4: 10000, total: 257500 },
    { name: 'Oficina Celaya', m1: 210000, m2: 55000, m3: 30000, m4: 15000, total: 310000 },
    { name: 'Magdalena Dominguez', m1: 150000, m2: 38000, m3: 18000, m4: 8000, total: 214000 },
    { name: 'Cecilia Granillo', m1: 120000, m2: 30000, m3: 15000, m4: 5000, total: 170000 },
    { name: 'Gabriel Jimenez', m1: 140000, m2: 35000, m3: 17000, m4: 7000, total: 199000 },
  ];

  return (
    <div className="module-container">
      <ViewHeader title="Cartera" onBack={onBack} />
      <div className="module-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Cartera Vencida</h2>
        <p style={{ color: '#64748b' }}>Monitoreo de cuentas por cobrar</p>
      </div>

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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '240px' }}>
            {/* Visual Pie Chart Simulation */}
            <svg viewBox="0 0 36 36" style={{ width: '220px', height: '220px', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="16" fill="transparent" stroke="#fef9c3" strokeWidth="4" strokeDasharray="70 100" />
              <circle cx="18" cy="18" r="16" fill="transparent" stroke="#ffedd5" strokeWidth="4" strokeDasharray="18 100" strokeDashoffset="-70" />
              <circle cx="18" cy="18" r="16" fill="transparent" stroke="#fee2e2" strokeWidth="4" strokeDasharray="9 100" strokeDashoffset="-88" />
              <circle cx="18" cy="18" r="16" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="4 100" strokeDashoffset="-97" />
            </svg>
            <div style={{ position: 'absolute', top: '20%', left: '15%', fontSize: '0.85rem', color: '#fde047', fontWeight: 600 }}>1-30 días: 70%</div>
            <div style={{ position: 'absolute', bottom: '15%', left: '50%', fontSize: '0.85rem', color: '#fdba74', fontWeight: 600 }}>31-60 días: 18%</div>
            <div style={{ position: 'absolute', bottom: '40%', right: '5%', fontSize: '0.85rem', color: '#fca5a5', fontWeight: 600 }}>61-90 días: 9%</div>
            <div style={{ position: 'absolute', top: '45%', right: '0%', fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>+90 días: 4%</div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="module-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <AlertCircle size={20} color="#f97316" />
            <h3 style={{ fontSize: '1.1rem' }}>Alertas de Cobranza</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#fef2f2', border: '1.5px solid #fee2e2', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ color: '#991b1b', fontSize: '0.9rem', marginBottom: '4px' }}>Cartera crítica +90 días</h4>
              <p style={{ color: '#b91c1c', fontSize: '0.8rem' }}>$116,000.00 requiere acción inmediata</p>
            </div>
            <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ color: '#854d0e', fontSize: '0.9rem', marginBottom: '4px' }}>Cartera en riesgo 61-90 días</h4>
              <p style={{ color: '#a16207', fontSize: '0.8rem' }}>$272,000.00 debe ser monitoreada</p>
            </div>
            <div style={{ background: '#fffbeb', border: '1.5px solid #fef3c7', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ color: '#854d0e', fontSize: '0.9rem', marginBottom: '4px' }}>Cartera reciente elevada</h4>
              <p style={{ color: '#a16207', fontSize: '0.8rem' }}>$2,121,000.00 en periodo 1-30 días</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Section */}
      <div className="module-card" style={{ textAlign: 'center', padding: '32px', marginBottom: '24px' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Total Cartera Vencida</p>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a2e21' }}>$3,051,000.00</h2>
      </div>

      {/* Detailed Table Card */}
      <div className="module-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Cartera por Vendedor</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>VENDEDOR</th>
                <th style={{ textAlign: 'right' }}>1-30 DÍAS</th>
                <th style={{ textAlign: 'right' }}>31-60 DÍAS</th>
                <th style={{ textAlign: 'right' }}>61-90 DÍAS</th>
                <th style={{ textAlign: 'right' }}>+90 DÍAS</th>
                <th style={{ textAlign: 'right' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {sellersDebt.map((debt, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{debt.name}</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>${debt.m1.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>${debt.m2.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>${debt.m3.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right', color: '#ef4444' }}>${debt.m4.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#1a2e21' }}>${debt.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 7. Módulo de Reportes
function ReportesModule({ onBack }) {
  const reports = [
    { title: 'Backorders por Cliente', desc: 'Resumen de pedidos pendientes agrupados por cliente' },
    { title: 'Backorders por Producto', desc: 'Productos con mayor demanda pendiente' },
    { title: 'Ventas vs Presupuesto', desc: 'Comparativo de ventas reales contra presupuesto por vendedor' },
    { title: 'Tasa de Conversión', desc: 'Cotizaciones enviadas vs ventas cerradas' },
    { title: 'Cartera por Antigüedad', desc: 'Detalle de cuentas por cobrar segmentadas por rangos' },
    { title: 'Efectividad Comercial', desc: 'Análisis de actividades comerciales y resultados' },
  ];

  return (
    <div className="module-container">
      <ViewHeader title="Reportes" onBack={onBack} />
      <div className="module-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Reportes</h2>
        <p style={{ color: '#64748b' }}>Exporta información detallada de tus operaciones</p>
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
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
                  <Download size={16} /> PDF
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
                  <Download size={16} /> Excel
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Módulo de Productos
function ProductosModule({ onBack, onNavigate, cart, addToCart, removeFromCart, products, setProducts }) {
  const cartTotal = cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);

  const handleFinalizeQuote = () => {
    if (cart.length === 0) return;
    onNavigate('Cotizador'); // Navigate to Cotizador module
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
      <ViewHeader title="Cotizador" onBack={onBack} />
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
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.desc}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{p.category || 'N/A'}</span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.quantity}</td>
                      <td style={{ textAlign: 'right', color: '#64748b' }}>${p.cost?.toFixed(2)}</td>
                      <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{p.margin}%</td>
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
        <div className="module-card" style={{ padding: '20px', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Carrito</h3>
            <Package size={20} color="#2d5a3f" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '200px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px', fontStyle: 'italic' }}>
                Tu carrito está vacío
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.qty || 1} x ${item.price?.toFixed(2)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700 }}>${((item.qty || 1) * item.price).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                    >
                      <LogOut size={14} />
                    </button>
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
              style={{ width: '100%', justifyContent: 'center', background: '#2d5a3f' }}
              onClick={handleFinalizeQuote}
              disabled={cart.length === 0}
            >
              Finalizar Cotización
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainDashboard({ user, setView }) {
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
        <StatCard icon={Package} label="Backorders Activos" value="378" subtext="5 órdenes" iconClass="icon-orange" />
        <StatCard icon={TrendingUp} label="Ventas del Mes" value="$2,916,108.00" subtext="Acumulado 2025" iconClass="icon-green" />
        <StatCard icon={FileText} label="Cotizaciones Pendientes" value="0" subtext="Por revisar" iconClass="icon-blue" />
        <StatCard icon={DollarSign} label="Cartera Vencida" value="$3,051,000.00" subtext="Total por cobrar" iconClass="icon-pink" />
        <StatCard icon={Users} label="Prospectos Activos" value="9" subtext="En proceso" iconClass="icon-green" />
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

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('Dashboard');
  const [cart, setCart] = useState([]);

  // Centralized Products State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: 'ECLIPSE LD 20KG', desc: 'Fertilizante granulado', category: 'Insumos', quantity: 50, cost: 800, margin: 50, price: 1200 },
      { id: 2, name: 'TUERCAS RECTAS', desc: 'Acero inoxidable 1/2"', category: 'Materiales', quantity: 200, cost: 25, margin: 100, price: 50 },
      { id: 3, name: 'PEGAMENTO PLÁSTICO', desc: 'Adhesivo industrial', category: 'Insumos', quantity: 29, cost: 250, margin: 20, price: 300 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

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

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setView('Dashboard');
    setCart([]);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const renderView = () => {
    switch (view) {
      case 'Dashboard': return <MainDashboard user={user} setView={setView} />;
      case 'Backorders': return <BackordersModule onBack={() => setView('Dashboard')} user={user} />;
      case 'Inventario': return <CotizadorModule onBack={() => setView('Dashboard')} onNavigate={setView} products={products} setProducts={setProducts} />;
      case 'Ventas': return <VentasModule onBack={() => setView('Dashboard')} />;
      case 'Comercial': return <ComercialModule onBack={() => setView('Dashboard')} />;
      case 'Prospectos': return <ProspectosModule onBack={() => setView('Dashboard')} />;
      case 'Cartera': return <CarteraModule onBack={() => setView('Dashboard')} />;
      case 'Reportes': return <ReportesModule onBack={() => setView('Dashboard')} />;
      case 'Cotizador': return <ProductosModule onBack={() => setView('Dashboard')} onNavigate={setView} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} products={products} setProducts={setProducts} />;
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
          <SidebarItem icon={Package} label="Cotizador" active={view === 'Cotizador'} onClick={() => setView('Cotizador')} />
          <SidebarItem icon={FileText} label="Inventario" active={view === 'Inventario'} onClick={() => setView('Inventario')} />
          {user?.role !== 'vendedor' && (
            <SidebarItem icon={TrendingUp} label="Ventas" active={view === 'Ventas'} onClick={() => setView('Ventas')} />
          )}
          <SidebarItem icon={Calendar} label="Comercial" active={view === 'Comercial'} onClick={() => setView('Comercial')} />
          <SidebarItem icon={Users} label="Prospectos" active={view === 'Prospectos'} onClick={() => setView('Prospectos')} />
          <SidebarItem icon={DollarSign} label="Cartera" active={view === 'Cartera'} onClick={() => setView('Cartera')} />
          {user?.role !== 'vendedor' && (
            <SidebarItem icon={BarChart2} label="Reportes" active={view === 'Reportes'} onClick={() => setView('Reportes')} />
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
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


export default App;
