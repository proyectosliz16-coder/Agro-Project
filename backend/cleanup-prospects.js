const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const all = await prisma.prospect.findMany();
  const seen = new Set();
  for (const p of all) {
    if (seen.has(p.name)) {
      await prisma.prospect.delete({ where: { id: p.id } });
      console.log(`Deleted duplicate: ${p.name}`);
    } else {
      seen.add(p.name);
    }
  }
}
main().finally(async () => { await prisma.$disconnect(); });
