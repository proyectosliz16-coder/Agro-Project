const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update refreshAllData
const targetRefresh = `      const [v, c, b, a, p, pr] = results;
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
      setProducts(Array.isArray(pr) ? pr : []);`;

const replaceRefresh = `      const [v, c, b, a, p, pr] = results;
      
      let v_data = Array.isArray(v) ? v : [];
      let c_data = Array.isArray(c) ? c : [];
      let b_data = Array.isArray(b) ? b : [];
      let a_data = Array.isArray(a) ? a : [];
      let p_data = Array.isArray(p) ? p : [];
      
      if (user?.role === 'Vendedor' || user?.role === 'vendedor') {
        c_data = c_data.filter(item => item.seller === user.name);
        b_data = b_data.filter(item => item.vendedor === user.name);
        a_data = a_data.filter(item => item.vendedor === user.name);
        p_data = p_data.filter(item => item.vendedor === user.name);
        v_data = v_data.filter(item => item.name === user.name);
      }

      console.log('Data fetched successfully:', {
        ventas: v_data.length,
        cartera: c_data.length,
        backorders: b_data.length,
        prospects: p_data.length,
        products: pr.length
      });

      setSellers(v_data);
      setCarteraList(c_data);
      setBackorders(b_data);
      setActivities(a_data);
      setProspects(p_data);
      setProducts(Array.isArray(pr) ? pr : []);`;

content = content.replace(targetRefresh, replaceRefresh);

// 2. We need to inject `vendedor: user.name` everywhere a new Prospect/Activity/Backorder is created inside App.jsx or ProspectosModule.
// We can use a global replace for `JSON.stringify({` where it's a POST/PUT to API. 
// But wait, the user object is not globally available in all modules unless passed as a prop.
// Fortunately, the backend can extract `user.name` if we sent it, but we didn't.
// Let's check `App.jsx` line 5287 which seems to be ProspectosModule inside App.jsx? No, wait. Is it all one file?
// `App.jsx` has 12,000 lines. YES, it's a monolith. `user` is in scope!
// We can just add `vendedor: user.name` to the payload of new Prospect creation!
// Let's find Prospect form submission.

fs.writeFileSync('src/App.jsx', content);
console.log('Frontend fetch filters updated');
