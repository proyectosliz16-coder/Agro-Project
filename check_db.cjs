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
  if (allCartera.length > 0) {
    console.log('Sample record:', JSON.stringify(allCartera[0], null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
