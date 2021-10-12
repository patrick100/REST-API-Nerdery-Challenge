import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const posts: Prisma.PostCreateInput[] = [
  {
    title: 'Bitcoin increase its price',
    body: 'Bitcoin increase 3% percent this week.',
    user: { connect: { id: 1 } },
  },
  {
    title: 'Peru lost its soccer match',
    body: 'Yesterday Peru lost 0-1 against Bolivia.',
    user: { connect: { id: 1 } },
  },
  {
    title: 'Today start vacunations +18',
    body: 'Today in Peru +18 could receive their vacunation.',
    user: { connect: { id: 1 } },
  },
  {
    title: 'Alberto Fujimori the most expensive prisoner',
    body: 'It has no cells. It has three rooms, a library, a painting workshop, a kitchen, a meeting room, an infirmary and even a vegetable garden.',
    user: { connect: { id: 2 } },
  },
  {
    title: 'Transformers in Peru',
    body: 'The platforms in the Inca site were used by director Steven Caple Jr. for some sequences of the film.',
    user: { connect: { id: 2 } },
  },
];

const postsSeed = async () => {
  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }
};

export default postsSeed;
