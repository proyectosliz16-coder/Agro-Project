const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.sellerPerformance.deleteMany({});
  
  const data = [
    { name: 'America Lizbet Flores Alcala', email: 'alfa16@agriflow.com', sales: 16500, budget: 100000 },
    { name: 'Luis Gonzales', email: 'luisg02@agriflow.com', sales: 11200, budget: 100000 },
    { name: 'Edgar Leyton', email: 'eleyton@agriflow.com', sales: 22500, budget: 100000 },
    { name: 'Administrador Master', email: 'admin@agriflow.com', sales: 0, budget: 500000 }
  ];

  for (const s of data) {
    await prisma.sellerPerformance.create({
      data: s
    });
  }
  console.log('SellerPerformance seeded!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
