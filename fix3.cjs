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

const fixStr = `                  {(user?.role === 'Master' || user?.role === 'Administrador Master') && (
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

// Normalize whitespace for both targetStr and the file content section to find the start and end.
const targetRegex = /\{\(user\?\.role === 'Master' \|\| user\?\.role === 'Administrador Master'\) && \([\s\S]*?<SidebarItem icon=\{Settings\} label="Sistema" active=\{view === 'Sistema'\} onClick=\{\(\) => setView\('Sistema'\)\} \/>[\s\S]*?\){\s*<SidebarItem icon=\{Truck\} label="Logística" active=\{view === 'Logistica'\} onClick=\{\(\) => setView\('Logistica'\)\} \/>[\s\S]*?\}[\s\S]*?<\/nav>/;

// Actually I'll just split by lines and replace lines 9164 to 9178 exactly since I know the line numbers!
let lines = content.split('\n');
// We want to replace from index 9163 to 9177
lines.splice(9163, 15, ...fixStr.split('\n'));
fs.writeFileSync('src/App.jsx', lines.join('\n'));
console.log('Fixed syntax using splice');
