const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.backorder.findMany({ take: 3, orderBy: { id: 'desc' } }).then(b => {
  console.log(JSON.stringify(b, null, 2));
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
