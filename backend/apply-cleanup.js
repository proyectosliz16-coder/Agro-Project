const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando limpieza profunda del sistema...");

  // 1. Eliminar todo el historial de actividades (reiniciar el feed)
  await prisma.activity.deleteMany({});
  console.log("- Feed de 'Actividad Reciente' vaciado.");

  // 2. Mantener solo los clientes válidos
  const clientsToKeep = ['RANCHO LAS 3 MARIAS', 'RANCHO LOS CABALLOS'];
  
  await prisma.prospect.deleteMany({
    where: {
      NOT: {
        name: { in: clientsToKeep }
      }
    }
  });
  console.log("- Prospectos y clientes de prueba eliminados.");

  // 3. Mantener solo los documentos válidos
  const docsToKeep = ['AGRO-638095', 'AGRO-CAB-001'];
  await prisma.backorder.deleteMany({
    where: {
      NOT: {
        documento: { in: docsToKeep }
      }
    }
  });
  console.log("- Backorders y Pedidos de prueba eliminados (solo se conservan los 2 reales).");

  // 4. Limpiar cartera
  await prisma.cartera.deleteMany({
    where: {
      NOT: {
        client: { in: clientsToKeep }
      }
    }
  });
  console.log("- Deudas de prueba eliminadas de la Cartera.");

  console.log("¡Limpieza completada con éxito! El sistema ahora solo tiene datos reales.");
}

main()
  .catch(e => console.error("Error durante la limpieza:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
