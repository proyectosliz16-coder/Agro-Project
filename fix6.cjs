const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove duplicate `</>` in Vendedor section
const target1 = `                  <SidebarItem icon={Box} label="Backorders" active={view === 'Backorders'} onClick={() => setView('Backorders')} />
                </>
                </>
              )}`;
const replace1 = `                  <SidebarItem icon={Box} label="Backorders" active={view === 'Backorders'} onClick={() => setView('Backorders')} />
                </>
              )}`;

content = content.replace(target1, replace1);

// 2. Remove the injected duplicate COMERCIAL block
const target2 = `                  <SidebarItem icon={TrendingUp} label="KPIs" active={view === 'KPIs'} onClick={() => setView('KPIs')} />
                </>
              )}
                  <SidebarItem icon={DollarSign} label="Pipeline de Ventas" active={view === 'Ventas'} onClick={() => setView('Ventas')} />
                  <SidebarItem icon={Receipt} label="Facturación" active={view === 'Facturacion'} onClick={() => setView('Facturacion')} />
                  <SidebarItem icon={Building2} label="Cartera" active={view === 'Cartera'} onClick={() => setView('Cartera')} />
                  <SidebarItem icon={TrendingUp} label="KPIs" active={view === 'KPIs'} onClick={() => setView('KPIs')} />
                </>
              )}

              <SidebarSection title="ADMINISTRACIÓN"`;

const replace2 = `                  <SidebarItem icon={TrendingUp} label="KPIs" active={view === 'KPIs'} onClick={() => setView('KPIs')} />
                </>
              )}

              <SidebarSection title="ADMINISTRACIÓN"`;

content = content.replace(target2, replace2);

fs.writeFileSync('src/App.jsx', content);
console.log('Fixed both syntax errors!');
