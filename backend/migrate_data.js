const { PrismaClient } = require('@prisma/client');

// Direcciones de las bases de datos
const LOCAL_URL = "postgresql://agro_user:agro_password@localhost:5432/agro_flow";
const REMOTE_URL = "postgresql://agro_db_no8c_user:680XeFvN7BtnaSIUzu2xmZoXAdAznC00@dpg-d7l8rt1f9bms738f2lk0-a.ohio-postgres.render.com/agro_db_no8c";

async function migrate() {
  console.log('🚀 Iniciando migración de datos hacia Render...');
  
  const local = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } });
  const remote = new PrismaClient({ datasources: { db: { url: REMOTE_URL } } });

  try {
    // 1. Migrar Usuarios
    console.log('Migrando usuarios...');
    const users = await local.user.findMany();
    for (const user of users) {
      await remote.user.upsert({
        where: { email: user.email },
        update: user,
        create: user
      });
    }

    // 2. Migrar Productos
    console.log('Migrando productos...');
    const products = await local.product.findMany();
    for (const p of products) {
      await remote.product.upsert({
        where: { name: p.name },
        update: p,
        create: p
      });
    }

    // 3. Migrar Backorders
    console.log('Migrando backorders...');
    const backorders = await local.backorder.findMany();
    for (const b of backorders) {
      await remote.backorder.upsert({
        where: { id: b.id },
        update: b,
        create: b
      });
    }

    // 4. Migrar Prospectos
    console.log('Migrando prospectos...');
    const prospects = await local.prospect.findMany();
    for (const p of prospects) {
      await remote.prospect.upsert({
        where: { id: p.id },
        update: p,
        create: p
      });
    }

    // 5. Migrar Cartera
    console.log('Migrando cartera...');
    const cartera = await local.cartera.findMany();
    for (const c of cartera) {
      await remote.cartera.upsert({
        where: { id: c.id },
        update: c,
        create: c
      });
    }

    // 6. Migrar Actividades
    console.log('Migrando actividades...');
    const activities = await local.activity.findMany();
    for (const a of activities) {
      await remote.activity.upsert({
        where: { id: a.id },
        update: a,
        create: a
      });
    }

    // 7. Migrar KPIs (Ventas)
    console.log('Migrando KPIs de vendedores...');
    const performance = await local.sellerPerformance.findMany();
    for (const s of performance) {
      await remote.sellerPerformance.upsert({
        where: { id: s.id },
        update: s,
        create: s
      });
    }

    console.log('✅ Migración COMPLETA realizada con éxito!');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await local.$disconnect();
    await remote.$disconnect();
  }
}

migrate();
