const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando datos de prospectos...');
  
  const prospects = [
    { name: 'Rancho El Consuelo', phone: '4611234567', email: 'contacto@elconsuelo.mx', interest: 'Sustrato 250L', location: 'Celaya, GTO', budget: 45000, stage: 'Negociación' },
    { name: 'Invernaderos Pineda', phone: '4429876543', email: 'pineda@agro.com', interest: 'Eclipse LD', location: 'Querétaro, QRO', budget: 120000, stage: 'Contacto' },
    { name: 'Frutos de la Tierra', phone: '4615556677', email: 'gerencia@frutos.mx', interest: 'Maquinaria Riego', location: 'Villagrán, GTO', budget: 350000, stage: 'Evaluación' },
    { name: 'Agropecuaria Santa Maria', phone: '4619998877', email: 'compras@santamaria.com', interest: 'Fertilizantes', location: 'Cortazar, GTO', budget: 85000, stage: 'Contacto' },
    { name: 'Cultivos Hidropónicos del Bajío', phone: '4421112233', email: 'vendas@hidro.com', interest: 'Sustratos', location: 'Querétaro', budget: 220000, stage: 'Evaluación' },
    { name: 'Sociedad Cooperativa San José', phone: '4614443322', email: 'sanjose@coop.mx', interest: 'Sistemas de Riego', location: 'Apaseo el Alto', budget: 150000, stage: 'Negociación' },
    { name: 'Hacienda Los Laureles', phone: '4151234455', email: 'ventas@laureles.com', interest: 'Insumos Varios', location: 'San Miguel de Allende', budget: 95000, stage: 'Contacto' },
    { name: 'AgroSistemas El Bajío', phone: '4617778899', email: 'info@agrosistemas.mx', interest: 'Eclipse LD', location: 'Celaya', budget: 180000, stage: 'Evaluación' },
    { name: 'Productores de Berries Unidos', phone: '3334445566', email: 'contacto@berries.mx', interest: 'Sustratos Premium', location: 'Jalisco', budget: 500000, stage: 'Negociación' },
    { name: 'RANCHO LAS 3 MARIAS', phone: '4611234567', email: 'contacto@3marias.mx', interest: 'Insumos', location: 'Celaya', budget: 120000, stage: 'Venta Cerrada', isClient: true }
  ];

  for (const p of prospects) {
    await prisma.prospect.create({ data: p });
  }

  console.log('Semilla de prospectos completada.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
