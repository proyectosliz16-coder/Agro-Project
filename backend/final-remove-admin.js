const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.sellerPerformance.deleteMany({
    where: {
      email: 'admin@agriflow.com'
    }
  });
  console.log(`Deleted ${result.count} admin seller records.`);
}
main().finally(async () => { await prisma.$disconnect(); });
