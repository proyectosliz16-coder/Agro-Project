const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prospects = await prisma.prospect.findMany({
    where: {
      name: {
        contains: 'Rancho las 3 Marias',
        mode: 'insensitive'
      }
    }
  });
  
  console.log('Found prospects:', prospects);
  
  if (prospects.length > 1) {
    const mainProspect = prospects.find(p => p.phone && p.phone !== 'Sin teléfono');
    const duplicateProspect = prospects.find(p => !p.phone || p.phone === 'Sin teléfono' || p.phone === '');
    
    if (mainProspect && duplicateProspect) {
      console.log('Merging duplicate into main prospect...');
      await prisma.prospect.update({
        where: { id: mainProspect.id },
        data: {
          interest: duplicateProspect.interest || mainProspect.interest,
          budget: duplicateProspect.budget || mainProspect.budget,
          vendedor: mainProspect.vendedor || duplicateProspect.vendedor || 'Ivan Castañeda'
        }
      });
      
      await prisma.prospect.delete({
        where: { id: duplicateProspect.id }
      });
      console.log('Duplicate deleted successfully.');
    }
  }
  
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
