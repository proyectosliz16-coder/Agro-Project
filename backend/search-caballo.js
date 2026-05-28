const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = ['User', 'Product', 'Backorder', 'Prospect', 'Activity', 'Cartera', 'SellerPerformance'];
  for (const model of models) {
    const data = await prisma[model.toLowerCase()].findMany();
    const matches = data.filter(item => JSON.stringify(item).toLowerCase().includes('caballo'));
    if (matches.length > 0) {
      console.log(`Found in ${model}:`, matches);
    }
  }
}

main().finally(() => prisma.$disconnect());
