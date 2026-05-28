const { PrismaClient } = require('@prisma/client');

const LOCAL_URL = process.env.DATABASE_URL || "postgresql://agro_user:agro_password@localhost:5432/agro_flow";
const REMOTE_URL = "postgresql://agro_db_no8c_user:680XeFvN7BtnaSIUzu2xmZoXAdAznC00@dpg-d7l8rt1f9bms738f2lk0-a.ohio-postgres.render.com/agro_db_no8c";

async function restoreRaw() {
  console.log('Intentando restaurar mediante consulta cruda para ignorar diferencias de esquema...');
  
  const local = new PrismaClient({ datasources: { db: { url: LOCAL_URL } } });
  const remote = new PrismaClient({ datasources: { db: { url: REMOTE_URL } } });

  try {
    const rawBackorders = await remote.$queryRawUnsafe(`SELECT * FROM "Backorder"`);
    
    if (rawBackorders.length > 0) {
      console.log(`Se encontraron ${rawBackorders.length} backorders en Render. Restaurando...`);
      for (const b of rawBackorders) {
        // Mapear manualmente y proveer valor por defecto para isNewClient
        await local.backorder.upsert({
          where: { id: b.id },
          update: {
            cliente: b.cliente,
            vendedor: b.vendedor,
            producto: b.producto,
            documento: b.documento,
            cantidad: b.cantidad,
            pendiente: b.pendiente,
            precio: b.precio,
            estado: b.estado,
            prioridad: b.prioridad,
            // isNewClient no estaba en el remoto, usamos false por defecto
            isNewClient: false, 
            driverName: b.driverName,
            unitInfo: b.unitInfo,
            routeInfo: b.routeInfo,
            deliveryNotes: b.deliveryNotes,
            deliveredQty: b.deliveredQty,
            billingStatus: b.billingStatus,
            deliveredAt: b.deliveredAt,
            createdAt: b.createdAt
          },
          create: {
            id: b.id,
            cliente: b.cliente,
            vendedor: b.vendedor,
            producto: b.producto,
            documento: b.documento,
            cantidad: b.cantidad,
            pendiente: b.pendiente,
            precio: b.precio,
            estado: b.estado,
            prioridad: b.prioridad,
            isNewClient: false,
            driverName: b.driverName,
            unitInfo: b.unitInfo,
            routeInfo: b.routeInfo,
            deliveryNotes: b.deliveryNotes,
            deliveredQty: b.deliveredQty,
            billingStatus: b.billingStatus,
            deliveredAt: b.deliveredAt,
            createdAt: b.createdAt
          }
        });
      }
      console.log('✅ Backorders restaurados exitosamente.');
    } else {
      console.log('⚠️ La base de datos remota no tiene backorders.');
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
  } finally {
    await local.$disconnect();
    await remote.$disconnect();
  }
}

restoreRaw();
