import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const likes: Prisma.LikeCreateInput[] = [
  {
    isLike: false,
    user: { connect: { id: 2 } },
    resourceId: 4,
    type: 'POST',
  },
  {
    isLike: false,
    user: { connect: { id: 1 } },
    resourceId: 4,
    type: 'COMMENT',
  },
  {
    isLike: false,
    user: { connect: { id: 1 } },
    resourceId: 3,
    type: 'POST',
  },
  {
    isLike: true,
    user: { connect: { id: 2 } },
    resourceId: 3,
    type: 'COMMENT',
  },
  {
    isLike: true,
    user: { connect: { id: 1 } },
    resourceId: 2,
    type: 'POST',
  },
  {
    isLike: true,
    user: { connect: { id: 2 } },
    resourceId: 1,
    type: 'COMMENT',
  },
];

const likesSeed = async () => {
  for (const like of likes) {
    await prisma.like.create({
      data: like,
    });
  }
};

export default likesSeed;
