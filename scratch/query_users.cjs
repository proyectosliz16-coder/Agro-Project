const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('--- USERS ---');
  console.log(users.map(u => ({ id: u.id, name: u.name, username: u.username, email: u.email, password: u.password, role: u.role })));
  
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
