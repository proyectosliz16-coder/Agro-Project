const { PrismaClient } = require('@prisma/client');

const LOCAL_URL = process.env.DATABASE_URL || "postgresql://agro_user:agro_password@localhost:5432/agro_flow";
const REMOTE_URL = "postgresql://agro_db_no8c_user:680XeFvN7BtnaSIUzu2xmZoXAdAznC00@dpg-d7l8rt1f9bms738f2lk0-a.ohio-postgres.render.com/agro_db_no8c";

async function restoreProspects() {
  console.log('Intentando restaurar prospectos desde la nube (Render)...');
  
  const local = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } });
  const remote = new PrismaClient({ datasources: { db: { url: REMOTE_URL } } });

  try {
    const rawProspects = await remote.$queryRawUnsafe(`SELECT * FROM "Prospect"`);
    
    if (rawProspects.length > 0) {
      console.log(`Se encontraron ${rawProspects.length} prospectos en Render. Restaurando...`);
      for (const p of rawProspects) {
        await local.prospect.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            phone: p.phone,
            email: p.email,
            interest: p.interest,
            location: p.location,
            budget: p.budget,
            stage: p.stage,
            isClient: p.isClient,
            notes: p.notes,
            appointmentDate: p.appointmentDate,
            appointmentMethod: p.appointmentMethod,
            meetingDone: p.meetingDone,
            createdAt: p.createdAt,
            closedAt: p.closedAt
          },
          create: {
            id: p.id,
            name: p.name,
            phone: p.phone,
            email: p.email,
            interest: p.interest,
            location: p.location,
            budget: p.budget,
            stage: p.stage,
            isClient: p.isClient,
            notes: p.notes,
            appointmentDate: p.appointmentDate,
            appointmentMethod: p.appointmentMethod,
            meetingDone: p.meetingDone,
            createdAt: p.createdAt,
            closedAt: p.closedAt
          }
        });
      }
      console.log('✅ Prospectos (Pipelines) restaurados exitosamente.');
    } else {
      console.log('⚠️ La base de datos remota no tiene prospectos.');
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
  } finally {
    await local.$disconnect();
    await remote.$disconnect();
  }
}

restoreProspects();
