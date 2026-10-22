const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prospects = await prisma.prospect.findMany();
  console.log('--- PROSPECTS ---');
  console.log(prospects.map(p => ({ id: p.id, name: p.name, vendedor: p.vendedor, isClient: p.isClient })));
  
  const backorders = await prisma.backorder.findMany();
  console.log('--- BACKORDERS ---');
  console.log(backorders.map(b => ({ id: b.id, cliente: b.cliente, vendedor: b.vendedor, documento: b.documento, estado: b.estado })));
  
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
