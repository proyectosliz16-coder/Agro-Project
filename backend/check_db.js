const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allCartera = await prisma.cartera.findMany();
  console.log('Total cartera items:', allCartera.length);
  const statuses = allCartera.map(c => c.status);
  const statusCounts = statuses.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  console.log('Status counts:', statusCounts);
  
  const pagadas = allCartera.filter(c => c.status === 'Pagado');
  console.log('Total items with status "Pagado":', pagadas.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
