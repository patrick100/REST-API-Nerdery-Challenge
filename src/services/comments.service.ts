import { UpdateCommentDto } from './../dtos/comments/request/update-comment.dto';
import { CreateCommentDto } from './../dtos/comments/request/create-comment.dto';
import createError from 'http-errors';
import { Prisma, Comment, Post } from '@prisma/client';
import { prisma } from '../server';

export class CommentsService {
  static async find(id: number): Promise<Comment[]> {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new createError.NotFound(`Post ${id} not Found`);
    }

    console.log(id);
    return prisma.comment.findMany({
      where: {
        postId: id,
      },
    });
  }

  static async create(
    currentUser: number,
    postId: number,
    comment: CreateCommentDto
  ): Promise<Comment> {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new createError.NotFound(`Post not Found`);
    }

    return prisma.comment.create({
      data: {
        ...comment,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: currentUser,
          },
        },
      },
    });
  }

  static async update(userId: number, id: number, input: UpdateCommentDto): Promise<Comment> {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (comment.userId !== userId) {
      throw new createError.Forbidden(`You are not allowed to update this comment`);
    }

    return prisma.comment.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
  }

  static async delete(userId: number, id: number): Promise<Comment> {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new createError.NotFound(`Comment not Found`);
    }

    if (comment.userId !== userId) {
      throw new createError.Forbidden(`You are not allowed to delete this comment`);
    }

    try {
      const deletedcomment = await prisma.comment.delete({
        where: {
          id,
        },
      });

      return deletedcomment;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByMod(userId: number, id: number): Promise<Comment> {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new createError.NotFound(`Comment not Found`);
    }

    try {
      const deletedcomment = await prisma.comment.delete({
        where: {
          id,
        },
      });

      return deletedcomment;
    } catch (error) {
      throw error;
    }
  }
}
