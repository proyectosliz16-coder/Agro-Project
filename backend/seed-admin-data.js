const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newProspectsAndClients = [
    // 👨💼 Admin (Asumo que el name es "Admin User" o "Administrador" según como inicie sesión. En la captura de Master dice "Master User", así que pondremos "Admin User")
    {
      name: 'Rancho Santa Elena',
      phone: '4928889900',
      email: 'admin@santa-elena.com',
      interest: 'Semillas de Avena',
      location: 'Sombrerete',
      budget: 30000,
      stage: 'Venta Cerrada',
      isClient: true,

      vendedor: 'Master User'
    }
  ];

  for (const data of newProspectsAndClients) {
    const created = await prisma.prospect.create({ data });
    console.log(`Creado: ${created.name} (${created.isClient ? 'Cliente' : 'Prospecto'}) asignado a ${created.vendedor}`);
  }

  console.log('Todos los registros insertados exitosamente.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
