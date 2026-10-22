const fetch = require('node-fetch');

async function test() {
  const resp = await fetch('http://127.0.0.1:8080/api/users/7', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Edgar Leyton', email: 'vendedor@agriflow.com', role: 'Vendedor', status: 'Activo' })
  });
  const data = await resp.text();
  console.log(resp.status, data);
}

test();
