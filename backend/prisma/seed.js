const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Semilla de Datos (Seeding) ---');

  // 1. Crear Usuarios (Vendedores y Admin)
  const master = await prisma.user.upsert({
    where: { email: 'master@agriflow.com' },
    update: {},
    create: {
      email: 'master@agriflow.com',
      username: 'master',
      name: 'Administrador Master',
      password: '1234',
      role: 'Master',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@agriflow.com' },
    update: {},
    create: {
      email: 'admin@agriflow.com',
      name: 'Administrador',
      password: 'adminpassword', // En producción esto debe ir encriptado
      role: 'admin',
    },
  });

  const vendedor1 = await prisma.user.upsert({
    where: { email: 'vendedor@agriflow.com' },
    update: {},
    create: {
      email: 'vendedor@agriflow.com',
      name: 'Edgar Leyton',
      password: 'vendedorpassword',
      role: 'vendedor',
    },
  });

  // 2. Crear Productos Iniciales
  console.log('Sembrando productos...');
  const productos = [
    { name: 'ECLIPSE LD 20KG', description: 'Fertilizante líquido de alta absorción', category: 'Insumos', quantity: 500, cost: 75.50, margin: 25.0, price: 94.38 },
    { name: 'TUERAS RECTAS', description: 'Repuesto para maquinaria de riego', category: 'Materiales', quantity: 150, cost: 12.00, margin: 30.0, price: 15.60 },
    { name: 'SUSTRATO 250L', description: 'Mezcla orgánica para germinación', category: 'Insumos', quantity: 300, cost: 45.00, margin: 20.0, price: 54.00 },
  ];

  for (const p of productos) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {
        description: p.description,
        category: p.category,
        quantity: p.quantity,
        cost: p.cost,
        margin: p.margin,
        price: p.price
      },
      create: p
    });
  }

  // 3. Crear Backorders Iniciales
  console.log('Sembrando backorders...');
  // Opcional: Solo borrar si se desea resetear explícitamente. Por ahora lo dejamos para pruebas.
  // await prisma.backorder.deleteMany({}); // Comentado para evitar borrado accidental de datos reales
  
  const backordersData = [
    { cliente: 'AGRICOLA ZARATTINI', vendedor: 'Edgar Leyton', producto: 'ECLIPSE LD 20KG', documento: 'AGRO-2024-001', cantidad: 150, pendiente: 0, estado: 'Completado', prioridad: '52 días', precio: 94.38 },
    { cliente: 'AGRICOLA ZARATTINI', vendedor: 'Oficina Celaya', producto: 'TUERAS RECTAS', documento: 'AGRO-2024-002', cantidad: 200, pendiente: 50, estado: 'Parcial', prioridad: '42 días', precio: 15.60 },
    { cliente: 'GENARO TREJO', vendedor: 'Magdalena Dominguez', producto: 'SUSTRATO 250L', documento: 'AGRO-2024-003', cantidad: 50, pendiente: 8, estado: 'Parcial', prioridad: '37 días', precio: 54.00 },
    { cliente: 'RANCHO LOS CABALLOS', vendedor: 'Edgar Leyton', producto: 'ECLIPSE LD 20KG', documento: 'AGRO-CAB-001', cantidad: 100, pendiente: 100, estado: 'Pendiente', prioridad: 'Alta', isNewClient: true, precio: 94.38 },
  ];

  for (const b of backordersData) {
    await prisma.backorder.create({
      data: b
    });
  }

  console.log('--- Semilla Finalizada con Éxito ---');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
