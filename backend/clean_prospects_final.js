const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanProspects() {
  console.log('Limpiando la base de datos de prospectos (dejando solo clientes con pedidos)...');
  
  // Lista de nombres válidos a conservar (relacionados con pedidos activos)
  const validNames = ['RANCHO LAS 3 MARIAS', 'RANCHO LOS CABALLOS'];

  try {
    // 1. Eliminar prospectos que NO estén en la lista válida
    const deleteResult = await prisma.prospect.deleteMany({
      where: {
        NOT: {
          name: { in: validNames }
        }
      }
    });
    console.log(`Eliminados ${deleteResult.count} prospectos irrelevantes.`);

    // 2. Asegurarse de que RANCHO LOS CABALLOS exista (como cliente fiel)
    const caballosExists = await prisma.prospect.findFirst({
      where: { name: 'RANCHO LOS CABALLOS' }
    });

    if (!caballosExists) {
      await prisma.prospect.create({
        data: {
          name: 'RANCHO LOS CABALLOS',
          phone: '4619998877',
          email: 'contacto@loscaballos.com',
          interest: 'Surtido',
          location: 'Celaya',
          budget: 200000,
          stage: 'Venta Cerrada',
          isClient: true
        }
      });
      console.log('RANCHO LOS CABALLOS agregado como cliente fiel.');
    }

    console.log('✅ Base de datos limpiada con éxito.');
  } catch (error) {
    console.error('Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanProspects();
