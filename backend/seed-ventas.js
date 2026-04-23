const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando datos de Ventas...');
  
  await prisma.sellerPerformance.deleteMany({}); // Limpiar historial viejo de demo

  const sellers = [
    { name: 'Edgar Leyton', email: 'edgar@agriflow.com', sales: 271218, budget: 3283322 },
    { name: 'Oficina Celaya', email: 'celaya@agriflow.com', sales: 342156, budget: 2800000 },
    { name: 'Magdalena Dominguez', email: 'magdalena@agriflow.com', sales: 198450, budget: 2500000 },
    { name: 'Cecilia Granillo', email: 'cecilia@agriflow.com', sales: 156789, budget: 2200000 },
  ];

  for (const s of sellers) {
    await prisma.sellerPerformance.create({
      data: s
    });
  }

  console.log('Semilla completada.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
