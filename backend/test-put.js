const fetch = require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://localhost:8080/api/backorders/233', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        producto: 'SUSTRATO 250L (P:50, E:10, R:40)',
        pendiente: 40,
        estado: 'Parcial',
        dispatchHistory: [
          {
            id: 'disp_123',
            date: new Date().toISOString(),
            type: 'Parcial #1',
            status: 'En tránsito',
            guide: '12345',
            items: [{ producto: 'SUSTRATO 250L', cantidad: 10 }],
            totalPieces: 10
          }
        ]
      })
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
})();
