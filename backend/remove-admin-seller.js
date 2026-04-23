const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const adminSeller = await prisma.sellerPerformance.findFirst({ where: { name: 'Administrador' } });
  if (adminSeller) {
    await prisma.sellerPerformance.delete({ where: { id: adminSeller.id } });
    console.log('Admin removed from SellerPerformance table.');
  } else {
    console.log('Admin not found in SellerPerformance table.');
  }
}
main().finally(async () => { await prisma.$disconnect(); });
