const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bos = await prisma.backorder.findMany({
    where: { cliente: 'AGRICOLA ZARATTINI' }
  });
  console.log(JSON.stringify(bos, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
