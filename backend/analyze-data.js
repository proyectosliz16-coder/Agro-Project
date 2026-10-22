const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyze() {
  const prospects = await prisma.prospect.findMany();
  const backorders = await prisma.backorder.findMany();
  const cartera = await prisma.cartera.findMany();
  const activities = await prisma.activity.findMany();

  let inconsistencies = {
    backorders_prospect_mismatch: 0,
    cartera_seller_mismatch: 0,
    activity_seller_mismatch: 0
  };

  // Check backorders
  backorders.forEach(b => {
    // find prospect by name
    const p = prospects.find(p => p.name.trim().toLowerCase() === b.cliente.trim().toLowerCase());
    if (p) {
      if (p.vendedor !== b.vendedor) {
        inconsistencies.backorders_prospect_mismatch++;
      }
    }
  });

  // Check cartera
  cartera.forEach(c => {
    // cartera has seller field. Does it match the backorder seller?
    const b = backorders.find(bo => (bo.documento || `AGRO-${bo.id}`) === c.folio);
    if (b) {
      if (b.vendedor !== c.seller) {
        inconsistencies.cartera_seller_mismatch++;
      }
    }
  });

  // Check activities
  activities.forEach(a => {
    // mostly check if the activity vendedor exists
    if (!a.vendedor) inconsistencies.activity_seller_mismatch++;
  });

  console.log("Total Prospects:", prospects.length);
  console.log("Total Backorders:", backorders.length);
  console.log("Total Cartera:", cartera.length);
  console.log("Total Activities:", activities.length);
  console.log("Inconsistencies found:", inconsistencies);
}

analyze()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
