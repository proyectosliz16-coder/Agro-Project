const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function clean() {
  const prospects = await prisma.prospect.findMany();
  const validNames = prospects.map(p => p.name.toLowerCase());
  const backorders = await prisma.backorder.findMany();
  
  let toDeleteBO = [];
  for (const bo of backorders) {
    if (!validNames.includes((bo.cliente || '').toLowerCase())) {
      toDeleteBO.push(bo);
    }
  }
  
  console.log('Backorders to delete:', toDeleteBO.length);
  const uniqueNames = [...new Set(toDeleteBO.map(b => b.cliente))];
  console.log('Invalid clients in Backorders:', uniqueNames);

  const cartera = await prisma.cartera.findMany();
  let toDeleteC = [];
  for (const c of cartera) {
    if (!validNames.includes((c.client || '').toLowerCase())) {
      toDeleteC.push(c);
    }
  }
  console.log('Cartera to delete:', toDeleteC.length);
  const uniqueNamesC = [...new Set(toDeleteC.map(b => b.client))];
  console.log('Invalid clients in Cartera:', uniqueNamesC);
}
clean().catch(console.error).finally(() => prisma.$disconnect());
