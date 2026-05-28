const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.backorder.updateMany({
    where: {
      cliente: {
        equals: 'RANCHO LAS 3 MARIAS',
        mode: 'insensitive'
      }
    },
    data: {
      isNewClient: false
    }
  });
  console.log(`Updated ${result.count} backorders for RANCHO LAS 3 MARIAS to isNewClient: false`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
