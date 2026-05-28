const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cartera = await prisma.cartera.findMany();
  console.log(cartera);
}
main().catch(console.error).finally(() => prisma.$disconnect());
