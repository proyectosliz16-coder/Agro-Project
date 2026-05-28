const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bos = await prisma.backorder.findMany();
  const prospects = await prisma.prospect.findMany();
  
  const boStats = {};
  bos.forEach(b => {
    boStats[b.estado] = (boStats[b.estado] || 0) + 1;
  });

  const pStats = {};
  prospects.forEach(p => {
    pStats[p.stage] = (pStats[p.stage] || 0) + 1;
  });

  console.log("BACKORDERS BY ESTADO:", boStats);
  console.log("PROSPECTS BY STAGE:", pStats);
  
  // Imprimir los que están en cotización para ver su precio
  const boCotizacion = bos.filter(b => b.estado === 'Cotización');
  console.log("BACKORDERS EN COTIZACION:", JSON.stringify(boCotizacion, null, 2));

  // Imprimir los perdidos
  const boPerdidos = bos.filter(b => b.estado === 'Perdido');
  console.log("BACKORDERS PERDIDOS:", JSON.stringify(boPerdidos, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
