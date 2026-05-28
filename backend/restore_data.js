const { PrismaClient } = require('@prisma/client');

// Direcciones de las bases de datos (INVERTIDAS para restaurar)
const LOCAL_URL = process.env.DATABASE_URL || "postgresql://agro_user:agro_password@localhost:5432/agro_flow";
const REMOTE_URL = "postgresql://agro_db_no8c_user:680XeFvN7BtnaSIUzu2xmZoXAdAznC00@dpg-d7l8rt1f9bms738f2lk0-a.ohio-postgres.render.com/agro_db_no8c";

async function restore() {
  console.log('Intentando restaurar datos desde el servidor en la nube (Render)...');
  
  const local = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } });
  const remote = new PrismaClient({ datasources: { db: { url: REMOTE_URL } } });

  try {
    // 3. Restaurar Backorders
    console.log('Descargando backorders...');
    const backorders = await remote.backorder.findMany();
    
    if (backorders.length > 0) {
      console.log(`Se encontraron ${backorders.length} backorders en el respaldo. Restaurando...`);
      for (const b of backorders) {
        await local.backorder.upsert({
          where: { id: b.id },
          update: b,
          create: b
        });
      }
      console.log('✅ Backorders restaurados.');
    } else {
      console.log('⚠️ No se encontraron backorders en el servidor remoto para restaurar.');
    }

  } catch (error) {
    console.error('❌ Error durante la restauración:', error);
  } finally {
    await local.$disconnect();
    await remote.$disconnect();
  }
}

restore();
