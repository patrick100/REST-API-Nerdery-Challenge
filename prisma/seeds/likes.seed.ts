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
    isLike: true,
    user: { connect: { id: 1 } },
    resourceId: 4,
    type: 'POST',
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
    isLike: false,
    user: { connect: { id: 1 } },
    resourceId: 4,
    type: 'COMMENT',
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
    //update field likes
    if (like.type === 'COMMENT') {
      if (like.isLike) {
        await prisma.comment.update({
          where: { id: like.resourceId },
          data: { likes: { increment: 1 } },
        });
      } else {
        await prisma.comment.update({
          where: { id: like.resourceId },
          data: { dislikes: { increment: 1 } },
        });
      }
    } else {
      if (like.isLike) {
        await prisma.post.update({
          where: { id: like.resourceId },
          data: { likes: { increment: 1 } },
        });
      } else {
        await prisma.post.update({
          where: { id: like.resourceId },
          data: { dislikes: { increment: 1 } },
        });
      }
    }
  }
};

export default likesSeed;
