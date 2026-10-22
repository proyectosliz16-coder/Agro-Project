const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const modules = ['BackordersModule', 'ProspectosModule', 'CarteraModule', 'VentasModule', 'KpisModule'];

modules.forEach(mod => {
  const match = content.match(new RegExp(`function ${mod}\\(.*?\\) \\{[\\s\\S]*?(?=function [A-Z]|export default)`));
  if (match) {
    const fn = match[0];
    console.log(`\n--- ${mod} ---`);
    console.log(`Has useEffect fetch?`, /useEffect\(\(\) => \{\s*fetch/.test(fn));
    console.log(`Has local fetch function?`, /const fetch[A-Z][a-zA-Z]* = async/.test(fn));
  } else {
    console.log(`Not found: ${mod}`);
  }
});
