function PersonalModule({ onBack, user, prospects = [] }) {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos los roles');
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '1234', phone: '', avatar: '', role: 'Vendedor', status: 'Activo'
  });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Cartera Asignada');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
      if (selectedUser) {
        const updated = data.find(u => u.id === selectedUser.id);
        if (updated) setSelectedUser(updated);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(u => {
    const searchString = searchTerm.toLowerCase();
    const matchSearch = (u.name || '').toLowerCase().includes(searchString) ||
      (u.username || '').toLowerCase().includes(searchString) ||
      (u.email || '').toLowerCase().includes(searchString);
    const matchRole = roleFilter === 'Todos los roles' || (u.role && u.role.toLowerCase() === roleFilter.toLowerCase());
    return matchSearch && matchRole;
  });

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
        setFormData({ name: '', username: '', email: '', password: '1234', phone: '', avatar: '', role: 'Vendedor', status: 'Activo' });
        await fetchUsers();
      } else {
        alert(`Error al ${editingUserId ? 'actualizar' : 'registrar'}: ` + (data.error || JSON.stringify(data)));
      }
    } catch (e) {
      console.error('Error de red:', e);
      alert('Error de conexión: ' + e.message);
    }
  };

  const handleDeactivate = async () => {
    if (!selectedUser) return;
    try {
      const resp = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Inactivo' })
      });
      if (resp.ok) {
        setShowDeactivateConfirm(false);
        await fetchUsers();
      } else {
        alert('Error al dar de baja');
      }
    } catch (e) {
      alert('Error de red al dar de baja');
    }
  };

  const handleTransfer = async () => {
    if (!selectedUser || !transferTarget) return;
    try {
      const resp = await fetch('/api/users/transfer-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromVendedor: selectedUser.name, toVendedor: transferTarget })
      });
      if (resp.ok) {
        setShowTransferModal(false);
        setTransferTarget('');
        alert('Cartera transferida exitosamente. Por favor recarga la página principal si quieres ver los prospectos actualizados globalmente.');
      } else {
        alert('Error al transferir cartera');
      }
    } catch (e) {
      alert('Error de red al transferir cartera');
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
      role: u.role || 'Vendedor',
      status: u.status || 'Activo'
    });
    setAvatarPreview(u.avatar || null);
    setShowModal(true);
  };

  const roleStyles = {
    'Administrador Master': { bg: '#1a2e23', color: '#a7f3d0', border: 'none' },
    'Administrador': { bg: 'transparent', color: '#3b82f6', border: '1px solid #bfdbfe' },
    'Vendedor': { bg: 'transparent', color: '#10b981', border: '1px solid #bbf7d0' },
    'vendedor': { bg: 'transparent', color: '#10b981', border: '1px solid #bbf7d0' },
  };

  const getUserProspects = (userName) => prospects.filter(p => p.vendedor === userName || p.seller === userName);
  
  const renderSidebar = () => {
    if (!selectedUser) {
      return (
        <div style={{ flex: '0 0 350px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          Selecciona un miembro para ver detalles
        </div>
      );
    }
    const isInactive = selectedUser.status === 'Inactivo';
    const userProspects = getUserProspects(selectedUser.name);
    const clients = userProspects.filter(p => p.isClient);
    const prospectsOnly = userProspects.filter(p => !p.isClient);
    const activeSellers = users.filter(u => u.status !== 'Inactivo' && u.id !== selectedUser.id && u.role.toLowerCase() === 'vendedor');

    return (
      <div style={{ flex: '0 0 380px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {selectedUser.avatar ? (
                <img src={selectedUser.avatar} alt={selectedUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{selectedUser.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>{selectedUser.name}</h3>
                {isInactive && <span style={{ background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 800 }}>Inactivo</span>}
              </div>
              <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, background: roleStyles[selectedUser.role]?.bg || '#f1f5f9', color: roleStyles[selectedUser.role]?.color || '#64748b', border: roleStyles[selectedUser.role]?.border }}>{selectedUser.role}</span>
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {selectedUser.email}</div>
                {selectedUser.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {selectedUser.phone}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> Ingresó el {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          {['Información', 'Cartera Asignada', 'Actividad', 'Historial'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '12px 0', border: 'none', background: 'none', fontSize: '0.8rem', fontWeight: activeTab === tab ? 800 : 600, color: activeTab === tab ? '#10b981' : '#64748b', borderBottom: activeTab === tab ? '2px solid #10b981' : '2px solid transparent', cursor: 'pointer' }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'Cartera Asignada' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0f172a', fontWeight: 700 }}>
                  <Users size={16} color="#10b981" /> Clientes asignados ({clients.length})
                </div>
                {clients.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '24px', color: '#475569', fontSize: '0.85rem' }}>
                    {clients.slice(0, 5).map(c => <li key={c.id} style={{ marginBottom: '4px' }}>{c.name}</li>)}
                    {clients.length > 5 && <li>... y {clients.length - 5} más</li>}
                  </ul>
                ) : <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No hay clientes asignados</span>}
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#0f172a', fontWeight: 700 }}>
                  <Filter size={16} color="#10b981" /> Prospectos asignados ({prospectsOnly.length})
                </div>
                {prospectsOnly.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '24px', color: '#475569', fontSize: '0.85rem' }}>
                    {prospectsOnly.slice(0, 5).map(c => <li key={c.id} style={{ marginBottom: '4px' }}>{c.name}</li>)}
                    {prospectsOnly.length > 5 && <li>... y {prospectsOnly.length - 5} más</li>}
                  </ul>
                ) : <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No hay prospectos asignados</span>}
              </div>

              {!isInactive && userProspects.length > 0 && (
                <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#0f172a', margin: '0 0 8px' }}>Transferir cartera</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 12px' }}>Transfiere los clientes y prospectos asignados a otro vendedor.</p>
                  <button onClick={() => setShowTransferModal(true)} style={{ width: '100%', background: '#fff', border: '1px solid #10b981', color: '#10b981', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <ArrowRight size={16} /> Transferir
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab === 'Información' && (
             <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Información general del usuario...</div>
          )}
          {(activeTab === 'Actividad' || activeTab === 'Historial') && (
             <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No hay datos para mostrar en esta pestaña por ahora.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="module-container" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <ViewHeader 
        title="Gestión de Personal" 
        subtitle="Administra los miembros de tu equipo, roles y carteras en la plataforma." 
        icon={Users} 
        onBack={onBack}
      >
        <button
          className="btn-primary"
          onClick={() => {
            setEditingUserId(null);
            setFormData({ name: '', username: '', email: '', password: '1234', phone: '', avatar: '', role: 'Vendedor', status: 'Activo' });
            setAvatarPreview(null);
            setShowModal(true);
          }}
          style={{ background: '#2d5a3f', borderRadius: '12px', padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(45, 90, 63, 0.2)' }}
        >
          <Plus size={18} /> Nuevo Miembro
        </button>
      </ViewHeader>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 40px 32px 40px', display: 'flex', gap: '24px', height: 'calc(100vh - 120px)' }}>
        
        {/* Main Content (Table) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Buscar miembros..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b', fontSize: '0.95rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 16px', gap: '8px', background: '#fff' }}>
                <Filter size={16} color="#10b981" />
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, border: 'none', outline: 'none', background: 'transparent' }}>
                  <option value="Todos los roles">Todos los roles</option>
                  <option value="Administrador Master">Administrador Master</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Vendedor">Vendedor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' }}>MIEMBRO</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' }}>ROL</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' }}>ESTADO</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' }}>FECHA DE INGRESO</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textAlign: 'right' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const isSelected = selectedUser?.id === u.id;
                  const isInactive = u.status === 'Inactivo';
                  return (
                    <tr key={u.id} onClick={() => setSelectedUser(u)} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: isSelected ? '#f0fdf4' : 'transparent', transition: 'background 0.2s' }} onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background = '#f8fafc' }} onMouseLeave={e => { if(!isSelected) e.currentTarget.style.background = 'transparent' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {u.avatar ? <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#64748b', fontWeight: 800 }}>{u.name?.charAt(0).toUpperCase()}</span>}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, background: roleStyles[u.role]?.bg || '#f1f5f9', color: roleStyles[u.role]?.color || '#64748b', border: roleStyles[u.role]?.border }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: isInactive ? '#ef4444' : '#10b981' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isInactive ? '#ef4444' : '#10b981' }} />
                          {isInactive ? 'Inactivo (Baja)' : 'Activo'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b' }}>
                        {new Date(u.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(u); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }} title="Editar">
                          <MoreVertical size={16} />
                        </button>
                        {/* Dropdown can go here if we want more actions */}
                        <div style={{ display: 'inline-flex', gap: '8px', marginLeft: '12px' }}>
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(u); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><Edit2 size={14} /></button>
                          {!isInactive && <button onClick={(e) => { e.stopPropagation(); setSelectedUser(u); setShowDeactivateConfirm(true); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Dar de baja"><Trash2 size={14} /></button>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        {renderSidebar()}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px', color: '#0f172a' }}>Transferir cartera de {selectedUser?.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Selecciona a qué vendedor se le asignarán los clientes, prospectos y cobranza activa.</p>
            <select value={transferTarget} onChange={e => setTransferTarget(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '24px', outline: 'none' }}>
              <option value="">Selecciona un vendedor...</option>
              {users.filter(u => u.status !== 'Inactivo' && u.id !== selectedUser?.id && u.role.toLowerCase() === 'vendedor').map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowTransferModal(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
              <button onClick={handleTransfer} className="btn-primary" disabled={!transferTarget} style={{ flex: 1, padding: '10px', background: transferTarget ? '#10b981' : '#94a3b8', border: 'none', color: '#fff', borderRadius: '8px', cursor: transferTarget ? 'pointer' : 'not-allowed' }}>Transferir</button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 12px', color: '#0f172a' }}>¿Dar de baja a {selectedUser?.name}?</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
              El usuario ya no podrá iniciar sesión en la plataforma. Sin embargo, su historial de ventas, pedidos y facturas se mantendrá intacto.<br/><br/>
              Si tiene prospectos o clientes, te sugerimos transferir su cartera a otro vendedor antes de darlo de baja.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeactivateConfirm(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancelar</button>
              <button onClick={handleDeactivate} style={{ flex: 1, padding: '10px', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Confirmar Baja</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro/Edición */}
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
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '3px dashed #cbd5e1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'border-color 0.2s' }}>
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Nombre Completo *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="search-input" style={{ width: '100%' }} required />
                </div>
                <div className="form-group">
                  <label>Nombre de Usuario <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span></label>
                  <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="search-input" style={{ width: '100%' }} />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="search-input" style={{ width: '100%' }} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Correo Electrónico *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="search-input" style={{ width: '100%' }} required />
                </div>
                <div className="form-group">
                  <label>{editingUserId ? 'Nueva Contraseña' : 'Contraseña Inicial'}</label>
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
