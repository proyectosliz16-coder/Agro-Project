const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete the dummy ones
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['america@agriflow.com', 'luis@agriflow.com', 'carlos@agriflow.com']
      }
    }
  });
  
  await prisma.sellerPerformance.deleteMany({
    where: {
      email: {
        in: ['america@agriflow.com', 'luis@agriflow.com', 'carlos@agriflow.com']
      }
    }
  });

  // Assign the mock prospects to the REAL users
  await prisma.prospect.updateMany({
    where: { vendedor: 'America' },
    data: { vendedor: 'America Lizbet Flores Alcala' }
  });
  
  await prisma.prospect.updateMany({
    where: { vendedor: 'Luis' },
    data: { vendedor: 'Luis Gonzales' }
  });

  console.log('Cleanup done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
