import { prisma } from '../server';
import { CreateLikeDto } from '../dtos/likes/request/create-like.dto';
import { TableType } from '.prisma/client';
import { Like } from '@prisma/client';
import createError from 'http-errors';

export class LikesService {
  static async verifyResourceId(resourceId: number, type: TableType): Promise<void> {
    if (type === 'COMMENT') {
      await prisma.comment.findUnique({ where: { id: resourceId } });
    } else {
      await prisma.post.findUnique({ where: { id: resourceId } });
    }
  }

  static async incrementLikeCounter(like: Like): Promise<void> {
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

  static async decrementLikeCounter(like: Like): Promise<void> {
    if (like.type === 'COMMENT') {
      if (like.isLike) {
        await prisma.comment.update({
          where: { id: like.resourceId },
          data: { likes: { decrement: 1 } },
        });
      } else {
        await prisma.comment.update({
          where: { id: like.resourceId },
          data: { dislikes: { decrement: 1 } },
        });
      }
    } else {
      if (like.isLike) {
        await prisma.post.update({
          where: { id: like.resourceId },
          data: { likes: { decrement: 1 } },
        });
      } else {
        await prisma.post.update({
          where: { id: like.resourceId },
          data: { dislikes: { decrement: 1 } },
        });
      }
    }
  }

  static async swapLikeCounter(like: Like, isLike: boolean): Promise<void> {
    if (like.type === 'COMMENT') {
      if (isLike) {
        await prisma.comment.update({
          where: { id: like.resourceId },
          data: { likes: { increment: 1 }, dislikes: { decrement: 1 } },
        });
      } else {
        await prisma.comment.update({
          where: { id: like.resourceId },
          data: { dislikes: { increment: 1 }, likes: { decrement: 1 } },
        });
      }
    } else {
      if (isLike) {
        await prisma.post.update({
          where: { id: like.resourceId },
          data: { likes: { increment: 1 }, dislikes: { decrement: 1 } },
        });
      } else {
        await prisma.post.update({
          where: { id: like.resourceId },
          data: { dislikes: { increment: 1 }, likes: { decrement: 1 } },
        });
      }
    }
  }

  static async giveLike(input: CreateLikeDto): Promise<void> {
    try {
      const like = await prisma.like.findFirst({
        where: { userId: input.userId, type: input.type, resourceId: input.resourceId },
      });
      await prisma.like.update({
        where: { id: like.id },
        data: { isLike: input.isLike },
      });
      if (like.isLike !== input.isLike) {
        await this.swapLikeCounter(like, input.isLike);
      }
    } catch {
      await this.verifyResourceId(input.resourceId, input.type);
      const like = await prisma.like.create({
        data: {
          userId: input.userId,
          type: input.type,
          resourceId: input.resourceId,
          isLike: input.isLike,
        },
      });
      await this.incrementLikeCounter(like);
    }
  }

  static async removeLike(input: CreateLikeDto): Promise<void> {
    try {
      const like = await prisma.like.findFirst({
        where: {
          userId: input.userId,
          type: input.type,
          resourceId: input.resourceId,
          isLike: input.isLike,
        },
      });
      await this.decrementLikeCounter(like);
      await prisma.like.delete({ where: { id: like.id } });
    } catch {
      throw createError(404, 'Not Found Like');
    }
  }
}
