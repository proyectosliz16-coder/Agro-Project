const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'asc' }
  });
  console.log('Total de productos en BD:', products.length);
  products.forEach(p => {
    console.log(`[ID: ${p.id}] ${p.name} - ${p.category} - Stock: ${p.quantity}`);
  });
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
