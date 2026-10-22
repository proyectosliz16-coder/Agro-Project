const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.approval.count();
  if (count === 0) {
    await prisma.approval.create({
      data: { type: 'Solicitud de descuento', client: 'Agro del Norte', amount: '$15,000 MXN', status: 'pending' }
    });
    await prisma.approval.create({
      data: { type: 'Solicitud de crédito', client: 'Semillas del Bajío', amount: '$25,000 MXN', status: 'pending' }
    });
    console.log('Aprobaciones semilla insertadas.');
  } else {
    console.log('Ya existen aprobaciones, omitiendo seed.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
