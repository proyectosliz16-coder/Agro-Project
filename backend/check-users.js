const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users.map(u => ({ id: u.id, name: u.name, email: u.email, password: u.password, role: u.role })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
