const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `                  <SidebarItem icon={Box} label="Backorders" active={view === 'Backorders'} onClick={() => setView('Backorders')} />
                </>
                </>
              )}`;

const replacementStr = `                  <SidebarItem icon={Box} label="Backorders" active={view === 'Backorders'} onClick={() => setView('Backorders')} />
                </>
              )}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.jsx', content);
console.log('Fixed extra tag');
