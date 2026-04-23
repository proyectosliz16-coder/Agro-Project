const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const list = await prisma.prospect.findMany({ select: { id: true, name: true } });
  console.log('Prospects List:');
  list.forEach(p => console.log(`${p.id}: ${p.name}`));
}
main().finally(async () => { await prisma.$disconnect(); });
