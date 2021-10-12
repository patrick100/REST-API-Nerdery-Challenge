import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
import usersSeed from './seeds/users.seed';
import postsSeed from './seeds/posts.seed';
import commentsSeed from './seeds/comments.seed';
import reportsSeed from './seeds/reports.seed';
import likesSeed from './seeds/likes.seed';

const main = async () => {
  console.log('Start seeding...');
  await usersSeed();
  await postsSeed();
  await commentsSeed();
  await reportsSeed();
  await likesSeed();
  console.log('Finished seeding.');
};

main()
  .then(() => {
    console.log('🎉 Seed successful');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
