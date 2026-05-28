const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function cleanAndReturnInventory() {
  const prospects = await prisma.prospect.findMany();
  const validNames = prospects.map(p => p.name.toLowerCase());
  const backorders = await prisma.backorder.findMany();
  
  let toDeleteBO = [];
  for (const bo of backorders) {
    if (!validNames.includes((bo.cliente || '').toLowerCase())) {
      toDeleteBO.push(bo);
    }
  }
  
  console.log('Backorders to process:', toDeleteBO.length);
  
  // 1. Devolver productos al inventario
  for (const bo of toDeleteBO) {
    if (bo.pendiente > 0 && bo.producto) {
      const product = await prisma.product.findFirst({
        where: { name: bo.producto }
      });
      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { quantity: { increment: bo.pendiente } }
        });
        console.log(`Returned ${bo.pendiente} of ${bo.producto} to inventory.`);
      }
    }
  }

  // 2. Delete the backorders
  if (toDeleteBO.length > 0) {
    const idsToDelete = toDeleteBO.map(bo => bo.id);
    await prisma.backorder.deleteMany({
      where: { id: { in: idsToDelete } }
    });
    console.log(`Deleted ${idsToDelete.length} backorders.`);
  }

  // Clean logistica y facturacion si existen (actualmente Cartera no tiene invalidos)
  const cartera = await prisma.cartera.findMany();
  let toDeleteC = [];
  for (const c of cartera) {
    if (!validNames.includes((c.client || '').toLowerCase())) {
      toDeleteC.push(c);
    }
  }
  if (toDeleteC.length > 0) {
    const cIds = toDeleteC.map(c => c.id);
    await prisma.cartera.deleteMany({
      where: { id: { in: cIds } }
    });
    console.log(`Deleted ${cIds.length} from Cartera.`);
  }
  
  // Clean actividades? 
  const activities = await prisma.activity.findMany();
  // We don't have a reliable way to map activity to client name, but we can check description maybe.

}
cleanAndReturnInventory().catch(console.error).finally(() => prisma.$disconnect());
