const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando datos de cartera...');

  const sellersDebt = [
    { name: 'Edgar Leyton', m1: 180500, m2: 45000, m3: 22000, m4: 10000 },
    { name: 'Oficina Celaya', m1: 210000, m2: 55000, m3: 30000, m4: 15000 },
    { name: 'Magdalena Dominguez', m1: 150000, m2: 38000, m3: 18000, m4: 8000 },
    { name: 'Cecilia Granillo', m1: 120000, m2: 30000, m3: 15000, m4: 5000 },
    { name: 'Gabriel Jimenez', m1: 140000, m2: 35000, m3: 17000, m4: 7000 },
  ];

  // Agregamos también lo de la gráfica circular (El total de resumen es distinto: 1-30d = $2,121,000.00, etc)
  const extras = [
    { name: 'Otros (Histórico)', m1: 2121000 - 800500, m2: 542000 - 203000, m3: 272000 - 102000, m4: 116000 - 45000 }
  ];

  const allSellers = [...sellersDebt, ...extras];

  for (const seller of allSellers) {
    if (seller.m1 > 0) await prisma.cartera.create({ data: { client: 'Varios', seller: seller.name, amount: seller.m1, ageGroup: '1-30' } });
    if (seller.m2 > 0) await prisma.cartera.create({ data: { client: 'Varios', seller: seller.name, amount: seller.m2, ageGroup: '31-60' } });
    if (seller.m3 > 0) await prisma.cartera.create({ data: { client: 'Varios', seller: seller.name, amount: seller.m3, ageGroup: '61-90' } });
    if (seller.m4 > 0) await prisma.cartera.create({ data: { client: 'Varios', seller: seller.name, amount: seller.m4, ageGroup: '+90' } });
  }

  console.log('Semillado completo.');
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
