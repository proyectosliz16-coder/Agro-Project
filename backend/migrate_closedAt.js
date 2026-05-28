const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const wonStages = ['Venta Completada', 'Ganado', 'Venta Cerrada', 'Depósito (Venta)'];
  const prospects = await prisma.prospect.findMany();
  for (const p of prospects) {
    if (wonStages.includes(p.stage)) {
      await prisma.prospect.update({
        where: { id: p.id },
        data: { closedAt: new Date() }
      });
      console.log(`Updated prospect ${p.id} with closedAt`);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
