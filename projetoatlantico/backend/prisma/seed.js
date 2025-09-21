import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash('123', 10);

  await prisma.user.upsert({
    where: { username: 'medico.demo' },
    update: {},
    create: {
      name: 'Dr(a). Demo',
      username: 'medico.demo',
      role: 'MEDICO',
      passwordHash: pass,
    },
  });

  await prisma.user.upsert({
    where: { username: 'atendente.demo' },
    update: {},
    create: {
      name: 'Atendente Demo',
      username: 'atendente.demo',
      role: 'ATENDENTE',
      passwordHash: pass,
    },
  });

  console.log('Seed: medico.demo / atendente.demo (senha 123)');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
