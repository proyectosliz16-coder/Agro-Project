const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'vendedor@agriflow.com' },
    data: { password: '1234' }
  });
  console.log('Password updated');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
