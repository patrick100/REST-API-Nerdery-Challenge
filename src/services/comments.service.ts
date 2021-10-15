import { Prisma, Comment, Post } from '@prisma/client';
import { prisma } from '../server';

export class CommentsService {
  static async find(uuid: string): Promise<Comment[]> {
    const post = await prisma.post.findUnique({ where: { uuid } });

    return prisma.comment.findMany({
      where: {
        user: {
          id: post.id,
        },
      },
    });
  }

  static async update(): Promise<void> {
    console.log();
  }
}
