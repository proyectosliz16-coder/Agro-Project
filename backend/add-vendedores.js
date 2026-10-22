const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Agregando nuevos vendedores...');

  const nuevosVendedores = [
    { name: 'America', email: 'america@agriflow.com', phone: '555-1001' },
    { name: 'Luis', email: 'luis@agriflow.com', phone: '555-1002' },
    { name: 'Carlos', email: 'carlos@agriflow.com', phone: '555-1003' }
  ];

  for (const v of nuevosVendedores) {
    // 1. Create or update User
    const existingUser = await prisma.user.findFirst({ where: { name: v.name } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: v.name,
          email: v.email,
          password: '123',
          role: 'Vendedor',
          phone: v.phone
        }
      });
      console.log(`Usuario ${v.name} creado.`);
    } else {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'Vendedor' }
      });
      console.log(`Usuario ${v.name} actualizado a Vendedor.`);
    }

    // 2. Create SellerPerformance
    const existingSeller = await prisma.sellerPerformance.findFirst({ where: { name: v.name } });
    if (!existingSeller) {
      await prisma.sellerPerformance.create({
        data: {
          name: v.name,
          email: v.email,
          sales: Math.floor(Math.random() * 500000), // Random sales
          budget: 1000000
        }
      });
    }

    // 3. Create some mock prospects for them so the admin can see them
    await prisma.prospect.create({
      data: {
        vendedor: v.name,
        name: `Prospecto de ${v.name} 1`,
        stage: 'Contacto',
        isClient: false,
        interest: 'Insumos Básicos'
      }
    });

    await prisma.prospect.create({
      data: {
        vendedor: v.name,
        name: `Cliente de ${v.name} 1`,
        stage: 'Venta Completada',
        isClient: true,
        interest: 'Equipamiento'
      }
    });
  }
  
  console.log('¡Vendedores y datos de prueba agregados exitosamente!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
