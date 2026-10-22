const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Limpiando datos incoherentes...');
  await prisma.activity.deleteMany({});
  await prisma.cartera.deleteMany({});
  await prisma.backorder.deleteMany({});
  await prisma.prospect.deleteMany({});

  const products = await prisma.product.findMany();
  if (products.length === 0) {
    console.error("No hay productos en la base de datos.");
    return;
  }

  // Usuarios a los que se les asignará información
  const usuarios = [
    { name: 'America Lizbet Flores Alcala', role: 'Vendedor' },
    { name: 'Luis Gonzales', role: 'Vendedor' },
    { name: 'Edgar Leyton', role: 'Vendedor' },
    { name: 'Admin Master', role: 'Master' }, // Representa la vista del master
  ];

  console.log('Generando información perfectamente aislada y coherente...');

  for (const user of usuarios) {
    // ------------------------------------------
    // 1. Crear 2 Prospectos (Aún no compran, Pipeline de Ventas)
    // ------------------------------------------
    const p1 = await prisma.prospect.create({
      data: {
        name: `Empresa Prospecto A de ${user.name.split(' ')[0]}`,
        email: `prospecto.a.${user.name.split(' ')[0].toLowerCase()}@test.com`,
        phone: '555-0101',
        interest: products[0].name,
        location: 'Sinaloa',
        budget: 50000,
        stage: 'Contacto',
        isClient: false,
        vendedor: user.name
      }
    });

    const p2 = await prisma.prospect.create({
      data: {
        name: `Rancho Prospecto B de ${user.name.split(' ')[0]}`,
        email: `prospecto.b.${user.name.split(' ')[0].toLowerCase()}@test.com`,
        phone: '555-0102',
        interest: products[1 % products.length].name,
        location: 'Sonora',
        budget: 80000,
        stage: 'Negociación',
        isClient: false,
        vendedor: user.name
      }
    });

    // ------------------------------------------
    // 2. Crear 2 Clientes (Ya compraron, tienen Pedidos/Backorders y Facturación)
    // ------------------------------------------
    const c1 = await prisma.prospect.create({
      data: {
        name: `Cliente Consolidado X de ${user.name.split(' ')[0]}`,
        email: `cliente.x.${user.name.split(' ')[0].toLowerCase()}@test.com`,
        phone: '555-0201',
        interest: products[0].name,
        location: 'Jalisco',
        budget: 150000,
        stage: 'Venta Completada',
        isClient: true,
        vendedor: user.name
      }
    });

    const c2 = await prisma.prospect.create({
      data: {
        name: `Agrícola Cliente Y de ${user.name.split(' ')[0]}`,
        email: `cliente.y.${user.name.split(' ')[0].toLowerCase()}@test.com`,
        phone: '555-0202',
        interest: products[1 % products.length].name,
        location: 'Michoacán',
        budget: 250000,
        stage: 'Venta Cerrada',
        isClient: true,
        vendedor: user.name
      }
    });

    // ------------------------------------------
    // 3. Crear Pedidos/Backorders (Cascada: Mismo cliente = Mismo Vendedor)
    // ------------------------------------------
    // Pedido para Cliente C1
    const bo1 = await prisma.backorder.create({
      data: {
        cliente: c1.name,
        vendedor: user.name,
        producto: products[0].name,
        documento: `AGRO-${Math.floor(1000 + Math.random() * 9000)}`,
        cantidad: 50,
        pendiente: 10, // Tiene backorder
        precio: products[0].price,
        estado: 'Parcial',
        isNewClient: false
      }
    });

    // Pedido para Cliente C2 (Completado)
    const bo2 = await prisma.backorder.create({
      data: {
        cliente: c2.name,
        vendedor: user.name,
        producto: products[1 % products.length].name,
        documento: `AGRO-${Math.floor(1000 + Math.random() * 9000)}`,
        cantidad: 100,
        pendiente: 0,
        precio: products[1 % products.length].price,
        estado: 'Entregado',
        isNewClient: false,
        deliveredAt: new Date()
      }
    });

    // ------------------------------------------
    // 4. Crear Facturación / Cartera (Cobranza)
    // ------------------------------------------
    await prisma.cartera.create({
      data: {
        client: c1.name,
        amount: (bo1.cantidad * bo1.precio) * 0.5, // Debe la mitad
        status: 'Pendiente',
        ageGroup: '1-30',
        seller: user.name
      }
    });

    await prisma.cartera.create({
      data: {
        client: c2.name,
        amount: bo2.cantidad * bo2.precio,
        status: 'Pagado',
        ageGroup: '1-30',
        seller: user.name
      }
    });
  }

  console.log('¡Organización 1 a Muchos y Sincronización en Cascada completada con éxito!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
