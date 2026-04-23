const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@agriflow.com' } });
  console.log('Admin User:', user);
}
main().finally(async () => { await prisma.$disconnect(); });
