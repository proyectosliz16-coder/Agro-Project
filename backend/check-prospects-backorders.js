const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prospects = await prisma.prospect.findMany();
  const backorders = await prisma.backorder.findMany();

  console.log("=== ALL PROSPECTS ===");
  prospects.forEach(p => {
    console.log(`ID: ${p.id} | Name: ${p.name} | isClient: ${p.isClient} | Stage: ${p.stage} | Phone: ${p.phone} | Email: ${p.email} | Location: ${p.location}`);
  });

  console.log("\n=== DELIVERED ORDERS BY CLIENT ===");
  const deliveredClients = backorders.filter(bo => bo.pendiente === 0);
  const clientSummary = {};
  deliveredClients.forEach(bo => {
    clientSummary[bo.cliente] = (clientSummary[bo.cliente] || 0) + 1;
  });
  console.log(clientSummary);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
