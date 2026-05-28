const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Iniciando migración de fechaEntrega...');
  const backorders = await prisma.backorder.findMany();
  console.log(`Se encontraron ${backorders.length} backorders.`);

  let updated = 0;
  for (const bo of backorders) {
    if (!bo.fechaEntrega) {
      // Generar fecha entre 01/05/2026 y 20/05/2026 para asegurar que sean "Atrasados"
      // El 21 de mayo es hoy, por lo que 1 al 20 garantizan que caigan en "Críticos" o "En riesgo" (si generamos un riesgo)
      const start = new Date('2026-05-01T00:00:00Z').getTime();
      const end = new Date('2026-05-20T23:59:59Z').getTime();
      const randomDate = new Date(start + Math.random() * (end - start));

      await prisma.backorder.update({
        where: { id: bo.id },
        data: { fechaEntrega: randomDate }
      });
      updated++;
    }
  }

  console.log(`Migración completada. ${updated} backorders actualizados.`);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
