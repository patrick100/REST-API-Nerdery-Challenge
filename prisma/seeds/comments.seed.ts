import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const comments: Prisma.CommentCreateInput[] = [
  {
    title: 'It is amazing',
    body: "It's a good new I just bought bitcoins",
    user: { connect: { id: 1 } },
    post: { connect: { id: 1 } },
  },
  {
    title: 'It is a sad new',
    body: 'I think Peru gave everything it could',
    user: { connect: { id: 1 } },
    post: { connect: { id: 2 } },
  },
  {
    title: 'It is good new',
    body: 'this is the news we were waiting for',
    user: { connect: { id: 1 } },
    post: { connect: { id: 3 } },
  },
  {
    title: 'Peru is nothing',
    body: 'Peru should retire with dignity',
    user: { connect: { id: 1 } },
    post: { connect: { id: 4 } },
  },
  {
    title: 'It is an amazing new',
    body: 'Peru will be very popular with the film',
    user: { connect: { id: 1 } },
    post: { connect: { id: 5 } },
  },
  {
    title: 'Great new!',
    body: 'I am proud to see Peru in the cinema',
    user: { connect: { id: 2 } },
    post: { connect: { id: 5 } },
  },
];

const commentsSeed = async () => {
  for (const comment of comments) {
    await prisma.comment.create({
      data: comment,
    });
  }
};

export default commentsSeed;
