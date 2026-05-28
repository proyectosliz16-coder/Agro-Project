const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Agregando RANCHO LAS 3 MARIAS al pipeline...');

  try {
    const exists = await prisma.prospect.findFirst({
      where: { name: 'RANCHO LAS 3 MARIAS' }
    });

    if (!exists) {
      await prisma.prospect.create({
        data: {
          name: 'RANCHO LAS 3 MARIAS',
          phone: '4610001122',
          email: 'compras@3marias.mx',
          interest: 'Fertilizantes y varios',
          location: 'Celaya',
          budget: 150000,
          stage: 'Negociación',
          isClient: false
        }
      });
      console.log('✅ RANCHO LAS 3 MARIAS agregado exitosamente al Pipeline de Prospectos (Negociación).');
    } else {
      console.log('⚠️ Ya existe en la base de datos, actualizando a Negociación...');
      await prisma.prospect.update({
        where: { id: exists.id },
        data: { stage: 'Negociación', isClient: false }
      });
      console.log('✅ Estado actualizado a Negociación.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
