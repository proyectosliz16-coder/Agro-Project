const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.prospect.updateMany({
    where: {
      name: {
        contains: 'Rancho las 3 Marias',
        mode: 'insensitive'
      },
      vendedor: null
    },
    data: {
      vendedor: 'Ivan Castañeda'
    }
  });
  console.log(`Updated ${result.count} prospects.`);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
