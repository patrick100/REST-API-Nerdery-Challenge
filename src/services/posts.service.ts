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

  static async update(userId: number, id: number, input: UpdatePostDto): Promise<Post> {
    const currentUser = await prisma.post.findUnique({ where: { id: userId } });
    const post = await prisma.post.findUnique({ where: { id } });
    if (currentUser.id !== post.userId) throw new console.error('unauthorized');

    return prisma.post.update({
      data: input,
      where: {
        id,
      },
    });
  }

  static async delete(accountId: number, id: number): Promise<Post> {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) throw new console.error('no post');
    if (post.userId !== accountId) throw console.error('unauthorized');

    try {
      const deletedPost = await prisma.post.delete({ where: { id } });

      return deletedPost;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByMod(id: number): Promise<Post> {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) throw new console.error('no post');

    try {
      prisma.post.delete({ where: { id } });

      return post;
    } catch (error) {
      throw error;
    }
  }
}
