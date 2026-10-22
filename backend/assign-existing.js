const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Assigning existing prospects and activities to Edgar Leyton...');
  
  const prospectsUpdate = await prisma.prospect.updateMany({
    where: {
      vendedor: null,
    },
    data: {
      vendedor: 'Edgar Leyton',
    },
  });
  console.log(`Updated ${prospectsUpdate.count} prospects.`);

  const activitiesUpdate = await prisma.activity.updateMany({
    where: {
      vendedor: null,
    },
    data: {
      vendedor: 'Edgar Leyton',
    },
  });
  console.log(`Updated ${activitiesUpdate.count} activities.`);

  // Also make sure Backorders without vendedor are assigned
  const backordersUpdate = await prisma.backorder.updateMany({
    where: {
      vendedor: null,
    },
    data: {
      vendedor: 'Edgar Leyton',
    },
  });
  console.log(`Updated ${backordersUpdate.count} backorders.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
