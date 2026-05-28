const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Distribuyendo fechas de entrega para tener todos los estados...');
  
  const backorders = await prisma.backorder.findMany({
    where: {
      estado: { notIn: ['Cotización', 'Perdido', 'Cancelado'] },
      pendiente: { gt: 0 }
    }
  });

  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  let criticos = 0;
  let riesgo = 0;
  let tiempo = 0;

  for (let i = 0; i < backorders.length; i++) {
    const bo = backorders[i];
    let newFechaEntrega = new Date();

    if (i % 3 === 0) {
      // Crítico (Ayer o antes)
      newFechaEntrega.setDate(hoy.getDate() - (Math.floor(Math.random() * 5) + 1));
      criticos++;
    } else if (i % 3 === 1) {
      // En riesgo (Hoy o mañana)
      if (Math.random() > 0.5) {
        newFechaEntrega = new Date(hoy);
      } else {
        newFechaEntrega = new Date(manana);
      }
      riesgo++;
    } else {
      // En tiempo (Pasado mañana o después)
      newFechaEntrega.setDate(hoy.getDate() + (Math.floor(Math.random() * 5) + 2));
      tiempo++;
    }

    // Asegurarse de que createdAt tenga sentido (antes o igual a la fecha de entrega, y no en el futuro)
    let newCreatedAt = new Date(newFechaEntrega);
    newCreatedAt.setDate(newFechaEntrega.getDate() - 2);
    if (newCreatedAt > hoy) {
      newCreatedAt = new Date(hoy);
      newCreatedAt.setDate(hoy.getDate() - 1);
    }

    await prisma.backorder.update({
      where: { id: bo.id },
      data: { 
        fechaEntrega: newFechaEntrega,
        createdAt: newCreatedAt
      }
    });
  }

  console.log(`Migración completada. Críticos: ${criticos}, En riesgo: ${riesgo}, En tiempo: ${tiempo}.`);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
