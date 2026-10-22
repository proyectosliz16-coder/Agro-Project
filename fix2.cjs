const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `                  {(user?.role === 'Master' || user?.role === 'Administrador Master') && (
                    <SidebarItem icon={Settings} label="Sistema" active={view === 'Sistema'} onClick={() => setView('Sistema')} />
                  )}
                </>
              )}
          )}

          <SidebarSection title="LOGÍSTICA" isOpen={logisticaOpen} onToggle={() => setLogisticaOpen(!logisticaOpen)} />
          {logisticaOpen && (
            <>
              <SidebarItem icon={Truck} label="Logística" active={view === 'Logistica'} onClick={() => setView('Logistica')} />
            </>
          )}

        </nav>`;

const replaceStr = `                  {(user?.role === 'Master' || user?.role === 'Administrador Master') && (
                    <SidebarItem icon={Settings} label="Sistema" active={view === 'Sistema'} onClick={() => setView('Sistema')} />
                  )}
                </>
              )}

              <SidebarSection title="LOGÍSTICA" isOpen={logisticaOpen} onToggle={() => setLogisticaOpen(!logisticaOpen)} />
              {logisticaOpen && (
                <>
                  <SidebarItem icon={Truck} label="Logística" active={view === 'Logistica'} onClick={() => setView('Logistica')} />
                </>
              )}
            </>
          )}

        </nav>`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.jsx', content);
console.log('Fixed Logistica nesting');
