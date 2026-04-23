const fs = require('fs');

let code = fs.readFileSync('c:/Users/ameri/OneDrive/Documents/Estancia/Agro/src/App.jsx', 'utf8');

// 1. Add lucide icons
code = code.replace(
  /Settings\n\} from 'lucide-react';/,
  "Settings,\n  ClipboardList,\n  Clock,\n  AlertTriangle\n} from 'lucide-react';"
);

// 2. Add vars to KpisModule usage
code = code.replace(
  /case 'KPIs': return <KpisModule onBack=\{\(\) => setView\('Dashboard'\)\} sellers=\{sellers\} setSellers=\{setSellers\} refreshSellers=\{refreshAllData\} prospects=\{prospects\} user=\{user\} \/>;/,
  "case 'KPIs': return <KpisModule onBack={() => setView('Dashboard')} sellers={sellers} setSellers={setSellers} refreshSellers={refreshAllData} prospects={prospects} backorders={backorders} carteraList={carteraList} user={user} />;"
);

// 3. Add vars to KpisModule signature
code = code.replace(
  /function KpisModule\(\{ onBack, sellers, setSellers, refreshSellers, prospects, user \}\) \{/,
  "function KpisModule({ onBack, sellers, setSellers, refreshSellers, prospects, backorders, carteraList, user }) {"
);

// 4. Add states
code = code.replace(
  /const \[budgetVal, setBudgetVal\] = React\.useState\(''\);/,
  "const [budgetVal, setBudgetVal] = React.useState('');\n  const [openHistory, setOpenHistory] = React.useState(null);\n  const [budgetType, setBudgetType] = React.useState('Anual');"
);

// 5. Fix Budget Editor UI
const newEditor = `{editingBudget === s.id ? (
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
                            <input type="number" style={{ width: '100%', padding: '10px 10px 10px 24px', border: '1px solid #cbd5e1', borderRadius:'8px', fontWeight: 600, fontSize: '0.95rem', boxSizing: 'border-box' }} placeholder="Nuevo Presupuesto" value={budgetVal} onChange={e => setBudgetVal(e.target.value)} autoFocus />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleSaveBudget(s.id)} style={{ padding: '0 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>Guardar</button>
                          <button onClick={() => setEditingBudget(null)} style={{ padding: '0 16px', background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>✕</button>
                        </div>
                      </div>
                   ) : (`;

const brokenRegex = /\{editingBudget === s\.id \? \([\s\S]*?\)\s*:\s*\(/;
code = code.replace(brokenRegex, newEditor);

// 6. History Table
const historyTable = `\n              <button 
                onClick={() => setOpenHistory(openHistory === s.id ? null : s.id)}
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '16px', fontWeight: 600, color: '#334155', transition: 'all 0.2s' }}>
                 <ClipboardList size={18}/> {openHistory === s.id ? 'Ocultar Historial Operativo' : 'Ver Historial Operativo de Desempeño'}
              </button>

              {openHistory === s.id && (
                 <div style={{ marginTop: '20px', borderTop: '1px dashed #cbd5e1', paddingTop: '20px' }}>
                    
                    {/* Pipeline Activo */}
                    <div style={{ marginBottom: '16px' }}>
                      <h5 style={{ margin: '0 0 12px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} color="#d97706" /> Pipeline (En Negociación)</h5>
                      <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '8px' }}>
                         {(prospects||[]).filter(p => (p.seller === s.name || ((p.id % Math.max(1, sellers.length)) === s.id % Math.max(1, sellers.length))) && p.stage !== 'Venta Cerrada' && p.stage !== 'Perdido').map(p => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #f8fafc', fontSize: '0.85rem' }}>
                               <span style={{ fontWeight: 600, color: '#334155' }}>{p.name}</span>
                               <span style={{ color: '#059669', fontWeight: 700 }}>$\${(p.budget||0).toLocaleString('es-MX')}</span>
                            </div>
                         ))}
                         {((prospects||[]).filter(p => (p.seller === s.name || ((p.id % Math.max(1, sellers.length)) === s.id % Math.max(1, sellers.length))) && p.stage !== 'Venta Cerrada' && p.stage !== 'Perdido').length === 0) && <div style={{ padding: '8px', color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>No hay ventas activas en progreso.</div>}
                      </div>
                    </div>

                    {/* Backorders (No Estregadas) */}
                    <div style={{ marginBottom: '16px' }}>
                      <h5 style={{ margin: '0 0 12px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} color="#dc2626" /> Ventas No Entregadas (Backorders)</h5>
                      <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '8px' }}>
                         {(backorders||[]).filter(b => b.vendedor === s.name).map(b => (
                            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #fee2e2', fontSize: '0.85rem' }}>
                               <span style={{ fontWeight: 600, color: '#991b1b' }}>{b.cliente} <span style={{ fontWeight: 'normal', color: '#dc2626' }}>({b.producto})</span></span>
                               <span style={{ color: '#b91c1c', fontWeight: 700 }}>{b.pendiente} uds</span>
                            </div>
                         ))}
                         {((backorders||[]).filter(b => b.vendedor === s.name).length === 0) && <div style={{ padding: '8px', color: '#fca5a5', fontSize: '0.8rem', textAlign: 'center' }}>Todas las ventas están entregadas al 100%.</div>}
                      </div>
                    </div>

                    {/* Cartera Activa */}
                    <div>
                      <h5 style={{ margin: '0 0 12px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} color="#2563eb" /> Historial de Cobranza (Cartera)</h5>
                      <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '8px' }}>
                         {(carteraList||[]).filter(c => c.seller === s.name).map(c => (
                            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #dbeafe', fontSize: '0.85rem' }}>
                               <span style={{ fontWeight: 600, color: '#1e40af' }}>{c.client}</span>
                               <span style={{ color: '#1d4ed8', fontWeight: 700 }}>$\${(c.amount||0).toLocaleString('es-MX')}</span>
                            </div>
                         ))}
                         {((carteraList||[]).filter(c => c.seller === s.name).length === 0) && <div style={{ padding: '8px', color: '#93c5fd', fontSize: '0.8rem', textAlign: 'center' }}>Felicidades, sin saldos pendientes.</div>}
                      </div>
                    </div>

                 </div>
              )}
`;

code = code.replace(
  /\{!\isAdmin && \([\s\S]*?\} para la meta\.`\}\n\s*<\/h4>\n\s*<\/div>\n\s*\)\}/,
  (match) => match + historyTable
);

fs.writeFileSync('c:/Users/ameri/OneDrive/Documents/Estancia/Agro/src/App.jsx', code, 'utf8');
console.log('App.jsx repaired and updated!');
