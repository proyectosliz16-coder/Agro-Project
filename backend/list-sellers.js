const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const all = await prisma.sellerPerformance.findMany();
  console.log('SellerPerformance List:');
  all.forEach(s => console.log(`${s.id}: ${s.name} (${s.email})`));
}
main().finally(async () => { await prisma.$disconnect(); });
