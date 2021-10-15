import { Prisma, Post } from '@prisma/client';
import { CreatePostDto } from '../dtos/posts/request/create-post.dto';
import createError from 'http-errors';
import { prisma } from '../server';
import { UpdatePostDto } from 'src/dtos/posts/request/update-post.dto';

export class PostsService {
  static async find(): Promise<Post[]> {
    return prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static async create(userId: number, input: CreatePostDto): Promise<Post> {
    try {
      return prisma.post.create({ data: { ...input, user: { connect: { id: userId } } } });
    } catch (error) {
      throw new createError.UnprocessableEntity('email already taken');
    }
  }

  static async findOne(id: number): Promise<Post> {
    return prisma.post.findUnique({ where: { id } });
  }

  static async findUserPosts(id: number): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        user: {
          id,
        },
      },
    });
  }

  static async update(id: number, input: UpdatePostDto): Promise<Post> {
    const post = await prisma.post.update({
      data: input,
      where: {
        id,
      },
    });

    return post;
  }

  static async delete(accountId: number, id: number): Promise<Post> {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) throw new console.error('no post');
    if (post.userId !== accountId) throw console.error('unauthorized');

    try {
      prisma.post.delete({ where: { id } });

      return post;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByMod(isMod: boolean, id: number): Promise<Post> {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) throw new console.error('no post');
    if (!isMod) throw console.error('unauthorized');

    try {
      prisma.post.delete({ where: { id } });

      return post;
    } catch (error) {
      throw error;
    }
  }
}
