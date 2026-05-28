const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const backorders = await prisma.backorder.findMany({
    where: {
      estado: { notIn: ['Cotización', 'Perdido', 'Cancelado'] },
      pendiente: { gt: 0 }
    },
    orderBy: {
      fechaEntrega: 'asc'
    }
  });

  console.log("PEDIDO | CLIENTE | FECHA CREACIÓN | FECHA ENTREGA | ESTADO");
  console.log("-------------------------------------------------------------------");
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  for (const bo of backorders) {
    const fCreacion = new Date(bo.createdAt).toISOString().split('T')[0];
    const fEntrega = new Date(bo.fechaEntrega).toISOString().split('T')[0];
    
    const fd = new Date(bo.fechaEntrega);
    fd.setHours(0,0,0,0);
    let estado = "En tiempo";
    if (fd < hoy) estado = "Crítico";
    else if (fd.getTime() === hoy.getTime() || fd.getTime() === manana.getTime()) estado = "En riesgo";

    const doc = bo.documento || `AGRO-${bo.id}`;
    console.log(`${doc.padEnd(12)} | ${bo.cliente.substring(0, 15).padEnd(15)} | ${fCreacion} | ${fEntrega} | ${estado}`);
  }
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
