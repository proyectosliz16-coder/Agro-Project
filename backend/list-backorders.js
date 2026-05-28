const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const backorders = await prisma.backorder.findMany();
  console.log(`Total Backorders: ${backorders.length}`);
  backorders.forEach(b => {
    console.log(`[ID: ${b.id}] Cliente: ${b.cliente}, Folio: ${b.documento}, isNewClient: ${b.isNewClient}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
