const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const nameToClean = "AgroFuturo Zacatecas";
  
  // Buscar todos los prospectos con este nombre (case-insensitive o exacto según la DB)
  const duplicates = await prisma.prospect.findMany({
    where: {
      name: {
        contains: 'AgroFuturo Zacatecas',
        mode: 'insensitive' // Por si acaso
      }
    },
    orderBy: {
      createdAt: 'asc' // El más antiguo primero
    }
  });

  console.log(`Encontrados ${duplicates.length} prospectos con el nombre ${nameToClean}`);

  if (duplicates.length > 1) {
    // Conservar el primero (el original), eliminar los demás
    const toDelete = duplicates.slice(1).map(p => p.id);
    
    console.log(`Eliminando ${toDelete.length} duplicados con IDs: ${toDelete.join(', ')}`);
    
    const result = await prisma.prospect.deleteMany({
      where: {
        id: {
          in: toDelete
        }
      }
    });
    
    console.log(`Eliminados ${result.count} registros exitosamente.`);
  } else {
    console.log('No hay duplicados que eliminar.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
