const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const c = await prisma.cartera.findMany();
  console.log(c.length, "cartera items");
}

main().catch(console.error).finally(() => prisma.$disconnect());
