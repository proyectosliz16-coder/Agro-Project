const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Sincronizando createdAt con fechaEntrega...');
  const backorders = await prisma.backorder.findMany();

  let updated = 0;
  for (const bo of backorders) {
    if (bo.fechaEntrega) {
      // Para que tengan sentido, la fecha de creación (createdAt) será igual a fechaEntrega 
      // (o unos días antes, pero con igual es suficiente para que no diga "hoy")
      await prisma.backorder.update({
        where: { id: bo.id },
        data: { createdAt: bo.fechaEntrega }
      });
      updated++;
    }
  }

  console.log(`Migración completada. ${updated} fechas de creación actualizadas.`);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
