const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const vendedores = [
    'America Lizbet Flores Alcala',
    'Luis Gonzales',
    'Edgar Leyton'
  ];

  console.log('Iniciando redistribución de datos...');

  // 1. Redistribuir Prospectos
  const prospects = await prisma.prospect.findMany();
  for (let i = 0; i < prospects.length; i++) {
    const v = vendedores[i % vendedores.length];
    await prisma.prospect.update({
      where: { id: prospects[i].id },
      data: { vendedor: v }
    });
  }
  console.log(`Redistribuidos ${prospects.length} prospectos.`);

  // 2. Redistribuir Backorders / Pedidos
  const backorders = await prisma.backorder.findMany();
  for (let i = 0; i < backorders.length; i++) {
    const v = vendedores[i % vendedores.length];
    await prisma.backorder.update({
      where: { id: backorders[i].id },
      data: { vendedor: v }
    });
  }
  console.log(`Redistribuidos ${backorders.length} backorders.`);

  // 3. Redistribuir Cartera
  const cartera = await prisma.cartera.findMany();
  for (let i = 0; i < cartera.length; i++) {
    const v = vendedores[i % vendedores.length];
    await prisma.cartera.update({
      where: { id: cartera[i].id },
      data: { seller: v }
    });
  }
  console.log(`Redistribuidos ${cartera.length} registros de cartera.`);

  // 4. Redistribuir Actividades (Opcional pero útil para el Dashboard)
  const activities = await prisma.activity.findMany();
  for (let i = 0; i < activities.length; i++) {
    const v = vendedores[i % vendedores.length];
    await prisma.activity.update({
      where: { id: activities[i].id },
      data: { vendedor: v }
    });
  }
  console.log(`Redistribuidas ${activities.length} actividades.`);

  console.log('¡Redistribución completada con éxito!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
